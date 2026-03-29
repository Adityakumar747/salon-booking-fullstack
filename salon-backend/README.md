# Jawed Habib Salon - Backend API

Robust Express.js API powering the Jawed Habib Salon platform, providing secure authentication and real-time booking management.

## 🛡 Features

- **JWT Authentication**: Secure user sessions and role-based access control.
- **MDB Integration**: Scalable data persistence with Mongoose ODM.
- **Rate Limiting**: Protection against brute-force and DDoS attacks.
- **Validation**: Strict schema validation using Zod.
- **Error Handling**: Centralized asynchronous error management.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Security**: Bcrypt.js, JWT, Helmet, Express Rate Limit
- **Validation**: Zod

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   Create a `.env` file based on `.env.example`.

3. Seed Initial Data:
   ```bash
   node seed-data.js
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

## 📡 API Endpoints (V1)

### Auth
- `POST /auth/register` - Create new user
- `POST /auth/login` - Authenticate & get token

### Services
- `GET /services` - List all services (supports filtering)
- `GET /services/:id` - Get service details

### Appointments
- `POST /appointments` - Book new appointment
- `GET /appointments/me` - Get user's bookings
- `PATCH /appointments/:id/cancel` - Cancel booking

### Stylists
- `GET /stylists` - List available professionals
