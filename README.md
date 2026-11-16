# TaskMatrix — Sprint 16 (Track A + Track B)

A full-stack task manager starter with:
- React + Vite responsive frontend
- Express + MongoDB backend
- JWT authentication and protected task CRUD
- Gemini AI task-subtask suggestions (server-side API key only)
- Zod request validation, centralized errors, Helmet, and rate limits
- Toast feedback, loading states, empty states, and mobile navigation
- Razorpay order creation and payment verification scaffolding

## Requirements
- Node.js 18+ (Node 20 LTS recommended)
- MongoDB local instance or MongoDB Atlas
- Gemini API key for AI suggestions (optional)
- Razorpay test keys for payment flow (optional)

## 1. Configure the backend

```bash
cd backend
copy .env.example .env
```

On macOS/Linux use `cp .env.example .env`.

Edit `backend/.env`:
- `MONGODB_URI`
- `JWT_SECRET` (use a long random value)
- `GEMINI_API_KEY` (optional until using AI)
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (optional until using payments)
- `CLIENT_URL`

Install and run:

```bash
npm install
npm run dev
```

Backend runs at `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

## 2. Configure the frontend

Open a second terminal:

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## 3. Test the application
1. Register a new account.
2. Log in.
3. Create, edit, complete, and delete tasks.
4. Open a task and use **Generate subtasks**. This requires a valid `GEMINI_API_KEY`.
5. Use the Pricing page to test Razorpay only after adding test credentials and configuring the Razorpay test account.

## API overview

| Method | Endpoint | Auth | Purpose |
|---|---|---:|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/tasks` | Yes | List own tasks |
| POST | `/api/tasks` | Yes | Create task |
| GET | `/api/tasks/:id` | Yes | Get own task |
| PATCH | `/api/tasks/:id` | Yes | Update own task |
| DELETE | `/api/tasks/:id` | Yes | Delete own task |
| POST | `/api/ai/suggest` | Yes | Generate task subtasks |
| POST | `/api/payments/create-order` | Yes | Create Razorpay order |
| POST | `/api/payments/verify` | Yes | Verify payment signature |

## Security notes
- Never put Gemini or Razorpay secret keys in `frontend/.env`.
- Only `VITE_API_URL` belongs in the frontend environment.
- Use HTTPS and strong secrets in production.
- Razorpay verification is performed on the server. This starter does not automatically grant premium access; connect the verified payment to your own subscription entitlement/business rules before using real payments.
- Add email verification, password reset, audit logging, and automated tests before production use.

## Deployment outline
- Backend: deploy `backend` to Render/Railway/Fly.io; configure all backend environment variables in the provider dashboard.
- Frontend: deploy `frontend` to Vercel/Netlify; set `VITE_API_URL` to the deployed backend URL ending in `/api`.
- Set backend `CLIENT_URL` to the deployed frontend origin.
- Use MongoDB Atlas and Razorpay live keys only after full testing.

## Project structure

```text
TaskMatrix-Sprint16/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       └── validators/
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── services/
│       └── styles/
├── Prompts.md
└── README.md
```

This is a fresh Sprint 16 implementation, not a patch merged into your previous Sprint 15 repository. Review the environment values and run both apps locally before deployment.
