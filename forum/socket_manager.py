from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_login import current_user
from models import db, Notification, Booking, Venue, Login
from datetime import datetime
import json

socketio = SocketIO(cors_allowed_origins="*")

# Store connected users
connected_users = {}

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print(f"Client connected: {request.sid}")
    if current_user.is_authenticated:
        user_id = current_user.sr_no
        connected_users[request.sid] = user_id
        join_room(f"user_{user_id}")
        emit('connected', {'message': 'Connected to real-time updates'})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print(f"Client disconnected: {request.sid}")
    if request.sid in connected_users:
        user_id = connected_users[request.sid]
        leave_room(f"user_{user_id}")
        del connected_users[request.sid]

@socketio.on('join_venue')
def handle_join_venue(data):
    """Join venue room for real-time updates"""
    venue_id = data.get('venue_id')
    if venue_id:
        join_room(f"venue_{venue_id}")
        emit('joined_venue', {'venue_id': venue_id})

@socketio.on('leave_venue')
def handle_leave_venue(data):
    """Leave venue room"""
    venue_id = data.get('venue_id')
    if venue_id:
        leave_room(f"venue_{venue_id}")
        emit('left_venue', {'venue_id': venue_id})

def send_notification(user_id, title, message, notification_type, data=None):
    """Send notification to specific user"""
    try:
        # Create notification in database
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notification_type,
            data=json.dumps(data) if data else None
        )
        db.session.add(notification)
        db.session.commit()
        
        # Send real-time notification
        socketio.emit('new_notification', notification.to_dict(), room=f"user_{user_id}")
        
        return notification
    except Exception as e:
        print(f"Error sending notification: {e}")
        db.session.rollback()
        return None

def broadcast_venue_update(venue_id, update_type, data):
    """Broadcast venue updates to all users watching that venue"""
    socketio.emit('venue_update', {
        'venue_id': venue_id,
        'type': update_type,
        'data': data,
        'timestamp': datetime.utcnow().isoformat()
    }, room=f"venue_{venue_id}")

def broadcast_booking_update(booking_id, update_type, data):
    """Broadcast booking updates"""
    try:
        booking = Booking.query.get(booking_id)
        if booking:
            # Notify venue owner
            venue_owner_id = booking.venue.user_id
            socketio.emit('booking_update', {
                'booking_id': booking_id,
                'type': update_type,
                'data': data,
                'timestamp': datetime.utcnow().isoformat()
            }, room=f"user_{venue_owner_id}")
            
            # Notify booking user
            socketio.emit('booking_update', {
                'booking_id': booking_id,
                'type': update_type,
                'data': data,
                'timestamp': datetime.utcnow().isoformat()
            }, room=f"user_{booking.player_id}")
    except Exception as e:
        print(f"Error broadcasting booking update: {e}")

def broadcast_system_message(message, user_ids=None):
    """Broadcast system message to specific users or all users"""
    if user_ids:
        for user_id in user_ids:
            socketio.emit('system_message', {
                'message': message,
                'timestamp': datetime.utcnow().isoformat()
            }, room=f"user_{user_id}")
    else:
        socketio.emit('system_message', {
            'message': message,
            'timestamp': datetime.utcnow().isoformat()
        })

# Event handlers for database changes
def on_booking_created(booking):
    """Handle new booking creation"""
    try:
        # Notify venue owner
        venue_owner = booking.venue.owner
        send_notification(
            venue_owner.sr_no,
            "New Booking Request",
            f"New booking request for {booking.venue.court_name} on {booking.st_date}",
            "booking",
            {"booking_id": booking.Bno, "venue_id": booking.venue_id}
        )
        
        # Broadcast venue update
        broadcast_venue_update(booking.venue_id, "new_booking", booking.to_dict())
        
    except Exception as e:
        print(f"Error handling booking creation: {e}")

def on_booking_status_changed(booking, old_status):
    """Handle booking status changes"""
    try:
        # Notify user about status change
        status_messages = {
            'confirmed': f"Your booking for {booking.venue.court_name} has been confirmed!",
            'cancelled': f"Your booking for {booking.venue.court_name} has been cancelled.",
            'completed': f"Your booking for {booking.venue.court_name} has been completed.",
            'no_show': f"Your booking for {booking.venue.court_name} was marked as no-show."
        }
        
        if booking.status in status_messages:
            send_notification(
                booking.player_id,
                f"Booking {booking.status.title()}",
                status_messages[booking.status],
                "booking",
                {"booking_id": booking.Bno, "venue_id": booking.venue_id}
            )
        
        # Broadcast booking update
        broadcast_booking_update(booking.Bno, "status_changed", {
            "old_status": old_status,
            "new_status": booking.status,
            "booking": booking.to_dict()
        })
        
    except Exception as e:
        print(f"Error handling booking status change: {e}")

def on_review_created(review):
    """Handle new review creation"""
    try:
        # Notify venue owner
        venue_owner = review.venue.owner
        send_notification(
            venue_owner.sr_no,
            "New Review",
            f"New {review.rating}-star review for {review.venue.court_name}",
            "review",
            {"review_id": review.review_id, "venue_id": review.venue_id}
        )
        
        # Broadcast venue update
        broadcast_venue_update(review.venue_id, "new_review", review.to_dict())
        
    except Exception as e:
        print(f"Error handling review creation: {e}")

def on_venue_updated(venue):
    """Handle venue updates"""
    try:
        # Broadcast venue update to all users watching this venue
        broadcast_venue_update(venue.v_no, "venue_updated", venue.to_dict())
        
    except Exception as e:
        print(f"Error handling venue update: {e}")

# Utility functions for real-time features
def get_online_users():
    """Get list of online users"""
    return list(set(connected_users.values()))

def is_user_online(user_id):
    """Check if user is online"""
    return user_id in connected_users.values()

def send_typing_indicator(venue_id, user_id, is_typing):
    """Send typing indicator for chat features"""
    socketio.emit('typing_indicator', {
        'venue_id': venue_id,
        'user_id': user_id,
        'is_typing': is_typing
    }, room=f"venue_{venue_id}")

def send_chat_message(venue_id, user_id, message):
    """Send chat message"""
    try:
        user = Login.query.get(user_id)
        socketio.emit('chat_message', {
            'venue_id': venue_id,
            'user_id': user_id,
            'user_name': user.fullname if user else 'Unknown',
            'message': message,
            'timestamp': datetime.utcnow().isoformat()
        }, room=f"venue_{venue_id}")
    except Exception as e:
        print(f"Error sending chat message: {e}")
