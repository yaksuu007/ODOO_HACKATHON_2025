from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_login import LoginManager
from config import Config
from sqlalchemy import text
from models import db, Login, Venue
from routes import api
from socket_manager import socketio
import os
from flask_bcrypt import Bcrypt
from datetime import datetime

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=True)
    
    # Initialize SocketIO
    socketio.init_app(app, cors_allowed_origins="*", async_mode='threading')
    
    # Initialize Login Manager
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'api.login'
    
    @login_manager.user_loader
    def load_user(user_id):
        return Login.query.get(int(user_id))
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    
    # Create upload folder
    os.makedirs(app.config.get('UPLOAD_FOLDER', 'uploads'), exist_ok=True)
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        try:
            db.session.execute(text('SELECT 1'))
            db_ok = 'connected'
        except Exception:
            db_ok = 'disconnected'
        return jsonify({'status': 'healthy', 'database': db_ok})

    def ensure_default_data():
        bcrypt = Bcrypt(app)
        # Ensure at least 3 facility users exist
        default_facilities = [
            {"fullname": "Owner A", "email": "owner_a@example.com"},
            {"fullname": "Owner B", "email": "owner_b@example.com"},
            {"fullname": "Owner C", "email": "owner_c@example.com"},
        ]
        created_facilities = []
        for u in default_facilities:
            if not Login.query.filter_by(email=u["email"]).first():
                user = Login(
                    fullname=u["fullname"],
                    email=u["email"],
                    password_hash=bcrypt.generate_password_hash('password123').decode('utf-8'),
                    contact_number='0000000000',
                    designation='facilities',
                    is_verified=True,
                    is_active=True,
                    created_at=datetime.utcnow(),
                )
                db.session.add(user)
                created_facilities.append(user)
        if created_facilities:
            db.session.commit()

        # Collect facility users
        facility_users = Login.query.filter_by(designation='facilities').all()
        if not facility_users:
            return

        # Ensure at least 5 venues exist
        existing_venues_count = Venue.query.count()
        venues_to_create = max(0, 5 - existing_venues_count)
        if venues_to_create == 0:
            return

        sample_venues = [
            {
                'court_name': 'Sunrise Tennis Court',
                'address': '101 Sunrise Ave, City Center',
                'per_hr_charge': 45.00,
                'operating_days': 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                'operating_hours': '6:00 AM - 10:00 PM',
                'amenities': 'Parking, Water Station, Restrooms',
                'sports': 'Tennis'
            },
            {
                'court_name': 'Downtown Badminton Hub',
                'address': '202 Main St, Downtown',
                'per_hr_charge': 35.00,
                'operating_days': 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
                'operating_hours': '7:00 AM - 11:00 PM',
                'amenities': 'Changing Rooms, Lockers, Café',
                'sports': 'Badminton'
            },
            {
                'court_name': 'Riverbank Basketball Arena',
                'address': '303 River Rd, Riverside',
                'per_hr_charge': 60.00,
                'operating_days': 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                'operating_hours': '5:00 AM - 12:00 AM',
                'amenities': 'Scoreboard, Floodlights, Seating',
                'sports': 'Basketball'
            },
            {
                'court_name': 'Hillside Football Ground',
                'address': '404 Hilltop Blvd, Northside',
                'per_hr_charge': 90.00,
                'operating_days': 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                'operating_hours': '6:00 AM - 10:00 PM',
                'amenities': 'Locker Rooms, WiFi, Parking',
                'sports': 'Football'
            },
            {
                'court_name': 'City Squash Courts',
                'address': '505 City Plaza, Midtown',
                'per_hr_charge': 40.00,
                'operating_days': 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
                'operating_hours': '7:00 AM - 9:00 PM',
                'amenities': 'Pro Shop, Showers, Towel Service',
                'sports': 'Squash'
            },
        ]

        created = 0
        idx = 0
        for v in sample_venues:
            if created >= venues_to_create:
                break
            # skip if a venue with same name already exists
            if Venue.query.filter_by(court_name=v['court_name']).first():
                continue
            owner = facility_users[idx % len(facility_users)]
            venue = Venue(
                user_id=owner.sr_no,
                address=v['address'],
                court_name=v['court_name'],
                per_hr_charge=v['per_hr_charge'],
                operating_days=v['operating_days'],
                operating_hours=v['operating_hours'],
                amenities=v['amenities'],
                sports=v['sports'],
                is_active=True,
            )
            db.session.add(venue)
            created += 1
            idx += 1
        if created:
            db.session.commit()

    # Seed default data on app creation
    with app.app_context():
        try:
            ensure_default_data()
        except Exception as seed_exc:
            print(f"Seeding skipped: {seed_exc}")
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    # Ensure databases exist and create tables
    with app.app_context():
        try:
            # Attempt to create databases if they don't exist
            import pymysql
            conn = pymysql.connect(host=Config.DB_HOST, user=Config.DB_USER, password=Config.DB_PASSWORD, port=int(Config.DB_PORT))
            conn.autocommit(True)
            cur = conn.cursor()
            cur.execute(f"CREATE DATABASE IF NOT EXISTS `{Config.DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            cur.execute(f"CREATE DATABASE IF NOT EXISTS `{Config.MATCHES_DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            cur.close()
            conn.close()
        except Exception as e:
            print(f"Warning: could not auto-create databases: {e}")

        # Create all tables across all binds
        db.create_all()
        print("Database tables (all binds) created successfully!")
    
    # Run the app with SocketIO
    socketio.run(
        app,
        host='0.0.0.0',
        port=5001,
        debug=True,
        use_reloader=True
    )
