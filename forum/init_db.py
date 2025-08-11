from app import create_app
from models import db, Login, Venue, VenueAvailability, VenueImage, Booking, Payment, Review, Notification
from flask_bcrypt import Bcrypt
from datetime import datetime, date, time, timedelta
import random

def init_database():
    """Initialize database with tables and sample data"""
    app = create_app()
    
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✅ Database tables created successfully!")
        
        # Initialize bcrypt
        bcrypt = Bcrypt(app)
        
        # Check if sample data already exists
        if Login.query.first():
            print("⚠️  Database already contains data. Skipping sample data creation.")
            return
        
        print("📝 Creating sample data...")
        
        # Create sample users
        users = [
            {
                'fullname': 'John Player',
                'email': 'john@example.com',
                'password': 'password123',
                'contact_number': '1234567890',
                'designation': 'player',
                'is_verified': True
            },
            {
                'fullname': 'Sarah Owner',
                'email': 'sarah@example.com',
                'password': 'password123',
                'contact_number': '9876543210',
                'designation': 'facilities',
                'is_verified': True
            },
            {
                'fullname': 'Mike Manager',
                'email': 'mike@example.com',
                'password': 'password123',
                'contact_number': '5555555555',
                'designation': 'facilities',
                'is_verified': True
            },
            {
                'fullname': 'Lisa Player',
                'email': 'lisa@example.com',
                'password': 'password123',
                'contact_number': '1111111111',
                'designation': 'player',
                'is_verified': True
            }
        ]
        
        created_users = []
        for user_data in users:
            password_hash = bcrypt.generate_password_hash(user_data['password']).decode('utf-8')
            user = Login(
                fullname=user_data['fullname'],
                email=user_data['email'],
                password_hash=password_hash,
                contact_number=user_data['contact_number'],
                designation=user_data['designation'],
                is_verified=user_data['is_verified']
            )
            db.session.add(user)
            created_users.append(user)
        
        db.session.commit()
        print(f"✅ Created {len(created_users)} users")
        
        # Create sample venues
        venues = [
            {
                'court_name': 'Green Valley Tennis Court',
                'address': '123 Tennis Lane, Sports City',
                'per_hr_charge': 50.00,
                'operating_days': 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                'operating_hours': '6:00 AM - 10:00 PM',
                'amenities': 'Tennis rackets, balls, water dispenser, parking',
                'sports': 'Tennis',
                'user_id': created_users[1].sr_no  # Sarah Owner
            },
            {
                'court_name': 'Skyline Badminton Arena',
                'address': '456 Badminton Street, Downtown',
                'per_hr_charge': 30.00,
                'operating_days': 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
                'operating_hours': '7:00 AM - 11:00 PM',
                'amenities': 'Badminton rackets, shuttlecocks, changing rooms',
                'sports': 'Badminton',
                'user_id': created_users[2].sr_no  # Mike Manager
            },
            {
                'court_name': 'Elite Basketball Court',
                'address': '789 Basketball Road, Sports Complex',
                'per_hr_charge': 80.00,
                'operating_days': 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                'operating_hours': '5:00 AM - 12:00 AM',
                'amenities': 'Basketball, scoreboard, floodlights, seating',
                'sports': 'Basketball',
                'user_id': created_users[1].sr_no  # Sarah Owner
            }
        ]
        
        created_venues = []
        for venue_data in venues:
            venue = Venue(**venue_data)
            db.session.add(venue)
            created_venues.append(venue)
        
        db.session.commit()
        print(f"✅ Created {len(created_venues)} venues")
        
        # Create venue availability
        for venue in created_venues:
            # Create availability for next 30 days
            for i in range(30):
                current_date = date.today() + timedelta(days=i)
                
                # Create multiple time slots per day
                time_slots = [
                    (time(6, 0), time(8, 0)),
                    (time(8, 0), time(10, 0)),
                    (time(10, 0), time(12, 0)),
                    (time(14, 0), time(16, 0)),
                    (time(16, 0), time(18, 0)),
                    (time(18, 0), time(20, 0)),
                    (time(20, 0), time(22, 0))
                ]
                
                for start_time, end_time in time_slots:
                    availability = VenueAvailability(
                        venue_id=venue.v_no,
                        date=current_date,
                        start_time=start_time,
                        end_time=end_time,
                        is_available=True,
                        price_multiplier=1.2 if start_time.hour >= 18 else 1.0  # Peak pricing after 6 PM
                    )
                    db.session.add(availability)
        
        db.session.commit()
        print("✅ Created venue availability slots")
        
        # Create sample bookings
        bookings = [
            {
                'venue_id': created_venues[0].v_no,
                'player_id': created_users[0].sr_no,
                'player_name': created_users[0].fullname,
                'email': created_users[0].email,
                'st_date': date.today() + timedelta(days=2),
                'start_time': time(16, 0),
                'end_time': time(18, 0),
                'duration': 2,
                'pay_method': 'card',
                'status': 'confirmed',
                'total_amount': 100.00,
                'notes': 'First time booking'
            },
            {
                'venue_id': created_venues[1].v_no,
                'player_id': created_users[3].sr_no,
                'player_name': created_users[3].fullname,
                'email': created_users[3].email,
                'st_date': date.today() + timedelta(days=1),
                'start_time': time(19, 0),
                'end_time': time(21, 0),
                'duration': 2,
                'pay_method': 'cash',
                'status': 'pending',
                'total_amount': 60.00,
                'notes': 'Evening session'
            }
        ]
        
        created_bookings = []
        for booking_data in bookings:
            booking = Booking(**booking_data)
            db.session.add(booking)
            created_bookings.append(booking)
        
        db.session.commit()
        print(f"✅ Created {len(created_bookings)} bookings")
        
        # Create sample reviews
        reviews = [
            {
                'venue_id': created_venues[0].v_no,
                'user_id': created_users[0].sr_no,
                'rating': 5,
                'comment': 'Excellent tennis court with great facilities!',
                'is_verified': True
            },
            {
                'venue_id': created_venues[1].v_no,
                'user_id': created_users[3].sr_no,
                'rating': 4,
                'comment': 'Good badminton court, well maintained.',
                'is_verified': True
            }
        ]
        
        for review_data in reviews:
            review = Review(**review_data)
            db.session.add(review)
        
        db.session.commit()
        print("✅ Created sample reviews")
        
        # Create sample notifications
        notifications = [
            {
                'user_id': created_users[1].sr_no,
                'title': 'Welcome to Quick Court!',
                'message': 'Thank you for registering as a venue owner. Start adding your venues!',
                'type': 'system',
                'is_read': False
            },
            {
                'user_id': created_users[0].sr_no,
                'title': 'Booking Confirmed',
                'message': 'Your booking for Green Valley Tennis Court has been confirmed!',
                'type': 'booking',
                'is_read': False
            }
        ]
        
        for notification_data in notifications:
            notification = Notification(**notification_data)
            db.session.add(notification)
        
        db.session.commit()
        print("✅ Created sample notifications")
        
        # Create venue images
        venue_images = [
            {
                'venue_id': created_venues[0].v_no,
                'image_url': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
                'is_primary': True
            },
            {
                'venue_id': created_venues[1].v_no,
                'image_url': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
                'is_primary': True
            },
            {
                'venue_id': created_venues[2].v_no,
                'image_url': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
                'is_primary': True
            }
        ]
        
        for image_data in venue_images:
            venue_image = VenueImage(**image_data)
            db.session.add(venue_image)
        
        db.session.commit()
        print("✅ Created venue images")
        
        print("\n🎉 Database initialization completed successfully!")
        print("\n📋 Sample Data Created:")
        print(f"   • {len(created_users)} users")
        print(f"   • {len(created_venues)} venues")
        print(f"   • {len(created_bookings)} bookings")
        print(f"   • {len(reviews)} reviews")
        print(f"   • {len(notifications)} notifications")
        print(f"   • {len(venue_images)} venue images")
        
        print("\n🔑 Sample Login Credentials:")
        for user in created_users:
            print(f"   • {user.email} / password123 ({user.designation})")

if __name__ == '__main__':
    init_database()
