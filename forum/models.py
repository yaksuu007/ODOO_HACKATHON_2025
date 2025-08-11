from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime, timedelta
from sqlalchemy.orm import relationship
from sqlalchemy import event, func
import json

db = SQLAlchemy()

class Login(db.Model, UserMixin):
    __tablename__ = 'login'
    
    sr_no = db.Column(db.Integer, primary_key=True, autoincrement=True)
    profile_image = db.Column(db.String(255), nullable=True)
    fullname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    contact_number = db.Column(db.String(15), nullable=False)
    designation = db.Column(db.Enum('player', 'facilities'), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    venues = relationship('Venue', backref='owner', lazy='dynamic', cascade='all, delete-orphan')
    bookings = relationship('Booking', backref='player', lazy='dynamic', cascade='all, delete-orphan')
    reviews = relationship('Review', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    notifications = relationship('Notification', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    payments = relationship('Payment', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    
    def get_id(self):
        return str(self.sr_no)
    
    def to_dict(self):
        return {
            "sr_no": self.sr_no,
            "profile_image": self.profile_image,
            "fullname": self.fullname,
            "email": self.email,
            "contact_number": self.contact_number,
            "designation": self.designation,
            "is_verified": self.is_verified,
            "is_active": self.is_active,
            "last_login": self.last_login.isoformat() if self.last_login else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<User {self.fullname}>'

class Venue(db.Model):
    __tablename__ = 'venue'
    
    v_no = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('login.sr_no'), nullable=False)
    address = db.Column(db.Text, nullable=False)
    court_name = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Numeric(2, 1), nullable=True)
    per_hr_charge = db.Column(db.Numeric(10, 2), nullable=False)
    operating_days = db.Column(db.String(100), nullable=False)
    operating_hours = db.Column(db.String(50), nullable=False)
    amenities = db.Column(db.Text, nullable=True)
    sports = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    total_bookings = db.Column(db.Integer, default=0)
    total_revenue = db.Column(db.Numeric(12, 2), default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    bookings = relationship('Booking', backref='venue', lazy='dynamic', cascade='all, delete-orphan')
    reviews = relationship('Review', backref='venue', lazy='dynamic', cascade='all, delete-orphan')
    availability = relationship('VenueAvailability', backref='venue', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            "v_no": self.v_no,
            "user_id": self.user_id,
            "address": self.address,
            "court_name": self.court_name,
            "rating": float(self.rating) if self.rating else None,
            "per_hr_charge": float(self.per_hr_charge),
            "operating_days": self.operating_days,
            "operating_hours": self.operating_hours,
            "amenities": self.amenities,
            "sports": self.sports,
            "is_active": self.is_active,
            "total_bookings": self.total_bookings,
            "total_revenue": float(self.total_revenue) if self.total_revenue else 0,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "owner_name": self.owner.fullname if self.owner else None
        }
    
    def __repr__(self):
        return f'<Venue {self.court_name}>'

class VenueAvailability(db.Model):
    __tablename__ = 'venue_availability'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    venue_id = db.Column(db.Integer, db.ForeignKey('venue.v_no'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    is_available = db.Column(db.Boolean, default=True)
    price_multiplier = db.Column(db.Numeric(3, 2), default=1.00)  # For peak/off-peak pricing
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "venue_id": self.venue_id,
            "date": self.date.isoformat() if self.date else None,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "is_available": self.is_available,
            "price_multiplier": float(self.price_multiplier) if self.price_multiplier else 1.0,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Booking(db.Model):
    __tablename__ = 'booking'
    
    Bno = db.Column(db.Integer, primary_key=True, autoincrement=True)
    venue_id = db.Column(db.Integer, db.ForeignKey('venue.v_no'), nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey('login.sr_no'), nullable=False)
    player_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    st_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    pay_method = db.Column(db.String(20), nullable=False)
    status = db.Column(db.Enum('pending', 'confirmed', 'cancelled', 'completed', 'no_show'), nullable=False, default='pending')
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    payment = relationship('Payment', backref='booking', uselist=False, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            "Bno": self.Bno,
            "venue_id": self.venue_id,
            "player_id": self.player_id,
            "player_name": self.player_name,
            "email": self.email,
            "st_date": self.st_date.isoformat() if self.st_date else None,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "duration": self.duration,
            "pay_method": self.pay_method,
            "status": self.status,
            "total_amount": float(self.total_amount) if self.total_amount else None,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "venue_name": self.venue.court_name if self.venue else None,
            "venue_address": self.venue.address if self.venue else None,
            "payment_status": self.payment.status if self.payment else None
        }
    
    def __repr__(self):
        return f'<Booking {self.Bno}>'

class Payment(db.Model):
    __tablename__ = 'payment'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.Bno'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('login.sr_no'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    status = db.Column(db.Enum('pending', 'completed', 'failed', 'refunded'), nullable=False, default='pending')
    transaction_id = db.Column(db.String(100), nullable=True)
    payment_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "booking_id": self.booking_id,
            "user_id": self.user_id,
            "amount": float(self.amount) if self.amount else None,
            "payment_method": self.payment_method,
            "status": self.status,
            "transaction_id": self.transaction_id,
            "payment_date": self.payment_date.isoformat() if self.payment_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Review(db.Model):
    __tablename__ = 'reviews'
    
    review_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    venue_id = db.Column(db.Integer, db.ForeignKey('venue.v_no'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('login.sr_no'), nullable=False)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.Bno'), nullable=True)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "review_id": self.review_id,
            "venue_id": self.venue_id,
            "user_id": self.user_id,
            "booking_id": self.booking_id,
            "rating": self.rating,
            "comment": self.comment,
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "user_name": self.user.fullname if self.user else None
        }
    
    def __repr__(self):
        return f'<Review {self.review_id}>'

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('login.sr_no'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.Enum('booking', 'payment', 'review', 'system', 'promotion'), nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    data = db.Column(db.Text, nullable=True)  # JSON data for additional info
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "message": self.message,
            "type": self.type,
            "is_read": self.is_read,
            "data": json.loads(self.data) if self.data else None,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class VenueImage(db.Model):
    __tablename__ = 'venue_images'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    venue_id = db.Column(db.Integer, db.ForeignKey('venue.v_no'), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "venue_id": self.venue_id,
            "image_url": self.image_url,
            "is_primary": self.is_primary,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Match(db.Model):
    __bind_key__ = 'matches'
    __tablename__ = 'matches'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(150), nullable=False)
    sport = db.Column(db.String(50), nullable=False)
    venue_id = db.Column(db.Integer, nullable=False)  # references primary DB venue.v_no logically
    date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    duration_hours = db.Column(db.Integer, nullable=False, default=1)
    max_players = db.Column(db.Integer, nullable=False, default=10)
    current_players = db.Column(db.Integer, nullable=False, default=1)
    status = db.Column(db.Enum('scheduled', 'cancelled', 'completed'), nullable=False, default='scheduled')
    created_by = db.Column(db.Integer, nullable=False)  # references login.sr_no logically
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        try:
            # Lazy import to avoid circulars
            venue = Venue.query.get(self.venue_id)
            venue_name = venue.court_name if venue else None
        except Exception:
            venue_name = None

        return {
            "id": self.id,
            "title": self.title,
            "sport": self.sport,
            "venue_id": self.venue_id,
            "venue_name": venue_name,
            "date": self.date.isoformat() if self.date else None,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "duration_hours": self.duration_hours,
            "max_players": self.max_players,
            "current_players": self.current_players,
            "status": self.status,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

# Event listeners for automatic updates
@event.listens_for(Venue, 'after_insert')
def update_venue_rating(mapper, connection, target):
    """Update venue rating when a new review is added"""
    pass  # This will be implemented in the review creation logic

@event.listens_for(Review, 'after_insert')
def update_venue_rating_after_review(mapper, connection, target):
    """Update venue rating when a new review is added"""
    try:
        # Calculate new average rating
        avg_rating = db.session.query(func.avg(Review.rating)).filter_by(venue_id=target.venue_id).scalar()
        
        if avg_rating:
            venue = Venue.query.get(target.venue_id)
            if venue:
                venue.rating = round(float(avg_rating), 1)
                db.session.commit()
    except Exception as e:
        print(f"Error updating venue rating: {e}")
        db.session.rollback()

@event.listens_for(Booking, 'after_insert')
def create_payment_record(mapper, connection, target):
    """Create payment record when booking is created"""
    try:
        payment = Payment(
            booking_id=target.Bno,
            user_id=target.player_id,
            amount=target.total_amount,
            payment_method=target.pay_method,
            status='pending'
        )
        db.session.add(payment)
        db.session.commit()
    except Exception as e:
        print(f"Error creating payment record: {e}")
        db.session.rollback()

@event.listens_for(Booking, 'after_update')
def update_venue_stats(mapper, connection, target):
    """Update venue statistics when booking status changes"""
    try:
        venue = Venue.query.get(target.venue_id)
        if venue:
            # Update total bookings
            confirmed_bookings = Booking.query.filter_by(
                venue_id=target.venue_id, 
                status='confirmed'
            ).count()
            venue.total_bookings = confirmed_bookings
            
            # Update total revenue
            total_revenue = db.session.query(func.sum(Booking.total_amount)).filter_by(
                venue_id=target.venue_id, 
                status='confirmed'
            ).scalar()
            venue.total_revenue = total_revenue or 0
            
            db.session.commit()
    except Exception as e:
        print(f"Error updating venue stats: {e}")
        db.session.rollback()
