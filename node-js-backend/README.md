# Psynexa Backend Service

## Overview
Psynexa Backend is a comprehensive Node.js-based REST API service that powers the Psynexa mental health platform. This service handles all backend operations including user authentication, psychologist management, appointment scheduling, and various therapeutic content delivery.

## 🚀 Features

- **Authentication & Authorization**
  - User authentication (clients, psychologists, staff)
  - Role-based access control
  - Google OAuth integration
  - JWT-based authentication

- **User Management**
  - Client management
  - Psychologist profiles and approval system
  - Staff management
  - Working areas and specializations

- **Therapeutic Services**
  - Meditation sessions
  - Breathing exercises
  - Series content
  - Assigned tasks
  - Journal entries
  - Reminders

- **Appointment System**
  - Reservation management
  - Package management
  - Payment processing

- **Communication**
  - Real-time chat
  - Messaging system
  - Notifications

- **Content Management**
  - Blog posts
  - Articles
  - Educational content

## 🛠 Technical Stack

- **Framework:** Express.js
- **Database:** PostgreSQL with Sequelize ORM
- **Authentication:** JWT, Passport.js
- **Documentation:** Swagger/OpenAPI
- **Testing:** Jest
- **Logging:** Winston
- **Security:** Rate limiting, CORS, bcrypt

## 📦 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## 🔧 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables with your configuration

## 🚀 Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📁 Project Structure

```
node-js-backend/
├── bin/                # Application entry point
├── config/            # Configuration files
├── controllers/       # Route controllers
├── middleware/        # Custom middleware
├── models/           # Database models
├── routes/           # API routes
├── services/         # Business logic
├── utils/            # Utility functions
├── __tests__/        # Test files
├── migrations/       # Database migrations
└── public/           # Static files
```

## 📚 API Documentation

API documentation is available at `/api-docs` when the server is running. This documentation is generated using Swagger/OpenAPI.

## 🔒 Security Features

- Rate limiting
- JWT authentication
- Password hashing
- CORS protection
- Input validation
- Error handling

## 🛣 Available Routes

- `/api/auth` - Authentication routes
- `/api/staff/auth` - Staff authentication
- `/api/psychologists` - Psychologist management
- `/api/clients` - Client management
- `/api/packages` - Package management
- `/api/payments` - Payment processing
- `/api/reservations` - Appointment reservations
- `/api/meditations` - Meditation content
- `/api/breathing-exercises` - Breathing exercises
- `/api/series` - Series content
- `/api/chat` - Chat functionality
- `/api/journals` - Journal entries
- And more...

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.
