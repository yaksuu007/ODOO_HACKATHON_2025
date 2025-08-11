# 🏟️ Quick Court - Real-Time Venue Booking System

## 🚀 Complete Setup Guide

### 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **MySQL 8.0+**
- **Redis (for real-time features)**

### 🗄️ Database Setup

#### 1. MySQL Database Configuration

```sql
-- Create database
CREATE DATABASE hackathon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional)
CREATE USER 'quickcourt'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON hackathon.* TO 'quickcourt'@'localhost';
FLUSH PRIVILEGES;
```

#### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hackathon
DB_PORT=3306

# Flask Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
FLASK_ENV=development
FLASK_DEBUG=True

# Redis Configuration (for real-time features)
REDIS_URL=redis://localhost:6379

# File Upload Configuration
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
```

### 🔧 Backend Setup

#### 1. Install Python Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 2. Initialize Database

```bash
# Run database initialization
python init_db.py
```

This will create:
- ✅ All database tables
- ✅ Sample users (players and venue owners)
- ✅ Sample venues with availability
- ✅ Sample bookings and reviews
- ✅ Sample notifications

#### 3. Start Backend Server

```bash
# Start the Flask server with real-time capabilities
python app.py
```

The backend will run on `http://localhost:5001`

### 🎨 Frontend Setup

#### 1. Install Node.js Dependencies

```bash
# Install dependencies
npm install
```

#### 2. Start Development Server

```bash
# Start Vite development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 🔐 Sample Login Credentials

After running `python init_db.py`, you can use these credentials:

#### Players:
- **Email:** `john@example.com` / **Password:** `password123`
- **Email:** `lisa@example.com` / **Password:** `password123`

#### Venue Owners:
- **Email:** `sarah@example.com` / **Password:** `password123`
- **Email:** `mike@example.com` / **Password:** `password123`

### 🗂️ Database Schema

#### Core Tables:

1. **`login`** - User accounts (players and venue owners)
2. **`venue`** - Venue information and details
3. **`venue_availability`** - Time slots and availability
4. **`booking`** - Booking records
5. **`payment`** - Payment transactions
6. **`reviews`** - User reviews and ratings
7. **`notifications`** - Real-time notifications
8. **`venue_images`** - Venue photos

#### Key Features:

- ✅ **Real-time updates** via WebSocket
- ✅ **Automatic payment records** when bookings are created
- ✅ **Venue statistics** (total bookings, revenue)
- ✅ **Availability management** with peak/off-peak pricing
- ✅ **Notification system** for booking updates
- ✅ **Review verification** system

### 🔄 Real-Time Features

#### WebSocket Events:

1. **`new_notification`** - New notifications
2. **`booking_update`** - Booking status changes
3. **`venue_update`** - Venue information updates
4. **`system_message`** - System-wide messages
5. **`chat_message`** - Real-time chat
6. **`typing_indicator`** - Typing indicators

#### Real-Time Capabilities:

- ✅ **Live booking updates**
- ✅ **Instant notifications**
- ✅ **Real-time venue availability**
- ✅ **Live chat between users and venue owners**
- ✅ **Online user tracking**
- ✅ **Venue watcher system**

### 🎯 Interactive Button Features

#### Authentication:
- ✅ **Login/Register** with real-time validation
- ✅ **Profile updates** with image upload
- ✅ **Session management** with automatic logout

#### Venue Management:
- ✅ **Create/Edit/Delete** venues
- ✅ **Upload venue images**
- ✅ **Manage availability** with time slots
- ✅ **Set peak/off-peak pricing**

#### Booking System:
- ✅ **Real-time availability** checking
- ✅ **Instant booking** with confirmation
- ✅ **Booking status** updates (pending, confirmed, cancelled, completed)
- ✅ **Payment processing** with multiple methods
- ✅ **Booking cancellation** with refunds

#### Reviews & Ratings:
- ✅ **Post reviews** after completed bookings
- ✅ **Rating system** with automatic venue rating updates
- ✅ **Review verification** for authenticity

#### Notifications:
- ✅ **Real-time notifications** for all events
- ✅ **Browser notifications** (with permission)
- ✅ **Notification history** and read status

#### Dashboard:
- ✅ **Owner dashboard** with venue statistics
- ✅ **Player dashboard** with booking history
- ✅ **Real-time statistics** updates
- ✅ **Revenue tracking** and analytics

### 🛠️ API Endpoints

#### Authentication:
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user
- `PUT /api/user` - Update user profile

#### Venues:
- `GET /api/venues` - List all venues
- `GET /api/venue/:id` - Get venue details
- `POST /api/venue` - Create new venue
- `PUT /api/venue/:id` - Update venue
- `DELETE /api/venue/:id` - Delete venue
- `GET /api/search/venues` - Search venues

#### Bookings:
- `POST /api/booking` - Create booking
- `GET /api/bookings` - Get user bookings
- `PUT /api/booking/:id` - Update booking status
- `PUT /api/booking/:id/cancel` - Cancel booking

#### Reviews:
- `POST /api/venue/:id/review` - Create review
- `GET /api/venue/:id/reviews` - Get venue reviews

#### Notifications:
- `GET /api/notifications/user/:id` - Get user notifications
- `PUT /api/notification/:id/read` - Mark as read

#### Real-time:
- `GET /api/realtime/online-users` - Get online users
- `GET /api/realtime/venue/:id/watchers` - Get venue watchers

### 🚀 Running the Complete System

1. **Start MySQL** and ensure it's running
2. **Start Redis** (optional, for enhanced real-time features)
3. **Run backend:** `python app.py`
4. **Run frontend:** `npm run dev`
5. **Initialize database:** `python init_db.py` (first time only)
6. **Access the application:** `http://localhost:5173`

### 🔧 Troubleshooting

#### Common Issues:

1. **Database Connection Error:**
   - Check MySQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Socket Connection Error:**
   - Check backend is running on port 5001
   - Verify CORS settings
   - Check firewall settings

3. **Frontend Build Error:**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

4. **Real-time Features Not Working:**
   - Ensure Redis is running (optional)
   - Check WebSocket connection in browser console
   - Verify socket.io-client is installed

### 📱 Mobile Responsiveness

The application is fully responsive and works on:
- ✅ **Desktop** (1920x1080+)
- ✅ **Tablet** (768px+)
- ✅ **Mobile** (320px+)

### 🔒 Security Features

- ✅ **Password hashing** with bcrypt
- ✅ **Session management** with Flask-Login
- ✅ **CORS protection** for API endpoints
- ✅ **Input validation** and sanitization
- ✅ **SQL injection protection** with SQLAlchemy
- ✅ **File upload security** with type checking

### 📊 Performance Features

- ✅ **Database connection pooling**
- ✅ **Real-time caching** with Redis
- ✅ **Image optimization** and compression
- ✅ **Lazy loading** for venue images
- ✅ **Pagination** for large datasets
- ✅ **Rate limiting** for API endpoints

### 🎉 Success!

Your real-time venue booking system is now fully functional with:

- 🔄 **Real-time updates** for all interactions
- 🎯 **Interactive buttons** with proper database management
- 📱 **Mobile-responsive** design
- 🔒 **Secure authentication** and authorization
- 📊 **Comprehensive dashboard** with analytics
- 💬 **Real-time chat** and notifications
- 💳 **Payment processing** capabilities
- ⭐ **Review and rating** system

All buttons are now fully interactive and connected to the database with real-time updates! 🚀
