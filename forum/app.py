from flask import Flask, jsonify, request, current_app
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_bcrypt import Bcrypt
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import models and routes
from models import db, Login, Venue, Booking, Review
from routes import api

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configuration
    app.config.from_object('config.Config')
    
    # Initialize extensions
    db.init_app(app)
    bcrypt = Bcrypt(app)
    
    # CORS configuration
    CORS(app, 
          supports_credentials=True, 
          origins=app.config['CORS_ORIGINS'],
          methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allow_headers=['Content-Type', 'Authorization'])
    
    # Login manager configuration
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'api.login'
    login_manager.login_message = 'Please log in to access this page.'
    
    @login_manager.user_loader
    def load_user(user_id):
        return Login.query.get(int(user_id))
    
    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({"error": "Authentication required"}), 401
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Resource not found"}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": "Bad request"}), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({"error": "Unauthorized"}), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({"error": "Forbidden"}), 500
    
    # Health check endpoint
    @app.route("/")
    def index():
        return jsonify({
            "message": "Venue Booking API is running!",
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat()
        })
    
    @app.route("/health")
    def health_check():
        """Health check endpoint for monitoring"""
        try:
            # Test database connection
            from sqlalchemy import text
            db.session.execute(text('SELECT 1'))
            db_status = "healthy"
        except Exception as e:
            db_status = f"unhealthy: {str(e)}"
        
        return jsonify({
            "status": "healthy",
            "database": db_status,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    return app

def init_db(app):
    """Initialize database and create tables"""
    with app.app_context():
        try:
            # Create all tables
            db.create_all()
            print("Database tables created successfully!")
            
            # Check if admin user exists, if not create one
            admin_user = Login.query.filter_by(email='admin@venue.com').first()
            if not admin_user:
                from flask_bcrypt import Bcrypt
                bcrypt = Bcrypt(app)
                
                admin_password = bcrypt.generate_password_hash('admin123').decode('utf-8')
                admin_user = Login(
                    fullname='Admin User',
                    email='admin@venue.com',
                    password_hash=admin_password,
                    contact_number='1234567890',
                    designation='facilities',
                    profile_image=''
                )
                db.session.add(admin_user)
                db.session.commit()
                print("Admin user created: admin@venue.com / admin123")
            
        except Exception as e:
            print(f"Database initialization error: {e}")
            raise

if __name__ == '__main__':
    # Create the Flask application
    app = create_app()
    
    # Initialize database
    init_db(app)
    
    # Run the application on port 5001 to avoid conflicts
    app.run(
        debug=app.config.get('FLASK_DEBUG', True),
        host='0.0.0.0',
        port=5001
    )
