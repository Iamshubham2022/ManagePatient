# Patient Management System with Real-Time Updates

## Overview
This project is a **Patient Management System** that prioritizes patients based on the severity of their condition and provides real-time updates on doctor availability using **Socket.IO notifications**.

### Features:
- **Patient Queue Management:** Patients are categorized based on triage levels (1 to 5) and stored in a queue accordingly.
- **Doctor Availability Updates:** Doctors can mark themselves as available or unavailable, and real-time updates are sent to all connected clients.
- **Real-Time Notifications:** Using Socket.IO, critical patient conditions, doctor availability, and queue status updates are broadcasted live.
- **Discharge & Treatment System:** The system allows treating and discharging patients efficiently.

## Technologies Used
- **Node.js** (Backend framework)
- **Express.js** (Routing & Middleware handling)
- **Socket.IO** (Real-time updates)
- **UUID** (For generating unique patient IDs)
- **dotenv** (Environment variable management)

## Installation Guide

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+ recommended)
- **npm** (Node Package Manager)

### Steps to Install
1. Clone this repository:
   ```sh
   git clone https://github.com/your-repo/patient-management-system.git
   cd patient-management-system
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a **.env** file and configure environment variables:
   ```sh
   FRONTEND_URL=http://localhost:3000
   PORT=3000
   ```
4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

### **Patients API**
| Method | Endpoint               | Description                    |
|--------|------------------------|--------------------------------|
| POST   | `/patients/add`         | Add a new patient             |
| GET    | `/doctors/status`       | Get all patients in queue     |
| GET    | `/patients/queue`       | check doctor status           |
| PATCH  | `/patients/treatment`   | Treat the next patient        |
| PATCH  | `/patients/:id/discharge` | Discharge a patient         |
| PATCH  | `/doctors/availability`  | Update doctor availability    |


#### Example: Add a Patient
**Request:**
```json
{
    "name": "John Doe",
    "triageLevel": 2
}
```
**Response:**
```json
{
    "id": "b342de22-1234-45af-a23b-f1d3abc456",
    "name": "John Doe",
    "triageLevel": 2,
    "arrivalTime": 1712136800000
}
```

### **Doctors API**
| Method | Endpoint                 | Description                   |
|--------|--------------------------|-------------------------------|
| PATCH  | `/doctors/availability`  | Update doctor availability    |
| GET    | `/doctors/status`        | Get doctor status & queue size |

#### Example: Update Doctor Availability
**Request:**
```json
{
    "available": true
}
```
**Response:**
```json
{
    "message": "Doctor availability updated",
    "doctorAvailable": true
}
```

## Real-Time Features with Socket.IO
- **Critical Patient Notification:** When a patient with triage level **1** is added, all connected clients are notified.
- **Doctor Availability Notification:** Clients receive a real-time update when a doctor changes their availability status.
- **Queue Updates:** When a patient is added, treated, or discharged, all clients receive live queue updates.

## Testing with Postman
1. Open **Postman**.
2. Send a **POST request** to `http://localhost:3000/patients/add` with patient details.
3. Check the queue with a **GET request** to `http://localhost:3000/patients/queue`.
4. Update doctor availability using a **PATCH request** to `http://localhost:3000/doctors/availability`.
5. Check doctor status using a **GET request** to `http://localhost:3000/doctors/status`.
6. Treat the next patient with a **PATCH request** to `http://localhost:3000/patients/treatment`.
7. Discharge a patient using a **PATCH request** to `http://localhost:3000/patients/:id/discharge`.

## Project Structure
```
.
├── server.js
├── routes
│   ├── doctorRoutes.js
│   ├── patientRoutes.js
├── services
│   ├── queueService.js
│   ├── notificationService.js
├── utils
│   ├── logger.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Author
Developed by **Shubham Jaiswal**

## License
This project is licensed under the **MIT License**.

