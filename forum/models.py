from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import event

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
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    venues = relationship('Venue', backref='owner', lazy='dynamic', cascade='all, delete-orphan')
    bookings = relationship('Booking', backref='player', lazy='dynamic', cascade='all, delete-orphan')
    reviews = relationship('Review', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    
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
            "created_at": self.created_at.isoformat() if self.created_at else None
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
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    bookings = relationship('Booking', backref='venue', lazy='dynamic', cascade='all, delete-orphan')
    reviews = relationship('Review', backref='venue', lazy='dynamic', cascade='all, delete-orphan')
    
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
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "owner_name": self.owner.fullname if self.owner else None
        }
    
    def __repr__(self):
        return f'<Venue {self.court_name}>'

class Booking(db.Model):
    __tablename__ = 'booking'
    
    Bno = db.Column(db.Integer, primary_key=True, autoincrement=True)
    venue_id = db.Column(db.Integer, db.ForeignKey('venue.v_no'), nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey('login.sr_no'), nullable=False)
    player_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    st_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    pay_method = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "Bno": self.Bno,
            "venue_id": self.venue_id,
            "player_id": self.player_id,
            "player_name": self.player_name,
            "email": self.email,
            "st_date": self.st_date.isoformat() if self.st_date else None,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "duration": self.duration,
            "pay_method": self.pay_method,
            "status": self.status,
            "total_amount": float(self.total_amount) if self.total_amount else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "venue_name": self.venue.court_name if self.venue else None,
            "venue_address": self.venue.address if self.venue else None
        }
    
    def __repr__(self):
        return f'<Booking {self.Bno}>'

class Review(db.Model):
    __tablename__ = 'reviews'
    
    review_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    venue_id = db.Column(db.Integer, db.ForeignKey('venue.v_no'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('login.sr_no'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "review_id": self.review_id,
            "venue_id": self.venue_id,
            "user_id": self.user_id,
            "rating": self.rating,
            "comment": self.comment,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "user_name": self.user.fullname if self.user else None
        }
    
    def __repr__(self):
        return f'<Review {self.review_id}>'

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
        from sqlalchemy import func
        avg_rating = db.session.query(func.avg(Review.rating)).filter_by(venue_id=target.venue_id).scalar()
        
        if avg_rating:
            venue = Venue.query.get(target.venue_id)
            if venue:
                venue.rating = round(float(avg_rating), 1)
                db.session.commit()
    except Exception as e:
        print(f"Error updating venue rating: {e}")
        db.session.rollback()
