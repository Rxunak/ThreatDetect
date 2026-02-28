# ThreatDetect

ThreatDetect is a full-stack content safety application that combines:
- real-time object detection from webcam streams
- rule-based text threat analysis
- admin moderation dashboard for detections, text logs, and user management

This repo is organized as a monorepo with separate frontend and backend apps.

## Project Structure

```text
ThreatDetect/
├── Back-end/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── Email/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── Front-end/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   └── package.json
└── README.md
```

## Tech Stack

### Frontend
- React 18
- React Router 6
- TensorFlow.js + COCO-SSD model (live detection)
- React Toastify

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Dotenv
- Nodemailer

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas (or local MongoDB)

## Environment Setup

Create a backend env file from the example:

```bash
cd Back-end
cp .env.example .env
```

Set these values in `Back-end/.env`:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_app_password
```

## Run Locally

### 1. Start Backend

```bash
cd Back-end
npm install
npm run dev
```

Backend runs on: `http://localhost:5001`

### 2. Start Frontend

Open a new terminal:

```bash
cd Front-end
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

## Build Frontend

```bash
cd Front-end
npm run build
```

## Core Features

- User signup/login and route protection
- Live object detection with on-frame bounding boxes
- Text analysis with threat category classification
- Admin dashboard with:
  - detection logs
  - text analysis logs
  - user block/unblock/remove controls
- Blocked-user redirect flow

## Interview Demo Mode

To make interviewer walkthroughs frictionless, role-based restriction for the admin dashboard is currently disabled on the frontend route guard.

Why this change was made:
- In normal mode, only users with `role: "admin"` can access `/log-page`.
- During interviews, accounts are usually created on the spot and default to regular users.
- Enabling dashboard access for authenticated users ensures all features can be reviewed without manual DB edits.

Implementation note:
- The original admin-only route checks are **kept in code but commented out** for easy re-enable.
- See:
  - `Front-end/src/components/ProtectedRoute.js`
  - `Front-end/src/App.js`

To restore strict admin access later:
1. Re-enable the commented role check in `ProtectedRoute.js`.
2. Re-enable `requiredRole=\"admin\"` on the `/log-page` route in `App.js`.

## Notes

- `Back-end/.env` is intentionally ignored by git.
- `Back-end/.env.example` is committed as setup template.
- A non-blocking source map warning from `@tensorflow-models/coco-ssd` may appear during frontend build.

## License

This project is for educational and portfolio use.
