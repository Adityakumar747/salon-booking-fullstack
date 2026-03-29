# Jawed Habib Salon Platform

A premium full-stack salon management and booking platform built for the Jawed Habib franchise. This application provides a seamless experience for users to explore luxury services and book appointments with heritage stylists.

## 🚀 Features

- **Heritage Branding**: Custom design language reflecting the Jawed Habib legacy.
- **Dynamic Service Catalog**: Browse services by category (Hair, Skin, Bridal, Grooming) and audience (Men, Women, Kids).
- **Smart Booking System**: Real-time slot availability, stylist selection, and automated scheduling.
- **User Dashboard**: Manage your profile, view upcoming appointments, and booking history.
- **Admin Suite**: Comprehensive dashboard for managing services, stylists, and salon operations.

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS (Custom Theme)
- **State Management**: React Context & TanStack Query (React Query)
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form & Zod

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB Atlas (Mongoose)
- **Security**: JWT Authentication, Helmet, Rate Limiting
- **File Storage**: Cloudinary API for media assets

## 📦 Project Structure

```bash
salon-platform/
├── salon-frontend/ # Next.js application
└── salon-backend/  # Express API server
```

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/salon-platform.git
cd salon-platform
```

### 2. Backend Setup
```bash
cd salon-backend
npm install
# Create .env based on .env.example
npm run dev
```

### 3. Frontend Setup
```bash
cd ../salon-frontend
npm install
# Create .env.local based on .env.local.example
npm run dev
```

## 📄 License

This project is for educational/internship application purposes. All branding rights belong to Jawed Habib.
