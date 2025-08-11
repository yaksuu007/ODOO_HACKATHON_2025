from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/hackathon'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Recommended setting
db = SQLAlchemy(app)


# Booking table
class Booking(db.Model): 
    __tablename__ = 'booking'  # Always explicitly define tablename
    sno = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(50), nullable=False)  # Increased length
    email = db.Column(db.String(100), nullable=False)
    st_date = db.Column(db.Date, nullable=False)  # Better to use Date instead of Integer
    duration = db.Column(db.Integer, nullable=True)
    courts = db.Column(db.Integer, nullable=False)
    pay_method = db.Column(db.String(20), nullable=False)  # Store as string or Enum ideally

# Login table
class Login(db.Model):
    __tablename__ = 'login'
    
    sr_no = db.Column(db.Integer, primary_key=True, autoincrement=True)
    profile_image = db.Column(db.String(255), nullable=True)
    fullname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    contact_number = db.Column(db.String(15), nullable=False)
    designation = db.Column(db.Enum('player', 'facilities'), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    facilities = db.relationship('Facility', backref='owner', lazy=True)

# Facility table
class Facility(db.Model):
    __tablename__ = 'facility'
    
    sr_no = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('login.sr_no'), nullable=False)
    address = db.Column(db.Text, nullable=False)
    court_name = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Numeric(2, 1), nullable=True)
    per_hr_charge = db.Column(db.Numeric(10, 2), nullable=False)
    operating_days = db.Column(db.String(100), nullable=False)  # e.g. Mon-Sun
    operating_hours = db.Column(db.String(50), nullable=False)  # e.g. 6 AM - 10 PM
    amenities = db.Column(db.Text, nullable=True)
    sports = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


@app.route("/")
def index():
    return "Flask is running!"


# Only run DB operations inside app context
with app.app_context():
    db.create_all()
    
    # Example query (don't leave this at global level)
    data = Booking.query.all()
    print("Booking data:", data)


if __name__ == '__main__':
    app.run(debug=True)