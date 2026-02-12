# Bridal Bliss Studio - Backend API

Production-ready Flask backend for Bridal Bliss Studio booking system.

## Tech Stack

- Python 3.13
- Flask
- MySQL
- JWT Authentication
- bcrypt password hashing

## Features

- User authentication (Customer, Artist, Admin roles)
- Booking management system
- Artist approval workflow
- Reviews and ratings
- Messaging system
- Billing and invoicing
- Admin dashboard
- Artist dashboard

## Installation

1. Install Python 3.13

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your MySQL credentials
```

4. Setup MySQL:
- Create MySQL database
- The application will auto-create tables on first run

5. Run the application:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## Database Setup

The application automatically creates the database and tables on first run.

Default admin account:
- Email: admin@bridalbliss.com
- Password: Admin@123 (hash is pre-generated)

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update profile

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings` - Get user bookings
- GET `/api/bookings/<id>` - Get booking details
- PUT `/api/bookings/<id>/status` - Update booking status
- PUT `/api/bookings/<id>/cancel` - Cancel booking
- GET `/api/bookings/upcoming` - Get upcoming bookings (artists)

### Artists
- GET `/api/artists` - Get all approved artists
- GET `/api/artists/<id>` - Get artist details
- GET `/api/artists/pending` - Get pending approvals (admin)
- PUT `/api/artists/<id>/approve` - Approve artist (admin)
- PUT `/api/artists/<id>/reject` - Reject artist (admin)
- GET `/api/artists/dashboard` - Artist dashboard

### Reviews
- POST `/api/reviews` - Create review
- GET `/api/reviews/artist/<id>` - Get artist reviews
- PUT `/api/reviews/<id>` - Update review
- DELETE `/api/reviews/<id>` - Delete review

### Messages
- POST `/api/messages` - Send message
- GET `/api/messages/conversations` - Get all conversations
- GET `/api/messages/conversation/<user_id>` - Get conversation
- PUT `/api/messages/read/<sender_id>` - Mark as read
- GET `/api/messages/unread-count` - Get unread count
- DELETE `/api/messages/<id>` - Delete message

### Billing
- GET `/api/billing/invoices` - Get invoices
- GET `/api/billing/invoices/<id>` - Get invoice details
- GET `/api/billing/invoices/booking/<id>` - Get invoice by booking
- PUT `/api/billing/invoices/<id>/payment` - Update payment status
- GET `/api/billing/revenue/stats` - Get revenue stats (admin)

### Admin
- GET `/api/admin/dashboard` - Dashboard statistics
- GET `/api/admin/users` - Get all users
- GET `/api/admin/users/<id>` - Get user details
- PUT `/api/admin/users/<id>/status` - Update user status
- DELETE `/api/admin/users/<id>` - Delete user
- GET `/api/admin/bookings` - Get all bookings
- GET `/api/admin/revenue/report` - Revenue report

## Security

- JWT token-based authentication
- bcrypt password hashing
- Role-based authorization
- Input validation and sanitization
- Protected routes with middleware

## Architecture

```
backend/
├── app.py                 # Main application entry point
├── config.py             # Configuration settings
├── schema.sql            # Database schema
├── requirements.txt      # Python dependencies
├── .env.example         # Environment variables template
├── controllers/         # Business logic
│   ├── auth_controller.py
│   ├── booking_controller.py
│   ├── artist_controller.py
│   ├── review_controller.py
│   ├── message_controller.py
│   ├── billing_controller.py
│   └── admin_controller.py
├── routes/              # API routes
│   ├── auth_routes.py
│   ├── booking_routes.py
│   ├── artist_routes.py
│   ├── review_routes.py
│   ├── message_routes.py
│   ├── billing_routes.py
│   └── admin_routes.py
├── models/              # Database models
│   ├── user_model.py
│   ├── artist_model.py
│   ├── booking_model.py
│   ├── review_model.py
│   ├── message_model.py
│   └── invoice_model.py
├── database/            # Database connection
│   └── db.py
└── utils/               # Utilities
    ├── jwt_utils.py
    ├── password_utils.py
    └── validators.py
```

## Environment Variables

See `.env.example` for required environment variables.

## Production Deployment

1. Set secure values for SECRET_KEY and JWT_SECRET_KEY
2. Configure production database
3. Set DEBUG=False
4. Use production-grade WSGI server (gunicorn, uwsgi)
5. Setup proper logging
6. Configure HTTPS/SSL
7. Setup database backups
8. Configure CORS for production frontend URL

## License

Proprietary - Bridal Bliss Studio
