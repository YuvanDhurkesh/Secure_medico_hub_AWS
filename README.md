# Medicare Hub – Secure Multi-Tier Healthcare Management System on AWS

## Project Overview

Medicare Hub is a full-stack healthcare management application deployed using a secure multi-tier AWS cloud architecture. The application enables patient management, appointment booking, and medical report uploads while demonstrating enterprise-style cloud deployment practices.

The project was designed with a production-oriented architecture using private networking, load balancing, reverse proxy configuration, managed database services, and AWS web security protection.

---

# Live Architecture

```text
Internet
   ↓
AWS WAF
   ↓
Application Load Balancer (ALB)
   ↓
Nginx Reverse Proxy
   ├── React Frontend
   └── Node.js Backend (PM2)
              ↓
        Amazon RDS MySQL
```

---

# AWS Architecture Diagram

```text
                         ┌──────────────────────────┐
                         │        Internet          │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │        AWS WAF           │
                         │ SQLi / XSS Protection    │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                    ┌──────────────────────────────────┐
                    │ Application Load Balancer (ALB) │
                    │         Public Subnets          │
                    └────────────┬────────────────────┘
                                 │
                                 ▼
              ┌──────────────────────────────────────────┐
              │          Private EC2 Instance            │
              │                                          │
              │  ┌────────────────────────────────────┐  │
              │  │               Nginx               │  │
              │  │ Reverse Proxy + Frontend Hosting  │  │
              │  └───────────────┬───────────────────┘  │
              │                  │                      │
              │      ┌───────────┴───────────┐          │
              │      ▼                       ▼          │
              │ React Frontend        Node.js Backend   │
              │  (Static Build)          (PM2)          │
              │                                         │
              └──────────────────┬──────────────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │      Amazon RDS          │
                    │        MySQL DB          │
                    │   Private Subnet Only    │
                    └──────────────────────────┘


               ┌─────────────────────────────────┐
               │          Bastion Host           │
               │      Public Subnet Access       │
               │ SSH Entry Point to Private EC2  │
               └─────────────────────────────────┘
```

---

# Features

## Application Features

- Patient Registration
- Appointment Booking
- Medical Report Uploads
- Patient Report Management
- REST API Architecture
- Responsive React Frontend

---

# Security Features

- Private Backend EC2 Deployment
- Private Amazon RDS Database
- Bastion Host SSH Access
- AWS WAF Protection
- Security Group Isolation
- Public/Private Subnet Separation
- Reverse Proxy using Nginx
- Environment Variable Configuration
- Load Balancer Health Checks

---

# AWS Services Used

| Service | Purpose |
|---|---|
| Amazon EC2 | Backend server hosting |
| Amazon RDS MySQL | Managed database |
| Application Load Balancer | Traffic distribution |
| AWS WAF | Web application firewall |
| Amazon VPC | Custom isolated networking |
| NAT Gateway | Internet access for private subnet |
| Internet Gateway | Public internet access |
| Security Groups | Firewall rules |
| Nginx | Reverse proxy & frontend hosting |
| PM2 | Node.js process management |

---

# Tech Stack

## Frontend
- React.js
- Vite
- Axios
- CSS

## Backend
- Node.js
- Express.js
- MySQL2
- Multer

## Cloud & DevOps
- AWS EC2
- AWS RDS
- AWS WAF
- AWS ALB
- AWS VPC
- Nginx
- PM2

---

# Project Structure

```text
medico_hub/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── routes/
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── schema.sql
```

---

# Local Development Setup

## Prerequisites

- Node.js
- MySQL Server
- Git

---

# Clone Repository

```bash
git clone <your-github-repo-url>
cd medico_hub
```

---

# Database Setup

Open MySQL and run:

```sql
SOURCE schema.sql;
```

This creates:
- medicare_hub database
- patients table
- appointments table
- reports table

---

# Backend Setup

## Navigate to backend

```bash
cd backend
```

## Install dependencies

```bash
npm install
```

## Create `.env`

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=medicare_hub
```

## Start backend

```bash
node server.js
```

Backend runs on:

```text
http://localhost:5000
```

---

# Frontend Setup

## Navigate to frontend

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## Start frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Production Deployment Architecture

## Frontend Deployment

The React frontend was built using:

```bash
npm run build
```

The generated static files were hosted using Nginx:

```text
/usr/share/nginx/html
```

Nginx serves:
- HTML
- CSS
- JavaScript bundles

---

# Backend Deployment

The Node.js backend was deployed on a private EC2 instance using PM2:

```bash
pm2 start server.js --name server
```

PM2 provides:
- Process management
- Auto restart
- Background execution
- Crash recovery

---

# Nginx Reverse Proxy Configuration

Nginx handles:
- Frontend hosting
- API reverse proxying

Example flow:

```text
/api/*  → Node.js backend
/       → React frontend
```

---

# Networking Architecture

## Public Subnet
Contains:
- Application Load Balancer
- Bastion Host
- NAT Gateway

## Private Subnet
Contains:
- Backend EC2
- Amazon RDS

---

# Security Architecture

## Bastion Host
Used for secure SSH access into private EC2 instances.

## Private Backend
Backend EC2 instance does not have a public IP.

## Private Database
Amazon RDS configured with:
- Public Access = No

## AWS WAF
Configured with managed security rules for:
- SQL Injection protection
- Malicious payload inspection
- Rate limiting

---

# API Endpoints

## Patients API

### Register Patient

```http
POST /api/patients
```

### Get Patients

```http
GET /api/patients
```

---

## Appointments API

### Book Appointment

```http
POST /api/appointments
```

### Get Appointments

```http
GET /api/appointments
```

---

## Reports API

### Upload Report

```http
POST /api/reports/upload-report
```

### Get Reports

```http
GET /api/reports
```

---

# Health Check Endpoint

```http
GET /health
```

Response:

```json
{
  "status": "healthy"
}
```

---

# Deployment Highlights

- Multi-tier AWS Architecture
- Secure Private Networking
- Production-grade Reverse Proxy Setup
- Managed Database Deployment
- Web Security with AWS WAF
- Load Balanced Traffic Routing
- Cloud-ready Stateless Backend Design

---

# Screenshots

Attached

---

# Demo Video

(Add YouTube demo link here)

---

# Future Improvements

- JWT Authentication
- HTTPS using ACM + Route53
- Docker Containerization
- CI/CD using GitHub Actions
- Amazon S3 Report Storage
- Auto Scaling Groups
- Monitoring using CloudWatch

---

# Author

Yuvan Dhurkesh SJ

BTech CSE Undergraduate  
Cloud & DevOps Enthusiast  
AWS Certified Learner
