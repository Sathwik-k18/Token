# Token Wallet AI Platform (Gemini)

A local full-stack chatbot with token wallet accounting.

## Folder structure

```text
backend/
  database/                # SQLite file storage (must exist)
  src/
    db/                    # DB bootstrap + schema
    routes/                # Express route modules
    services/              # Gemini + token accounting services
    index.js               # API server entry
frontend/
  app/                     # Next.js app routes
  components/              # UI components by feature
  services/                # API client wrappers
```

## 1) Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

## 2) Environment setup

Create `backend/.env`:

```env
PORT=4000
GEMINI_API_KEY=your_real_key_here
GEMINI_MODEL=gemini-1.5-flash
DAILY_ALLOWANCE=50000
MAX_WALLET_CAP=0
DISABLE_BALANCE_CHECK=true
FRONTEND_ORIGIN=http://localhost:3000
```

Optional for frontend (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_BASE=http://localhost:4000/api
```

## 3) Run locally

```bash
# terminal 1
cd backend
npm run dev

# terminal 2
cd frontend
npm run dev
```

Backend should print `Backend running on 4000`.
Frontend should run at `http://localhost:3000`.

## 4) Exact files edited for Gemini migration

- `backend/package.json`
- `backend/.env.example`
- `backend/src/services/geminiService.js` (new)
- `backend/src/services/tokenService.js`
- `backend/src/routes/chatRoutes.js`
- `backend/src/index.js`
- `frontend/services/api/chatApi.ts`
- `frontend/components/chat/ChatWindow.tsx`

## 5) Troubleshooting

### ENOENT backend/package.json
Run install from repo root with explicit folders:

```bash
cd backend && npm install
```

### SQLite "directory does not exist"
Ensure this exists before starting backend:

```bash
mkdir -p backend/database
```

### Frontend "Unable to send message"
- Confirm backend is running on port 4000.
- Open `http://localhost:4000/api/health`.
- Verify `GEMINI_API_KEY` is present in `backend/.env`.
- Check browser console + backend logs.

### 402 insufficient balance
Temporarily bypassed using:

```env
DISABLE_BALANCE_CHECK=true
```

## 6) Common mistakes to avoid

- Using `OPENAI_API_KEY` instead of `GEMINI_API_KEY`.
- Forgetting to restart backend after `.env` changes.
- Missing `backend/database/` directory.
- Frontend pointing to wrong backend URL.
- Running `npm install` from the wrong directory.
