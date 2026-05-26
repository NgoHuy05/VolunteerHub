# 🌍 VolunteerHub - Fullstack Web Application

## 🚀 Introduction

**VolunteerHub** is a fullstack web application that connects volunteers with meaningful events.
Users can discover, join, and interact with volunteer activities in real-time.

This project focuses on modern web technologies, real-time communication, and scalable architecture.

---

## ✨ Features

* 🔐 **Authentication & Authorization**

  * Register / Login with JWT
  * Password hashing using bcrypt

* 👥 **Volunteer Events**

  * Browse events
  * Join / leave events
  * View event details

* 📡 **Real-time Communication**

  * Chat using Socket.IO
  * Live updates between users

* 🖼️ **Image Upload**

  * Upload images via Cloudinary
  * File handling with Multer

* 🔍 **Search & Infinite Scroll**

  * Infinite scrolling

* 📊 **Dashboard**

  * Charts with Recharts

---

## 🛠️ Tech Stack

### 🔹 Frontend

* React (Vite)
* TailwindCSS
* React Router DOM
* Axios
* Socket.IO Client
* Recharts
* React Hot Toast

### 🔹 Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Socket.IO
* Cloudinary + Multer

---

## 📂 Project Structure

```
VolunteerHub/
│
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── server/                 # Backend (Node + Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone repository

```bash
git clone https://github.com/NgoHuy05/VolunteerHub.git
cd VolunteerHub
```

---

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔥 What I Learned

* Fullstack development with React + Node.js
* RESTful API design
* JWT authentication
* Real-time features with Socket.IO
* File upload handling with Cloudinary
* Performance optimization (debounce, infinite scroll)

---

## 📸 Demo
<img width="1917" height="963" alt="Screenshot 2026-05-26 182049" src="https://github.com/user-attachments/assets/3178512f-218e-44ea-a524-28c973afea21" />
<img width="1896" height="904" alt="Screenshot 2026-05-26 182103" src="https://github.com/user-attachments/assets/8cd852e9-7995-43b2-a4a0-8a406d7abb01" />
<img width="1890" height="903" alt="Screenshot 2026-05-26 182109" src="https://github.com/user-attachments/assets/fda59c36-86c0-4fdf-a98c-f71854dcfe72" />
<img width="1894" height="953" alt="Screenshot 2026-05-26 182116" src="https://github.com/user-attachments/assets/29afc0d0-c636-40d3-bfa6-ba3a80f51fce" />
<img width="1892" height="964" alt="Screenshot 2026-05-26 182132" src="https://github.com/user-attachments/assets/09a17e1f-347e-4b36-9b5e-78b68f818d17" />
<img width="1913" height="965" alt="Screenshot 2026-05-26 182143" src="https://github.com/user-attachments/assets/ecd4b22a-6fd0-4345-a791-923ede9744d8" />
<img width="1894" height="966" alt="Screenshot 2026-05-26 182152" src="https://github.com/user-attachments/assets/81f17fe7-f41d-4a1a-a149-d7513a1051ad" />
<img width="1896" height="960" alt="Screenshot 2026-05-26 182205" src="https://github.com/user-attachments/assets/34a80ed2-e4d9-4557-9aaa-88657f13fa3c" />
<img width="1897" height="959" alt="Screenshot 2026-05-26 182215" src="https://github.com/user-attachments/assets/59b94af8-3b13-4863-b439-b23544b84d14" />
<img width="1894" height="961" alt="Screenshot 2026-05-26 182220" src="https://github.com/user-attachments/assets/ec123449-6336-478f-8ee1-65b03d23669b" />
<img width="1892" height="966" alt="Screenshot 2026-05-26 182227" src="https://github.com/user-attachments/assets/46d320e6-07da-4313-afc9-9d6fc9187353" />
<img width="1898" height="968" alt="Screenshot 2026-05-26 182232" src="https://github.com/user-attachments/assets/9a15be15-5dd7-4cde-a94a-8f8a9457f830" />
<img width="1895" height="959" alt="Screenshot 2026-05-26 182247" src="https://github.com/user-attachments/assets/b28ca89d-d8dd-48bd-97e7-c161861c130f" />
<img width="1917" height="968" alt="Screenshot 2026-05-26 182255" src="https://github.com/user-attachments/assets/e3939b61-44df-4db1-ad92-e4fc3ae92b9c" />
<img width="1901" height="961" alt="Screenshot 2026-05-26 182312" src="https://github.com/user-attachments/assets/1b182caf-ab21-471b-b37d-33352f40bf0e" />
<img width="1905" height="961" alt="Screenshot 2026-05-26 182437" src="https://github.com/user-attachments/assets/26209827-3796-497b-9810-c5a3b8e9fad0" />
<img width="1895" height="962" alt="Screenshot 2026-05-26 182500" src="https://github.com/user-attachments/assets/4445c8b3-d647-403e-9590-7b797cf75072" />




