# PulseFit Gym — Full-Stack Gym Management System

A full-stack web application for managing gym operations, including class bookings, membership plans, product reservations, equipment tracking, and member feedback.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Roles & Access Control](#roles--access-control)
- [Running Tests](#running-tests)
- [Contributing](#contributing)

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 19, React Router v7, Axios                |
| Backend   | Node.js, Express 5, MongoDB, Mongoose 9         |
| Auth      | JSON Web Tokens (JWT), bcrypt                   |
| Dev Tools | Nodemon, ESLint, Prettier                       |

---

## Project Structure

```
root/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   └── admin.js               # Admin role guard
│   ├── models/
│   │   ├── User.js
│   │   ├── Plan.js
│   │   ├── Subscription.js
│   │   ├── Class.js
│   │   ├── Booking.js
│   │   ├── Product.js
│   │   ├── ProductReservation.js
│   │   ├── Equipment.js
│   │   └── Feedback.js
│   ├── routes/
│   │   ├── index.js               # Route aggregator
│   │   └── api/
│   │       ├── auth.js
│   │       ├── users.js
│   │       ├── plans.js
│   │       ├── subscriptions.js
│   │       ├── classes.js
│   │       ├── bookings.js
│   │       ├── products.js
│   │       ├── reservations.js
│   │       ├── equipment.js
│   │       └── feedback.js
│   ├── tests/
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/            # Shared UI components
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global auth state
    │   ├── pages/
    │   │   ├── admin/             # Admin-only pages
    │   │   └── *.jsx              # Public & member pages
    │   ├── utils/
    │   │   └── api.js             # Axios instance
    │   ├── App.jsx
    │   └── index.jsx
    └── package.json
```

---

## Features

### Member-Facing
- **Authentication** — Register, log in, and manage your profile.
- **Membership Plans** — Browse and subscribe to Drop-in, Monthly, or Annual plans. One active plan at a time; cancel anytime.
- **Class Bookings** — View upcoming classes filtered by type and intensity. Book or cancel a spot in real time. Enrollment counts update automatically.
- **Marketplace** — Browse gym products (protein, supplements, apparel, accessories). Reserve items for in-gym pickup; cancel reservations to restore stock.
- **Feedback** — Submit anonymous or named feedback with a 1–5 star rating.
- **Account Page** — View active subscription, class bookings, and product reservations in one place.

### Admin-Facing
- **Dashboard** — Overview of member count, active subscriptions, classes, and feedback.
- **Members** — Search, create, edit, or delete user accounts and assign roles.
- **Plans** — Full CRUD for membership plans; toggle active status.
- **Classes** — Full CRUD for fitness classes; live enrollment tracking.
- **Equipment** — Track gym equipment with statuses: available, in use, maintenance, or retired.
- **Products** — Full CRUD for marketplace products; manage stock levels.
- **Feedback** — View all feedback, mark items as resolved/reopened, or delete them.

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [MongoDB](https://www.mongodb.com/) (local instance or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-org/pulsefit-gym.git
cd pulsefit-gym
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

## Environment Variables

### Backend — `backend/.env`

Create a `.env` file inside the `backend/` directory with the following keys:

```env
# MongoDB connection string
MONGO_URI=mongodb://localhost:27017/pulsefit

# JWT settings
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# bcrypt salt rounds (10 recommended)
BCRYPT_SALT=10

# Server port
PORT=3000

# Allow requests from the frontend origin
CLIENT_URL=http://localhost:3001
```

> **Never commit `.env` to version control.** It is already listed in `.gitignore`.

---

## Running the Application

### Backend (development)

```bash
cd backend
npm run dev
```

The API server starts at `http://localhost:3000` (or the port in your `.env`).

### Frontend (development)

```bash
cd frontend
npm start
```

The React app starts at `http://localhost:3001` and proxies API calls to the backend.

Both servers must be running at the same time during development.

---

## API Reference

All routes are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Endpoint    | Auth     | Description            |
|--------|-------------|----------|------------------------|
| POST   | `/register` | Public   | Register a new user    |
| POST   | `/login`    | Public   | Log in, receive a JWT  |

**Register body:**
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "Secure1!",
  "phone": "01012345678"
}
```

Password must be at least 8 characters and include an uppercase letter, a number, and a special character.

**Login body:**
```json
{
  "email": "jane@example.com",
  "password": "Secure1!"
}
```

Both endpoints return a `token` and a `user` object on success.

---

### Users — `/api/users`

| Method | Endpoint  | Auth         | Description              |
|--------|-----------|--------------|--------------------------|
| GET    | `/me`     | Member+      | Get own profile          |
| PUT    | `/me`     | Member+      | Update own profile       |
| GET    | `/`       | Admin only   | List all users           |
| GET    | `/:id`    | Admin only   | Get a single user        |
| POST   | `/`       | Admin only   | Create a user            |
| PUT    | `/:id`    | Admin only   | Edit any user            |
| DELETE | `/:id`    | Admin only   | Delete a user            |

---

### Plans — `/api/plans`

| Method | Endpoint | Auth       | Description          |
|--------|----------|------------|----------------------|
| GET    | `/`      | Public     | List all active plans (add `?all=true` for admin view) |
| GET    | `/:id`   | Public     | Get a single plan    |
| POST   | `/`      | Admin only | Create a plan        |
| PUT    | `/:id`   | Admin only | Update a plan        |
| DELETE | `/:id`   | Admin only | Delete a plan        |

---

### Subscriptions — `/api/subscriptions`

| Method | Endpoint     | Auth       | Description                        |
|--------|--------------|------------|------------------------------------|
| GET    | `/my`        | Member+    | Get own active subscription        |
| POST   | `/`          | Member+    | Subscribe to a plan                |
| PATCH  | `/:id/cancel`| Member+    | Cancel own subscription            |
| GET    | `/`          | Admin only | List all subscriptions             |

**Subscribe body:**
```json
{ "planId": "<plan_id>" }
```

---

### Classes — `/api/classes`

| Method | Endpoint | Auth       | Description        |
|--------|----------|------------|--------------------|
| GET    | `/`      | Public     | List all classes   |
| GET    | `/:id`   | Public     | Get a single class |
| POST   | `/`      | Admin only | Create a class     |
| PUT    | `/:id`   | Admin only | Update a class     |
| DELETE | `/:id`   | Admin only | Delete a class     |

---

### Bookings — `/api/bookings`

| Method | Endpoint        | Auth       | Description                        |
|--------|-----------------|------------|------------------------------------|
| POST   | `/`             | Member+    | Book a class                       |
| GET    | `/my`           | Member+    | List own active bookings           |
| PATCH  | `/:id/cancel`   | Member+    | Cancel a booking                   |
| GET    | `/`             | Admin only | List all bookings                  |

**Book body:**
```json
{ "classId": "<class_id>" }
```

---

### Products — `/api/products`

| Method | Endpoint   | Auth       | Description                       |
|--------|------------|------------|-----------------------------------|
| GET    | `/`        | Public     | List active products (add `?all=true` for admin view) |
| GET    | `/:id`     | Public     | Get a single product              |
| POST   | `/`        | Admin only | Create a product                  |
| PUT    | `/:id`     | Admin only | Update a product                  |
| DELETE | `/:id`     | Admin only | Delete a product                  |
| PATCH  | `/:id/buy` | Member+    | Reserve a product (reduces stock) |

---

### Product Reservations — `/api/reservations`

| Method | Endpoint        | Auth       | Description                    |
|--------|-----------------|------------|--------------------------------|
| GET    | `/my`           | Member+    | List own reservations          |
| PATCH  | `/:id/cancel`   | Member+    | Cancel own reservation         |
| GET    | `/`             | Admin only | List all reservations          |
| PATCH  | `/:id/status`   | Admin only | Update reservation status      |

Admin status values: `reserved`, `picked_up`, `cancelled`. Cancelling via admin restores stock automatically.

---

### Equipment — `/api/equipment`

| Method | Endpoint | Auth       | Description           |
|--------|----------|------------|-----------------------|
| GET    | `/`      | Admin only | List all equipment    |
| GET    | `/:id`   | Admin only | Get a single item     |
| POST   | `/`      | Admin only | Add equipment         |
| PUT    | `/:id`   | Admin only | Update equipment      |
| DELETE | `/:id`   | Admin only | Remove equipment      |

Status options: `available`, `in_use`, `maintenance`, `retired`.

---

### Feedback — `/api/feedback`

| Method | Endpoint        | Auth       | Description              |
|--------|-----------------|------------|--------------------------|
| POST   | `/`             | Public     | Submit feedback          |
| GET    | `/`             | Admin only | List all feedback        |
| PATCH  | `/:id/resolve`  | Admin only | Mark feedback resolved   |
| PATCH  | `/:id/reopen`   | Admin only | Reopen resolved feedback |
| DELETE | `/:id`          | Admin only | Delete feedback          |

**Submit body:**
```json
{
  "message": "Great classes!",
  "rating": 5,
  "memberName": "Jane"
}
```

`memberName` is optional and defaults to `"Anonymous"`.

---

## Roles & Access Control

The system has two roles: **member** and **admin**.

All authenticated requests must include the JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

| Role   | Access                                                                 |
|--------|------------------------------------------------------------------------|
| Public | Home, Plans list, Classes list, Products list, Feedback submission     |
| Member | All public routes + bookings, subscriptions, reservations, own account |
| Admin  | All member routes + full CRUD on all resources, equipment, admin panel |

Admins are created by setting `role: "admin"` directly in the database or via the admin user creation endpoint.

---

## Running Tests

Test files are located in `backend/tests/`. The test suite uses the files:

```
backend/tests/auth.test.js
backend/tests/classes.test.js
backend/tests/equipment.test.js
backend/tests/feedback.test.js
backend/tests/plans.test.js
backend/tests/products.test.js
backend/tests/users.test.js
```

To run tests (once implemented):

```bash
cd backend
npm test
```

Frontend tests use React Testing Library and can be run with:

```bash
cd frontend
npm test
```

---

## Contributing

1. Fork the repository and create a feature branch: `git checkout -b feature/your-feature`
2. Follow the existing code style (ESLint + Prettier are configured in the backend).
3. Keep commits descriptive and focused.
4. Open a pull request with a clear description of the change and any relevant context.

---

> Built with Node.js, Express, MongoDB, and React — PulseFit Gym Management System.
