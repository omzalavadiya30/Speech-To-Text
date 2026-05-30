# 🎙️ Speech To Text Transcription System

## Overview

Speech To Text is a full-stack web application that converts speech into text using AI-powered transcription. Users can upload audio files or use live speech transcription, save transcripts, manage transcription history, and securely authenticate using JWT-based authentication.

---

## 🚀 Live Demo

### Frontend Application

https://speech-to-text-kappa-neon.vercel.app

### Backend API

https://speech-to-text-backend-0c8r.onrender.com

---

## ✨ Features

### Authentication & User Sessions

* User Registration
* User Login
* JWT Authentication
* Remember Me Functionality
* Forgot Password
* Reset Password via Email
* Secure Logout
* Protected Routes

### Speech Transcription

* Audio File Upload
* Deepgram AI-Powered Transcription
* Live Speech-to-Text Transcription
* Save Live Transcriptions
* User-Specific Transcription History

### Dashboard

* Personalized User Dashboard
* Upload Audio Interface
* Live Recording Interface
* Latest Transcript Viewer
* Transcription History Management

### Deployment

* Frontend deployed on Vercel
* Backend deployed on Render
* MongoDB Atlas Database

---

## 🔒 Security Features

* JWT Authentication
* HTTP-Only Cookies
* Password Hashing using BcryptJS
* Protected API Routes
* Reset Password Token Expiry
* User-Specific Data Access
* Secure Logout Mechanism

---

## 🛠️ Tech Stack

### Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* Axios
* React Hot Toast
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* BcryptJS
* Multer
* Deepgram SDK
* Resend Email API

---

## 📁 Project Structure

```text
Speech-To-Text/
│
├── client/
│   ├── public/
│   ├── src/
│   │   └── app/
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       ├── forgot-password/
│   │       │   └── page.tsx
│   │       ├── login/
│   │       │   └── page.tsx
│   │       ├── register/
│   │       │   └── page.tsx
│   │       ├── reset-password/
│   │       │   └── [token]/
│   │       │       └── page.tsx
│   │       ├── globals.css
│   │       ├── layout.tsx
│   │       └── page.tsx
│   │
│   ├── proxy.ts
│   ├── next.config.ts
│   └── package.json
│
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── transcriptionController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── speechTranscription.js
│   │
│   ├── routes/
│   │   ├── authRoute.js
│   │   └── uploadRoute.js
│   │
│   ├── utils/
│   │   └── sendEmail.js
│   │
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 📸 Screenshots

### Login Page

(Add Login Page Screenshot Here)

### Dashboard

(Add Dashboard Screenshot Here)

### Transcription History

(Add History Screenshot Here)

---

## ⚙️ Environment Variables

### Backend (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

DEEPGRAM_API_KEY=your_deepgram_api_key

RESEND_API_KEY=your_resend_api_key

CLIENT_URL=http://localhost:3000

NODE_ENV=development
```

### Frontend (.env.local)

```env
BACKEND_URL=http://localhost:5000
```

---

## 📦 Installation

### Clone Repository

```bash
git clone <repository-url>

cd Speech-To-Text
```

### Backend Setup

```bash
cd server

npm install

npm run dev
```

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                        |
| ------ | ------------------------------- |
| POST   | /api/auth/register              |
| POST   | /api/auth/login                 |
| POST   | /api/auth/logout                |
| POST   | /api/auth/forgot-password       |
| POST   | /api/auth/reset-password/:token |
| GET    | /api/auth/me                    |

### Transcription

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /api/upload    |
| GET    | /api/history   |
| POST   | /api/save-live |

---

## 🔄 Authentication Flow

1. Register a new account.
2. Login with email and password.
3. JWT token is stored in HTTP-only cookies.
4. Protected routes verify authentication.
5. Forgot password emails are sent using Resend.
6. Password reset tokens expire automatically.
7. Remember Me extends session duration.

---

## 🚀 Deployment

### Backend Deployment (Render)

1. Push backend code to GitHub.
2. Create a Web Service in Render.
3. Connect repository.
4. Add environment variables.
5. Deploy service.

### Frontend Deployment (Vercel)

1. Import repository into Vercel.
2. Set Root Directory to `client`.
3. Configure environment variables.
4. Deploy project.

---

## ⚠️ Known Limitations

* Live transcription uses the browser Speech Recognition API.
* Accuracy may vary depending on microphone quality, browser support, accent, and background noise.
* Audio file uploads provide higher transcription accuracy through Deepgram AI.

---

## 🔮 Future Improvements

* Deepgram Real-Time Streaming API
* Transcript Download (TXT/PDF)
* Multi-Language Transcription
* Audio Playback Support
* Search and Filter History
* User Profile Management
* Export Transcriptions
* Dark/Light Theme Toggle

---

## 👨‍💻 Author

Developed by **Om Zalavadiya** as part of the **Labmentix Internship Program**.

### Contact

* GitHub: https://github.com/omzalavadiya30
* LinkedIn: https://www.linkedin.com/in/om-zalavadiya-a69044211/

---

## 📜 License

This project is developed for educational and internship purposes under the Labmentix Internship Program.
