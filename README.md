# Token Wallet AI Platform

Personal AI chatbot platform with daily token rollover wallet, real-time usage tracking, and modular architecture.

## Architecture
- `frontend/`: Next.js dashboard/chat UI (ChatGPT-style)
- `backend/`: Express + Socket.IO + SQLite API server

## Quick start
1. Backend
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```
2. Frontend
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Core capabilities
- Daily allowance rollover into persistent wallet balance
- Preflight token estimation + insufficient balance protection
- Streaming chat responses + live token metrics
- Transaction logs + usage analytics endpoints
