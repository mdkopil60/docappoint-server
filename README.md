# 🩺 DocAppoint Server - Backend API

Backend server for the DocAppoint doctor appointment booking platform.

---

## 🌐 Live API

🔗 Server Link: https://your-server-url.com

---

## 🚀 Features

- 🔐 JWT Authentication
- 👨‍⚕️ Doctor Management API
- 📅 Appointment Booking API
- ✏️ Update Appointment API
- ❌ Delete Appointment API
- 👤 User Profile API
- 🔍 Search Functionality
- ⚡ RESTful API Structure

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT
- Better Auth
- dotenv
- cors

---

## 📁 Server Structure

```bash
server/
 ├── index.js
 ├── routes/
 ├── middleware/
 ├── config/
```

---

## 🔑 Environment Variables

Create a `.env` file:

```env
PORT=5000
DB_USER=your_db_user
DB_PASS=your_db_password
JWT_SECRET=your_secret_key
```

---

## 📦 Installation


Install packages:

```bash
npm install
```

Run server:

```bash
npm run dev
```

---

## 📡 API Endpoints

### Doctors

```bash
GET /all-appointments
GET /all-appointments/:id
```

### Bookings

```bash
POST /bookings
GET /bookings
PATCH /bookings/:id
DELETE /bookings/:id
```

### Users

```bash
POST /users
GET /users
PATCH /users/:id
```

---

## 🔥 Security Features

- JWT Protected Routes
- Secure API Access
- Environment Variable Protection
- MongoDB Secure Connection

---

## 👨‍💻 Developer

Developed by Kopil Uddin