from flask import Blueprint, jsonify, request, current_app
from flask_login import login_required, current_user, login_user, logout_user
from models import db, Login, Venue, Booking, Review
from flask_bcrypt import Bcrypt
from datetime import datetime, date, time
from sqlalchemy import and_, or_, func
import os
from werkzeug.utils import secure_filename

# Initialize bcrypt
bcrypt = Bcrypt()

# Create blueprint
api = Blueprint('api', __name__)

# Helper functions
def allowed_file(filename):
    """Check if file extension is allowed"""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_profile_image(file):
    """Save profile image and return filename"""
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{current_user.sr_no}_{file.filename}")
        upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        return filename
    return None

# Authentication routes
@api.route("/register", methods=["POST"])
def register():
    """User registration endpoint"""
    try:
        data = request.json
        required_fields = ["fullname", "email", "password", "contact_number", "designation"]
        
        # Validate required fields
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Validate designation
        if data["designation"] not in ["player", "facilities"]:
            return jsonify({"error": "Invalid designation. Must be 'player' or 'facilities'"}), 400
        
        # Check if email already exists
        if Login.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already registered"}), 409
        
        # Hash password
        password_hash = bcrypt.generate_password_hash(data["password"]).decode('utf-8')
        
        # Create new user
        new_user = Login(
            fullname=data["fullname"],
            email=data["email"],
            password_hash=password_hash,
            contact_number=data["contact_number"],
            designation=data["designation"],
            profile_image=data.get("profile_image", "")
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            "message": "User registered successfully",
            "user": new_user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500

@api.route("/login", methods=["POST"])
def login():
    """User login endpoint"""
    try:
        data = request.json
        
        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email and password required"}), 400
        
        # Find user by email
        user = Login.query.filter_by(email=data["email"]).first()
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Verify password
        if bcrypt.check_password_hash(user.password_hash, data["password"]):
            login_user(user)
            return jsonify({
                "message": "Login successful",
                "user": user.to_dict()
            }), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
            
    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500

@api.route("/logout", methods=["POST"])
@login_required
def logout():
    """User logout endpoint"""
    try:
        logout_user()
        return jsonify({"message": "Logout successful"}), 200
    except Exception as e:
        return jsonify({"error": f"Logout failed: {str(e)}"}), 500

@api.route("/user", methods=["GET"])
@login_required
def get_user():
    """Get current user information"""
    return jsonify(current_user.to_dict()), 200

@api.route("/user", methods=["PUT"])
@login_required
def update_user():
    """Update user profile"""
    try:
        data = request.json
        
        # Update allowed fields
        if "fullname" in data:
            current_user.fullname = data["fullname"]
        if "contact_number" in data:
            current_user.contact_number = data["contact_number"]
        
        db.session.commit()
        
        return jsonify({
            "message": "Profile updated successfully",
            "user": current_user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Update failed: {str(e)}"}), 500

# Venue routes
@api.route("/venues", methods=["GET"])
def get_venues():
    """Get all venues with optional filtering"""
    try:
        # Get query parameters
        sport = request.args.get('sport')
        min_price = request.args.get('min_price')
        max_price = request.args.get('max_price')
        rating = request.args.get('rating')
        
        # Build query
        query = Venue.query
        
        if sport:
            query = query.filter(Venue.sports.contains(sport))
        if min_price:
            query = query.filter(Venue.per_hr_charge >= float(min_price))
        if max_price:
            query = query.filter(Venue.per_hr_charge <= float(max_price))
        if rating:
            query = query.filter(Venue.rating >= float(rating))
        
        venues = query.all()
        venues_list = [venue.to_dict() for venue in venues]
        
        return jsonify(venues_list), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to fetch venues: {str(e)}"}), 500

@api.route("/venue/<int:venue_id>", methods=["GET"])
def get_venue(venue_id):
    """Get specific venue by ID"""
    try:
        venue = Venue.query.get(venue_id)
        if not venue:
            return jsonify({"error": "Venue not found"}), 404
        
        return jsonify(venue.to_dict()), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to fetch venue: {str(e)}"}), 500

@api.route("/venue", methods=["POST"])
@login_required
def create_venue():
    """Create a new venue (facilities users only)"""
    try:
        if current_user.designation != "facilities":
            return jsonify({"error": "Only facilities users can create venues"}), 403
        
        data = request.json
        required_fields = ["address", "court_name", "per_hr_charge", "operating_days", "operating_hours", "sports"]
        
        # Validate required fields
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Create new venue
        new_venue = Venue(
            user_id=current_user.sr_no,
            address=data["address"],
            court_name=data["court_name"],
            per_hr_charge=data["per_hr_charge"],
            operating_days=data["operating_days"],
            operating_hours=data["operating_hours"],
            amenities=data.get("amenities", ""),
            sports=data["sports"]
        )
        
        db.session.add(new_venue)
        db.session.commit()
        
        return jsonify({
            "message": "Venue created successfully",
            "venue": new_venue.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Venue creation failed: {str(e)}"}), 500

@api.route("/venue/<int:venue_id>", methods=["PUT"])
@login_required
def update_venue(venue_id):
    """Update venue (owner only)"""
    try:
        venue = Venue.query.get(venue_id)
        if not venue:
            return jsonify({"error": "Venue not found"}), 404
        
        if venue.user_id != current_user.sr_no:
            return jsonify({"error": "Unauthorized to update this venue"}), 403
        
        data = request.json
        
        # Update allowed fields
        if "address" in data:
            venue.address = data["address"]
        if "court_name" in data:
            venue.court_name = data["court_name"]
        if "per_hr_charge" in data:
            venue.per_hr_charge = data["per_hr_charge"]
        if "operating_days" in data:
            venue.operating_days = data["operating_days"]
        if "operating_hours" in data:
            venue.operating_hours = data["operating_hours"]
        if "amenities" in data:
            venue.amenities = data["amenities"]
        if "sports" in data:
            venue.sports = data["sports"]
        
        db.session.commit()
        
        return jsonify({
            "message": "Venue updated successfully",
            "venue": venue.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Venue update failed: {str(e)}"}), 500

@api.route("/venue/<int:venue_id>", methods=["DELETE"])
@login_required
def delete_venue(venue_id):
    """Delete venue (owner only)"""
    try:
        venue = Venue.query.get(venue_id)
        if not venue:
            return jsonify({"error": "Venue not found"}), 404
        
        if venue.user_id != current_user.sr_no:
            return jsonify({"error": "Unauthorized to delete this venue"}), 403
        
        db.session.delete(venue)
        db.session.commit()
        
        return jsonify({"message": "Venue deleted successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Venue deletion failed: {str(e)}"}), 500

# Booking routes
@api.route("/booking", methods=["POST"])
@login_required
def create_booking():
    """Create a new booking"""
    try:
        data = request.json
        required_fields = ["venue_id", "st_date", "start_time", "duration", "pay_method"]
        
        # Validate required fields
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Check if venue exists
        venue = Venue.query.get(data["venue_id"])
        if not venue:
            return jsonify({"error": "Venue not found"}), 404
        
        # Parse date and time
        try:
            booking_date = datetime.strptime(data["st_date"], "%Y-%m-%d").date()
            start_time = datetime.strptime(data["start_time"], "%H:%M").time()
        except ValueError:
            return jsonify({"error": "Invalid date or time format"}), 400
        
        # Check if venue is available
        existing_booking = Booking.query.filter(
            and_(
                Booking.venue_id == data["venue_id"],
                Booking.st_date == booking_date,
                Booking.status.in_(['confirmed', 'pending']),
                or_(
                    and_(
                        Booking.start_time <= start_time,
                        func.addtime(Booking.start_time, func.sec_to_time(Booking.duration * 3600)) > start_time
                    ),
                    and_(
                        start_time <= Booking.start_time,
                        func.addtime(start_time, func.sec_to_time(data["duration"] * 3600)) > Booking.start_time
                    )
                )
            )
        ).first()
        
        if existing_booking:
            return jsonify({"error": "Venue is not available at this time"}), 409
        
        # Calculate total amount
        total_amount = float(venue.per_hr_charge) * data["duration"]
        
        # Create booking
        new_booking = Booking(
            venue_id=data["venue_id"],
            player_id=current_user.sr_no,
            player_name=current_user.fullname,
            email=current_user.email,
            st_date=booking_date,
            start_time=start_time,
            duration=data["duration"],
            pay_method=data["pay_method"],
            total_amount=total_amount
        )
        
        db.session.add(new_booking)
        db.session.commit()
        
        return jsonify({
            "message": "Booking created successfully",
            "booking": new_booking.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Booking creation failed: {str(e)}"}), 500

@api.route("/bookings", methods=["GET"])
@login_required
def get_bookings():
    """Get user's bookings"""
    try:
        if current_user.designation == "facilities":
            # For facilities users, get bookings for their venues
            venues = Venue.query.filter_by(user_id=current_user.sr_no).all()
            venue_ids = [v.v_no for v in venues]
            bookings = Booking.query.filter(Booking.venue_id.in_(venue_ids)).all()
        else:
            # For players, get their own bookings
            bookings = Booking.query.filter_by(player_id=current_user.sr_no).all()
        
        bookings_list = [booking.to_dict() for booking in bookings]
        return jsonify(bookings_list), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to fetch bookings: {str(e)}"}), 500

@api.route("/booking/<int:booking_id>", methods=["PUT"])
@login_required
def update_booking_status(booking_id):
    """Update booking status (venue owner or player)"""
    try:
        booking = Booking.query.get(booking_id)
        if not booking:
            return jsonify({"error": "Booking not found"}), 404
        
        # Check if user is authorized
        venue = Venue.query.get(booking.venue_id)
        if not (current_user.sr_no == booking.player_id or current_user.sr_no == venue.user_id):
            return jsonify({"error": "Unauthorized to update this booking"}), 403
        
        data = request.json
        if "status" not in data:
            return jsonify({"error": "Status field required"}), 400
        
        # Validate status
        valid_statuses = ['pending', 'confirmed', 'cancelled', 'completed']
        if data["status"] not in valid_statuses:
            return jsonify({"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400
        
        booking.status = data["status"]
        db.session.commit()
        
        return jsonify({
            "message": "Booking status updated successfully",
            "booking": booking.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Booking update failed: {str(e)}"}), 500

# Review routes
@api.route("/venue/<int:venue_id>/review", methods=["POST"])
@login_required
def create_review(venue_id):
    """Create a review for a venue"""
    try:
        # Check if venue exists
        venue = Venue.query.get(venue_id)
        if not venue:
            return jsonify({"error": "Venue not found"}), 404
        
        # Check if user has already reviewed this venue
        existing_review = Review.query.filter_by(
            venue_id=venue_id, 
            user_id=current_user.sr_no
        ).first()
        
        if existing_review:
            return jsonify({"error": "You have already reviewed this venue"}), 409
        
        data = request.json
        if not data.get("rating") or not (1 <= data["rating"] <= 5):
            return jsonify({"error": "Rating must be between 1 and 5"}), 400
        
        # Create review
        new_review = Review(
            venue_id=venue_id,
            user_id=current_user.sr_no,
            rating=data["rating"],
            comment=data.get("comment", "")
        )
        
        db.session.add(new_review)
        db.session.commit()
        
        return jsonify({
            "message": "Review created successfully",
            "review": new_review.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Review creation failed: {str(e)}"}), 500

@api.route("/venue/<int:venue_id>/reviews", methods=["GET"])
def get_venue_reviews(venue_id):
    """Get reviews for a specific venue"""
    try:
        reviews = Review.query.filter_by(venue_id=venue_id).all()
        reviews_list = [review.to_dict() for review in reviews]
        return jsonify(reviews_list), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to fetch reviews: {str(e)}"}), 500

# Search and filter routes
@api.route("/search/venues", methods=["GET"])
def search_venues():
    """Search venues by name, address, or sports"""
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify({"error": "Search query required"}), 400
        
        venues = Venue.query.filter(
            or_(
                Venue.court_name.contains(query),
                Venue.address.contains(query),
                Venue.sports.contains(query)
            )
        ).all()
        
        venues_list = [venue.to_dict() for venue in venues]
        return jsonify(venues_list), 200
        
    except Exception as e:
        return jsonify({"error": f"Search failed: {str(e)}"}), 500

# Dashboard routes
@api.route("/dashboard/stats", methods=["GET"])
@login_required
def get_dashboard_stats():
    """Get dashboard statistics for the current user"""
    try:
        if current_user.designation == "facilities":
            # Facilities user stats
            total_venues = Venue.query.filter_by(user_id=current_user.sr_no).count()
            total_bookings = Booking.query.join(Venue).filter(Venue.user_id == current_user.sr_no).count()
            total_revenue = db.session.query(func.sum(Booking.total_amount)).join(Venue).filter(
                and_(Venue.user_id == current_user.sr_no, Booking.status == 'completed')
            ).scalar() or 0
            
            stats = {
                "total_venues": total_venues,
                "total_bookings": total_bookings,
                "total_revenue": float(total_revenue),
                "user_type": "facilities"
            }
        else:
            # Player stats
            total_bookings = Booking.query.filter_by(player_id=current_user.sr_no).count()
            completed_bookings = Booking.query.filter_by(
                player_id=current_user.sr_no, 
                status='completed'
            ).count()
            
            stats = {
                "total_bookings": total_bookings,
                "completed_bookings": completed_bookings,
                "user_type": "player"
            }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to fetch stats: {str(e)}"}), 500
