# Medicare Hub

A full-stack healthcare web application built with React, Node.js, Express, and MySQL. This application is designed to be cloud-deployment friendly, keeping the backend stateless and using environment variables for configuration.

## Folder Structure

```
medico_hub/
├── backend/
│   ├── config/
│   │   └── db.js            # Database connection setup
│   ├── controllers/         # Request handling logic
│   ├── routes/              # Express route definitions
│   ├── uploads/             # Locally stored medical reports
│   ├── .env.example         # Environment variable template
│   ├── package.json
│   └── server.js            # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components (Navbar)
│   │   ├── pages/           # Application pages (Dashboard, Patients, etc.)
│   │   ├── App.jsx          # Main application component & routing
│   │   ├── index.css        # Global styles
│   │   └── main.jsx         # React entry point
│   ├── .env.example         # Environment variable template
│   ├── package.json
│   └── vite.config.js       # Vite configuration
└── schema.sql               # MySQL database schema script
```

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server

## Database Setup

1. Open your MySQL client (e.g., MySQL Workbench, or via command line).
2. Execute the script located at `schema.sql` to create the `medicare_hub` database and the required tables (`patients`, `appointments`, `reports`).

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory based on `.env.example`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=medicare_hub
   ```
4. Start the server:
   ```bash
   node server.js
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory based on `.env.example`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Patients API

- **POST `/api/patients`**
  - Registers a new patient.
  - Body: `{ "name": "John Doe", "age": 30, "gender": "Male", "email": "john@example.com", "phone_number": "1234567890" }`
- **GET `/api/patients`**
  - Retrieves a list of all registered patients.

### Appointments API

- **POST `/api/appointments`**
  - Books a new appointment.
  - Body: `{ "patient_name": "John Doe", "doctor_name": "Dr. Smith", "appointment_date": "2023-12-01", "appointment_reason": "Checkup" }`
- **GET `/api/appointments`**
  - Retrieves a list of all appointments.

### Reports API

- **POST `/api/reports/upload-report`**
  - Uploads a medical report. Uses `multipart/form-data`.
  - Body: `patient_name` (Text), `report` (File: PDF/JPG/PNG).
- **GET `/api/reports`**
  - Retrieves a list of all uploaded reports metadata.

## Cloud Deployment Readiness

- **Stateless Backend**: Sessions are not stored in memory. The frontend relies on stateless behavior (dummy authentication for now, can be extended to JWT).
- **Environment Variables**: All sensitive info and configuration details are pulled from `.env` files.
- **Local Storage**: Currently uses `multer` disk storage (`uploads/`). For AWS deployment, this can be swapped out with an S3 upload handler (e.g., `multer-s3`).
