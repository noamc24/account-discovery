
---
# 🚀 Account Discovery

Account Discovery is a full-stack web application that identifies online services a user is registered to by analyzing Gmail data (with user permission).

---

## 🎯 Overview

The app connects to a user's Gmail account, scans emails, and detects services using pattern-based analysis such as welcome emails, receipts, and verification messages.

---

## 📁 Project Structure
account-discover/
├── front/ # React frontend
│ ├── src/
│ │ ├── api/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── types/
│ │ ├── utils/
│ │ ├── App.tsx
│ │ └── main.tsx
│ └── public/
│
├── back/ # Node.js backend
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── routes/
│ │ ├── services/
│ │ ├── types/
│ │ ├── app.ts
│ │ └── server.ts
│ ├── .env
│ └── .env.example
├── .gitignore
└── README.md

---

## 🧱 Tech Stack

**Frontend**

* React
* TypeScript
* Vite
* React Router

**Backend**

* Node.js
* Express
* TypeScript
* JWT Authentication
* express-session
* Google APIs (Gmail API)

---

## 🔐 Authentication

* JWT is used for user authentication
* Gmail OAuth tokens are stored in server-side sessions

---

## 🔗 Gmail Integration

Flow:

1. User clicks "Connect Gmail"
2. Redirect to Google OAuth
3. User grants permission
4. Backend receives authorization code
5. Code is exchanged for access tokens
6. Tokens are stored in session
7. App can access Gmail messages

---

## 📡 API Endpoints

* GET /api/gmail/connect
* GET /api/gmail/callback
* GET /api/gmail/messages
* GET /api/gmail/scan?mode=quick|deep|full

---

## 🧠 Scan Engine

The system analyzes:

* Sender domain
* Email subject
* Message snippet

Detects patterns such as:

* Welcome emails → account creation
* Verification emails → account confirmation
* Receipts / invoices → purchases
* Unsubscribe links → newsletters

---

## ⚡ Scan Modes

* **Quick** – fast, limited scan (~150 emails)
* **Deep** – broader scan (~1 year, ~400 emails)
* **Full** – scans entire mailbox (slower, most accurate)

---

## ⚙️ Key Features

* Gmail OAuth integration
* Multi-mode scanning
* Pattern-based service detection
* Rate-limit handling
* Batched requests and pagination

---

## ▶️ Running the Project

### 1. Clone the repository

git clone <your-repo-url>
cd account-discover

---

### 2. Setup Backend

Create a `.env` file based on `.env.example`:

Open a new terminal:
run:

cd back
npm install
npm run dev

---

### 3. Setup Frontend

Open a new terminal:
run:

cd front
npm install
npm run dev

---

### 4. Open the App

Frontend should run on:
http://localhost:5173

Backend should run on:
http://localhost:5000

---

## ⚠️ Notes

* Gmail access requires adding your account as a test user in Google Cloud
* Full scan may take time depending on mailbox size
* API rate limits are handled but still apply

---

## 👨‍💻 About the Developer

Noam Cohen
Computer Science Student at he College of Management in Rhishon LeZion
