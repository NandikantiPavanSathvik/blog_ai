# 🚀 BlogAI — AI-Powered Blog Generator

A SaaS web application that helps businesses and content creators generate professional blog articles using AI.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **AI:** Google Gemini (free tier) + Custom AI Agent

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ installed
- [MongoDB](https://www.mongodb.com/try/download/community) running locally OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cluster
- A [Google Gemini API key](https://aistudio.google.com/apikey) (free)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
# In the server/ directory, edit .env with your values:
# - MONGODB_URI (your MongoDB connection string)
# - GEMINI_API_KEY (from Google AI Studio)
# - JWT_SECRET (any random long string)
```

### 3. Run the Application

Open two terminals:

```bash
# Terminal 1: Start the backend
cd server
npm run dev

# Terminal 2: Start the frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

## Project Structure

```
AI_BLOG/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page-level components
│   │   ├── services/     # API call functions
│   │   ├── context/      # React context (auth state)
│   │   └── utils/        # Helper functions
│   └── ...
├── server/          # Express.js backend
│   ├── config/      # Database & env setup
│   ├── controllers/ # Request handlers
│   ├── middleware/   # Auth, rate limiting
│   ├── models/      # MongoDB schemas
│   ├── routes/      # API endpoints
│   ├── services/    # AI agent, providers
│   └── server.js    # Entry point
└── README.md
```

## License

MIT
