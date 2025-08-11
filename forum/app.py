from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_login import LoginManager
from config import Config
from models import db, Login
from routes import api
from socket_manager import socketio
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=True)
    
    # Initialize SocketIO
    socketio.init_app(app, cors_allowed_origins="*", async_mode='eventlet')
    
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
        return jsonify({
            'status': 'healthy',
            'database': 'connected' if db.engine.execute('SELECT 1').scalar() else 'disconnected'
        })
    
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
    
    # Create database tables
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")
    
    # Run the app with SocketIO
    socketio.run(
        app,
        host='0.0.0.0',
        port=5001,
        debug=True,
        use_reloader=True
    )
