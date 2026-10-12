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
