# g4f-shop API

A RESTful API backend for the **g4f-shop** e-commerce platform, built to handle product management, user authentication, orders, and more.

------------------------------------------------------------------------

## Table of Contents
---

-   [Overview](#overview)
-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Environment Variables](#environment-variables)
    -   [Running the API](#running-the-api)
-   [API Endpoints](#api-endpoints)
-   [Authentication](#authentication)
-   [Error Handling](#error-handling)
-   [Testing](#testing)
-   [Contributing](#contributing)
-   [License](#license)
-   [Contact](#contact)

------------------------------------------------------------------------

## Overview {#overview}
---

The **g4f-shop API** is a RESTful backend service designed to power a full-featured e-commerce platform. It handles:

-   User authentication and profile management
-   Product catalog browsing and management
-   Category management for organizing products
-   Shopping cart and order processing
-   Role-based access control for customers and admins
-   Pagination, sorting, and filtering for efficient data retrieval
-   Secure and scalable API design with validation and error handling

This backend serves as the core foundation for frontend applications, providing flexible and secure endpoints to support all typical e-commerce workflows.

------------------------------------------------------------------------

## Features {#features}
---

### User Authentication

-   Traditional email and password authentication
-   OAuth login via Google
-   JWT-based session management with access and refresh tokens
-   Optional two-factor authentication (2FA) for enhanced security
-   User profile management including avatar uploads and password changes

------------------------------------------------------------------------

### Product Management

The g4f-shop API provides comprehensive endpoints for managing products, supporting both customer-facing queries and full admin control.

### Category Management

Full category CRUD and filtering functionality, enabling organization and retrieval of product categories, with support for pagination and sorting.

------------------------------------------------------------------------

### Additional Features
---

-   Shopping cart management
-   Order processing and history
-   Pagination, sorting, and filtering support
-   Role-based access control (e.g., admin vs. customer)
-   RESTful API design
-   Validation and error handling
-   Payment & Sales Report Generation

------------------------------------------------------------------------

## Tech Stack {#tech-stack}
---

-   Node.js
-   NestJS
-   Sequelize (ORM)
-   Redis
-   PostgreSQL
-   JWT for authentication
-   Class Validation
-   Dockerfile

------------------------------------------------------------------------

## Getting Started {#getting-started}

### Prerequisites {#prerequisites}

-   Node.js (version 18.X or higher) for best compatibility and support.
-   npm or yarn
-   PostgreSQL (or other supported DB)

### Installation {#installation}
```bash
git clone https://github.com/yourusername/g4f-shop-api.git 
cd g4f-shop-api 
npm install
```

### Environment Variables {#environment-variables}
```bash
# Application Port
PORT=

# Database Configuration
DB_CONNECTION=postgres       # or mysql
DB_HOST=
DB_PORT=5432                 # default PostgreSQL port
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

# Redis Configuration
REDIS_HOST=
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=7d

# Stripe Secret Key
STRIPE_SECRET_KEY=

# Web Frontend URL
WEB_BASE_URL=http://localhost:3000
```

### Running the API {#running-the-api}

**1 Requirements**

- Node.js: >=18.x (recommended for compatibility with NestJS v10 and puppeteer)
- Package Manager: npm or yarn
- Database: MySQL or PostgreSQL
- Redis: (if using caching or rate limiting)
- Stripe Account: For payment integration (optional)

**2 Install Dependencies**

```bash
npm install
# or
yarn install
```

**3 Configure Environment Variables**

Create a .env file in the root of the project:

```bash
# Copy and Edit enviroment on your configuration
cp .env.example .env
```

**4 Run Migrations**
```bash
npm run migrate
npm run seeder
```

**5 Start the API**
```bash
npm run start
# or with watch mode
npm run start:dev
```

## API Endpoints {#api-endpoints}
---
Below is the list of available API endpoints for authentication and user management.

| Method | Endpoint         | Description        | Auth Required |
|--------|------------------|--------------------|---------------|
| GET    | `/users/profile` | Get user profile   | Yes           |
| POST   | `/auth/login`    | Login              | No            |
| POST   | `/auth/register` | Register new user  | No            |


## Authentication {#authentication}
---

#### 📥 `POST /api/mx/v1/auth/login`
Login a user and return an access token.

- **URL:** `/api/mx/v1/auth/login`
- **Method:** `POST`
- **Auth required:** No

**Request Body:**

```json
{
  "email": "admin@gmail.com",
  "password": "admin@1234"
}
```

**Response**
```json
{
    "message": "Login successfully",
    "user": {
        "id": 1,
        "username": "admin",
        "avatar": "/public/static/avatar.jpg",
        "email": "admin@gmail.com",
        "role": 1,
        "role_name": "admin",
        "is_2fa": false
    },
    "token": {
        "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9......",
        "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9......."
    },
    "access_expires_in": "2025-06-02T12:38:48.231Z"
}
```

#### `GET /api/mx/v1/auth/profile`
View Profile

- **URL:** `/api/mx/v1/users/profile`
- **Method:** `GET`
- **Auth required:** `Yes (Bearer Token)`

Headers
```bash
Authorization: Bearer <access_token>
```
**Response**
```json
{
  "message": "Fetching data successfully.",
  "data": {
    "first_name": "admin",
    "last_name": "admin",
    "username": "admin",
    "email": "admin@gmail.com",
    "phone_number": "0123456789",
    "address": "123 Street, City",
    "avatar": "/public/static/avatar.jpg",
    "bio": null
  }
}
```

## Error Handling {#error-handling}
---

All API responses follow a consistent structure. In case of an error, the response will include an appropriate HTTP status code and a message.

### Common Error Response Format

```json
{
  "statusCode": 400,
  "message": "Invalid email or password",
  "error": "Bad Request"
}
```

### Validation Error (422)

```json
{
  "statusCode": 422,
  "message": [
    "Password must be at least 6 characters",
    "Email must be a valid email address"
  ],
  "error": "Unprocessable Entity"
}
```

### Unauthorized (401)
```json
{
  "statusCode": 401,
  "message": "Unauthorized access",
  "error": "Unauthorized"
}
```

## Testing {#testing}
---

To test the API:
1. Install dependencies: `npm install`
2. Create a .env file from .env.example and configure it.
3. Run the application: `npm run start:dev`
4. Use tools like Postman or Insomnia to test the endpoints.

## Contributing {#contributing}
---

Contributions are welcome! Please fork the repository and submit a pull request.
	1.	Fork the repository
	2.	Create a new branch (git checkout -b feature/my-feature)
	3.	Commit your changes (git commit -am 'Add new feature')
	4.	Push to the branch (git push origin feature/my-feature)
	5.	Open a pull request

## License {#license}
---

This project is licensed under the [MIT License](./LICENSE).

## Contact {#contact}
---

For questions or support, please contact:

- Developer: `Wusan`
- Email: `zhangwusan1@gmail.com`
- Telegram: `Zhangwusan123_32_1`
