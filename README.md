<<<<<<< HEAD
# Bus Ticket Booking System

Bus ticket booking app with an Angular frontend and Spring Boot API backed by MySQL.

## Requirements

- Java 25
- MySQL
- Node.js and npm

Create the `bus_ticket_booking` database before starting the API. Hibernate is configured to validate the existing schema, so the tables must already match the JPA entities.

## Backend

Set the database password and a private JWT signing secret in the shell. `JWT_SECRET` must contain at least 32 UTF-8 bytes. Set the admin email, password, and phone when you want the application to create or refresh an admin account at startup; otherwise no admin account is seeded.

PowerShell example:

```powershell
$env:DB_PASSWORD = "your-database-password"
$jwtBytes = New-Object byte[] 48
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($jwtBytes)
$env:JWT_SECRET = [Convert]::ToBase64String($jwtBytes)
$rng.Dispose()
$env:ADMIN_EMAIL = "admin@example.com"
$env:ADMIN_PASSWORD = "your-admin-password"
$env:ADMIN_PHONE = "your-admin-phone"
cd bus-ticket-booking
.\mvnw.cmd spring-boot:run
```

Keep the JWT and admin secrets out of source control. If the previous hardcoded demo admin was already created in a local database, configure all admin variables with that email to replace its password on startup.

## Frontend

```powershell
cd bus-ticket-frontend
npm ci
npm start
```

The Angular app runs at `http://localhost:4200` and expects the API at `http://localhost:8080`.
=======
# 🚌 Bus Management System

A full-stack **Bus Management and Ticket Booking System** developed using **Spring Boot, Angular, and MySQL**.

The system provides separate interfaces for **Administrators** and **Users**. Administrators can manage buses, operators, locations, journeys, seats, and bookings, while users can search for available buses, select seats, make bookings, and view their booking history.

---

## 📌 Project Overview

The Bus Management System is designed to digitize the process of managing bus services and booking bus tickets.

The application follows a role-based architecture:

### 👨‍💼 Admin

Administrators can:

- Login securely
- Manage bus operators
- Add and manage buses
- Manage bus locations
- Manage seats
- Create and manage journeys
- View bookings
- Monitor bus and journey information

### 👤 User

Registered users can:

- Create an account
- Login securely
- Search available buses
- View journey details
- View available seats
- Select seats
- Book tickets
- Make payments
- View their booking history

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration
- User login
- Admin login
- JWT-based authentication
- BCrypt password encryption
- Role-based authorization
- Protected API endpoints
- Authentication interceptor on the Angular frontend
- Separate Admin and User dashboards

### 🚌 Bus Management

Administrators can manage:

- Bus number
- Bus name
- Bus type
- Total seats
- Bus status
- Bus operator

Supported bus types:

- AC
- Non-AC
- Sleeper
- Semi-Sleeper

### 🏢 Operator Management

Administrators can manage:

- Operator name
- Contact number
- Email
- Address

### 📍 Location Management

Administrators can manage source and destination locations.

Each location contains:

- City
- State

### 🗓️ Journey Management

Administrators can create and manage journeys with:

- Bus
- Source
- Destination
- Departure time
- Arrival time
- Travel date
- Fare
- Journey status

Journey statuses include:

- Scheduled
- In Progress
- Completed
- Cancelled

### 💺 Seat Management

The system maintains seats for each bus.

Supported seat types include:

- Window
- Aisle
- Semi-Sleeper
- Sleeper

Seats are associated with individual buses.

### 🎫 Ticket Booking

Users can:

1. Search for a journey
2. Select a bus
3. View available seats
4. Select a seat
5. Confirm the booking
6. Complete payment
7. View booking details

The database prevents the same seat from being booked twice for the same journey.

### 💳 Payment Management

The system maintains payment information for bookings.

Supported payment methods:

- UPI
- Card
- Net Banking
- Cash

Payment statuses:

- Pending
- Success
- Failed

### 📋 Booking Management

Users can view their own bookings.

Administrators can view booking information across the system.

---

# 🏗️ System Architecture

```text
                   ┌──────────────────────┐
                   │      Angular UI      │
                   │      Port: 4200      │
                   └──────────┬───────────┘
                              │
                              │ HTTP / REST API
                              ▼
                   ┌──────────────────────┐
                   │    Spring Boot API   │
                   │      Port: 8080      │
                   └──────────┬───────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
       Controllers         Services       Security
             │                │           JWT / BCrypt
             └────────────────┼────────────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │    Spring Data JPA   │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │        MySQL         │
                   │  bus_ticket_booking  │
                   └──────────────────────┘
>>>>>>> df7cefb5af9e5f530dc7dbcc2982d8d0c35f5abf
