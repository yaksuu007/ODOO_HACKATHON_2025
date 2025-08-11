import pymysql
import os
from config import Config

def create_database():
    """Create the database if it doesn't exist"""
    try:
        # Connect to MySQL server (without specifying database)
        connection = pymysql.connect(
            host=Config.DB_HOST,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            port=int(Config.DB_PORT)
        )
        
        cursor = connection.cursor()
        
        # Create database if it doesn't exist
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {Config.DB_NAME}")
        print(f"Database '{Config.DB_NAME}' created successfully or already exists")
        
        # Use the database
        cursor.execute(f"USE {Config.DB_NAME}")
        
        # Create tables
        create_tables(cursor)
        
        connection.commit()
        print("Database initialization completed successfully!")
        
    except Exception as e:
        print(f"Error creating database: {e}")
    finally:
        if connection:
            connection.close()

def create_tables(cursor):
    """Create all necessary tables"""
    
    # Create login table
    login_table = """
    CREATE TABLE IF NOT EXISTS login (
        sr_no INT AUTO_INCREMENT PRIMARY KEY,
        profile_image VARCHAR(255),
        fullname VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        contact_number VARCHAR(15) NOT NULL,
        designation ENUM('player', 'facilities') NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """
    
    # Create venue table
    venue_table = """
    CREATE TABLE IF NOT EXISTS venue (
        v_no INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        address TEXT NOT NULL,
        court_name VARCHAR(100) NOT NULL,
        rating DECIMAL(2,1),
        per_hr_charge DECIMAL(10,2) NOT NULL,
        operating_days VARCHAR(100) NOT NULL,
        operating_hours VARCHAR(50) NOT NULL,
        amenities TEXT,
        sports VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES login(sr_no) ON DELETE CASCADE
    )
    """
    
    # Create booking table
    booking_table = """
    CREATE TABLE IF NOT EXISTS booking (
        Bno INT AUTO_INCREMENT PRIMARY KEY,
        venue_id INT NOT NULL,
        player_id INT NOT NULL,
        player_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        st_date DATE NOT NULL,
        start_time TIME NOT NULL,
        duration INT NOT NULL,
        pay_method VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        total_amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (venue_id) REFERENCES venue(v_no) ON DELETE CASCADE,
        FOREIGN KEY (player_id) REFERENCES login(sr_no) ON DELETE CASCADE
    )
    """
    
    # Create reviews table
    reviews_table = """
    CREATE TABLE IF NOT EXISTS reviews (
        review_id INT AUTO_INCREMENT PRIMARY KEY,
        venue_id INT NOT NULL,
        user_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (venue_id) REFERENCES venue(v_no) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES login(sr_no) ON DELETE CASCADE
    )
    """
    
    try:
        cursor.execute(login_table)
        print("Login table created successfully")
        
        cursor.execute(venue_table)
        print("Venue table created successfully")
        
        cursor.execute(booking_table)
        print("Booking table created successfully")
        
        cursor.execute(reviews_table)
        print("Reviews table created successfully")
        
    except Exception as e:
        print(f"Error creating tables: {e}")

if __name__ == "__main__":
    create_database()
