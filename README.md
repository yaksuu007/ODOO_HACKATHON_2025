# Venue Booking System - Backend API

A comprehensive Flask-based REST API for managing sports venue bookings, user authentication, and venue management.

## Features

- **User Authentication**: Registration, login, and session management
- **Venue Management**: CRUD operations for sports venues
- **Booking System**: Create, manage, and track venue bookings
- **Review System**: Rate and review venues
- **Role-based Access**: Separate interfaces for players and facility owners
- **Search & Filtering**: Advanced venue search with multiple criteria
- **Dashboard Analytics**: Statistics for both user types

## Prerequisites

- Python 3.8+
- MySQL 8.0+
- pip (Python package manager)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd forum
```

### 2. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 3. Database Setup

#### Option A: Using the provided script
```bash
python init_db.py
```

#### Option B: Manual setup
1. Create a MySQL database named `hackathon`
2. Update database credentials in `config.py` if needed
3. Run the Flask app to auto-create tables

### 4. Environment Configuration
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

# CORS Origins
FRONTEND_URL=http://localhost:5173
```

### 5. Run the application
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user info
- `PUT /api/user` - Update user profile

### Venues
- `GET /api/venues` - List all venues (with filtering)
- `GET /api/venue/<id>` - Get specific venue
- `POST /api/venue` - Create new venue (facilities users only)
- `PUT /api/venue/<id>` - Update venue (owner only)
- `DELETE /api/venue/<id>` - Delete venue (owner only)

### Bookings
- `POST /api/booking` - Create new booking
- `GET /api/bookings` - Get user's bookings
- `PUT /api/booking/<id>` - Update booking status

### Reviews
- `POST /api/venue/<id>/review` - Create venue review
- `GET /api/venue/<id>/reviews` - Get venue reviews

### Search & Analytics
- `GET /api/search/venues` - Search venues
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Schema

### Users (login table)
- `sr_no` - Primary key
- `fullname` - User's full name
- `email` - Unique email address
- `contact_number` - Phone number
- `designation` - 'player' or 'facilities'
- `password_hash` - Encrypted password
- `profile_image` - Profile picture filename
- `created_at` - Account creation timestamp

### Venues (venue table)
- `v_no` - Primary key
- `user_id` - Foreign key to login.sr_no
- `address` - Venue address
- `court_name` - Name of the court/venue
- `rating` - Average rating (1-5)
- `per_hr_charge` - Hourly rate
- `operating_days` - Operating days
- `operating_hours` - Operating hours
- `amenities` - Available amenities
- `sports` - Supported sports
- `created_at` - Venue creation timestamp

### Bookings (booking table)
- `Bno` - Primary key
- `venue_id` - Foreign key to venue.v_no
- `player_id` - Foreign key to login.sr_no
- `player_name` - Player's name
- `email` - Player's email
- `st_date` - Booking date
- `start_time` - Start time
- `duration` - Duration in hours
- `pay_method` - Payment method
- `status` - Booking status
- `total_amount` - Total cost
- `created_at` - Booking creation timestamp

### Reviews (reviews table)
- `review_id` - Primary key
- `venue_id` - Foreign key to venue.v_no
- `user_id` - Foreign key to login.sr_no
- `rating` - Rating (1-5)
- `comment` - Review comment
- `created_at` - Review creation timestamp

## Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "contact_number": "1234567890",
    "designation": "player"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a venue (requires facilities user)
```bash
curl -X POST http://localhost:5000/api/venue \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_cookie" \
  -d '{
    "address": "123 Sports St, City",
    "court_name": "Premium Tennis Court",
    "per_hr_charge": 50.00,
    "operating_days": "Mon-Sun",
    "operating_hours": "6 AM - 10 PM",
    "sports": "Tennis"
  }'
```

### Create a booking
```bash
curl -X POST http://localhost:5000/api/booking \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_cookie" \
  -d '{
    "venue_id": 1,
    "st_date": "2024-01-15",
    "start_time": "14:00",
    "duration": 2,
    "pay_method": "credit_card"
  }'
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- SQL injection prevention

## Development

### Running in development mode
```bash
export FLASK_ENV=development
export FLASK_DEBUG=True
python app.py
```

### Database migrations
The application automatically creates tables on startup. For production, consider using Flask-Migrate for database migrations.

### Testing
```bash
# Run database initialization
python init_db.py

# Test the API
curl http://localhost:5000/health
```

## Production Deployment

1. Set `FLASK_ENV=production`
2. Use a production WSGI server (Gunicorn, uWSGI)
3. Set up proper environment variables
4. Configure HTTPS
5. Set up database connection pooling
6. Use environment-specific configuration files

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in config.py
   - Ensure database 'hackathon' exists

2. **Import Errors**
   - Verify all requirements are installed
   - Check Python path and virtual environment

3. **CORS Issues**
   - Verify frontend URL is in CORS_ORIGINS
   - Check browser console for CORS errors

4. **Session Issues**
   - Verify SECRET_KEY is set
   - Check cookie settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
