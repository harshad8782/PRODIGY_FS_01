# Task-01: Secure User Authentication System

## 📋 Project Overview

A comprehensive full-stack user authentication system with secure login and registration functionality, featuring a React frontend and Spring Boot backend integration.

## 🛠️ Tech Stack

### Backend
- **Java 17+** - Programming Language
- **Spring Boot 3.x** - Framework for building REST APIs
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Database Operations
- **JWT (JSON Web Tokens)** - Secure Authentication
- **H2/MySQL/PostgreSQL** - Database
- **Maven** - Dependency Management
- **Hibernate** - ORM (Object-Relational Mapping)

### Frontend (Optional)
- **React.js / Angular / Vue.js** - Frontend Framework
- **HTML5 & CSS3** - Markup & Styling
- **JavaScript/TypeScript** - Programming Language
- **Axios/Fetch API** - HTTP Client

### Development Tools
- **Postman** - API Testing
- **VS Code/IntelliJ IDEA** - IDE
- **Git** - Version Control
- **Docker** - Containerization (Optional)

### Key Features
- ✅ **Secure User Registration** - Complete signup process with form validation
- ✅ **User Login/Logout** - Secure authentication with session management
- ✅ **Protected Routes** - Role-based access control (RBAC)
- ✅ **Password Security** - Client-side validation and secure transmission
- ✅ **Responsive Design** - Modern UI with Tailwind CSS
- ✅ **Session Management** - Persistent user sessions with browser storage
- ✅ **Error Handling** - Comprehensive error messages and validation
- ✅ **Role-Based Access** - Support for different user roles (STUDENT, ADMIN, etc.)
---

## 📋 Prerequisites
Before running this project, make sure you have:
- Node.js (v14 or higher)
- Spring Boot backend running on `http://localhost:8080`
- MySQL database configured
- Backend API endpoints ready:
  - `POST /api/auth/register`
  - `POST /api/auth/login`

## 🚦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/secure-auth-system.git
cd secure-auth-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Backend Connection

Ensure your Spring Boot backend is running on `http://localhost:8080` with the following endpoints:

#### Registration Endpoint
```
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "student1",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

#### Login Endpoint
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 4. Run the Application

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/
│   ├── AuthProvider.js      # Authentication context provider
│   ├── LoginForm.js         # Login component
│   ├── RegisterForm.js      # Registration component
│   ├── ProtectedRoute.js    # Route protection component
│   └── Dashboard.js         # Protected dashboard
├── hooks/
│   └── useAuth.js          # Authentication hook
├── utils/
│   └── auth.js             # Authentication utilities
├── App.js                  # Main application component
└── index.js               # Application entry point
```

## 🔐 Authentication Flow

### Registration Process
1. User fills out registration form with required fields
2. Client-side validation for password strength and field requirements
3. Data sent to backend `/api/auth/register` endpoint
4. Success message displayed, user redirected to login

### Login Process
1. User enters email and password
2. Credentials sent to backend `/api/auth/login` endpoint
3. Backend validates and returns user data with token
4. User data and token stored in sessionStorage
5. User redirected to protected dashboard

### Session Management
- Authentication state managed through React Context
- User data persists across browser refreshes
- Automatic logout when session expires
- Protected routes check authentication status

## 🎨 UI Components

### Login Form
- Email and password input fields
- Password visibility toggle
- Form validation and error display
- Loading states during authentication

### Registration Form
- Complete user information collection
- Password confirmation matching
- Role selection dropdown
- Comprehensive field validation

### Dashboard
- Welcome message with user information
- Role-based content display
- Secure logout functionality
- User profile information

## 🔒 Security Features

- **Password Validation** - Minimum length requirements
- **Input Sanitization** - XSS prevention
- **Secure Storage** - Session-based token storage
- **HTTPS Ready** - Secure transmission support
- **Role-Based Access** - Different permission levels
- **Session Timeout** - Automatic logout for security
