#!/usr/bin/env python3
"""
Startup script for the Venue Booking System
Handles database initialization and application startup
"""

import os
import sys
import subprocess
import time

def check_dependencies():
    """Check if required dependencies are installed"""
    print("🔍 Checking dependencies...")
    
    try:
        import flask
        import flask_sqlalchemy
        import flask_login
        import flask_bcrypt
        import flask_cors
        import pymysql
        print("✅ All Python dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def check_mysql():
    """Check if MySQL is running"""
    print("🔍 Checking MySQL connection...")
    
    try:
        import pymysql
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            port=3306
        )
        connection.close()
        print("✅ MySQL is running and accessible")
        return True
    except Exception as e:
        print(f"❌ MySQL connection failed: {e}")
        print("Please ensure MySQL is running and accessible")
        return False

def create_database():
    """Create the database if it doesn't exist"""
    print("🔍 Creating database...")
    
    try:
        import pymysql
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            port=3306
        )
        
        cursor = connection.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS hackathon")
        print("✅ Database 'hackathon' created or already exists")
        
        connection.close()
        return True
    except Exception as e:
        print(f"❌ Database creation failed: {e}")
        return False

def run_database_init():
    """Run the database initialization script"""
    print("🔍 Initializing database tables...")
    
    try:
        result = subprocess.run([sys.executable, 'init_db.py'], 
                              capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Database tables initialized successfully")
            return True
        else:
            print(f"❌ Database initialization failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
        return False

def start_application():
    """Start the Flask application"""
    print("🚀 Starting Venue Booking System...")
    
    try:
        # Set environment variables
        os.environ['FLASK_ENV'] = 'development'
        os.environ['FLASK_DEBUG'] = 'True'
        
        # Import and run the app
        from app import create_app, init_db
        
        app = create_app()
        init_db(app)
        
        print("✅ Application started successfully!")
        print("🌐 API is running at: http://localhost:5000")
        print("📊 Health check: http://localhost:5000/health")
        print("📚 API docs: http://localhost:5000/")
        print("\nPress Ctrl+C to stop the application")
        
        app.run(debug=True, host='0.0.0.0', port=5000)
        
    except Exception as e:
        print(f"❌ Application startup failed: {e}")
        return False

def main():
    """Main startup function"""
    print("🎯 Venue Booking System - Startup")
    print("=" * 40)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check MySQL
    if not check_mysql():
        sys.exit(1)
    
    # Create database
    if not create_database():
        sys.exit(1)
    
    # Initialize database tables
    if not run_database_init():
        print("⚠️  Database initialization failed, but continuing...")
    
    # Start application
    start_application()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Application stopped by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)
