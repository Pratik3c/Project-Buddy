# Project Buddy

**Your Academic Project Partner** — a premium full-stack platform where college students can request project mentoring, assignment help, documentation, PPTs, viva prep and more.

- **Frontend**: React 19 + TypeScript + Tailwind v4 + TanStack Router (Lovable preview)
- **Backend**: Node.js + Express + TypeScript + Mongoose (in `/server`)
- **Database**: MongoDB (bring your own connection string)

> The Lovable preview runs the frontend. To get the full app working end-to-end you run the Express backend locally and point `VITE_API_URL` at it.

---

## Folder structure

```
/                       Frontend (this repo)
  src/routes/           All pages (TanStack file-based routing)
  src/components/       UI, site, dashboard, auth components
  src/lib/              api client, auth, theme
  .env.example          Frontend env (VITE_API_URL)
/server                 Standalone Express + Mongo backend
  src/models/           Mongoose schemas
  src/routes/           REST endpoints
  src/middleware/       auth, error, upload
  src/utils/            jwt, hash, mailer
  src/scripts/seed.ts   Seeds admin, demo students, appointments, reviews
  .env.example          Backend env
/database               ER diagram + schema notes
```

---

## Prerequisites

- Node.js 20+
- npm or bun
- A MongoDB database (local or MongoDB Atlas free tier)

### Create a MongoDB database

1. Sign up at https://www.mongodb.com/atlas
2. Create a free M0 cluster
3. Click **Connect → Drivers**, choose **Node.js**, copy the connection string
4. Whitelist your IP (or `0.0.0.0/0` while developing)
5. Replace `<password>` with your DB user password

Collections are created automatically by Mongoose on first write — no manual setup needed.

---

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run seed        # creates admin + demo data
npm run dev         # starts on http://localhost:5000
```

Health check: <http://localhost:5000/api/health>

### 2. Frontend

```bash
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
bun install         # or npm install
bun run dev         # starts on http://localhost:8080
```

Log in with the admin credentials from your `server/.env` — you'll land in the admin panel at `/admin`.

---

## Required environment variables

### Frontend (`.env`)

| Key | Purpose |
|-----|---------|
| `VITE_API_URL` | Base URL of the Express API (e.g. `http://localhost:5000/api`) |

### Backend (`server/.env`)

| Key | Required | Purpose |
|-----|----------|---------|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | JWT signing secret (32+ chars) |
| `PORT` | | Defaults to 5000 |
| `CLIENT_URL` | | Frontend origin for CORS |
| `EMAIL_USER` / `EMAIL_PASS` | | SMTP creds (leave blank to log emails to console) |
| `EMAIL_FROM` | | e.g. `"Project Buddy <no-reply@…>"` |
| `SMTP_HOST` / `SMTP_PORT` | | Defaults to Gmail SMTP 465 |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | | Used by seed script |

---

## API reference

All under `/api`.

### Auth (`/auth`)
- `POST /signup` — create account
- `POST /login` — email + password → JWT
- `POST /forgot-password` — placeholder
- `GET  /me` *(auth)* — current user

### Users (`/users`) *(auth)*
- `PATCH /me` — update profile
- `GET   /stats` — dashboard counters

### Appointments (`/appointments`) *(auth)*
- `GET  /mine` — student's appointments
- `GET  /orders` — student's active/completed orders
- `POST /` — book consultation

### Payments (`/payments`) *(auth)*
- `GET  /mine`
- `POST /` — multipart (`screenshot`, `amount`, `transactionId`)

### Reviews (`/reviews`) *(auth for reads)*
- `GET  /` — approved reviews
- `GET  /mine`
- `POST /` — submit review

### Notifications (`/notifications`) *(auth)*
- `GET  /`
- `POST /read-all`

### Contact (`/contact`)
- `POST /` — public contact form

### Settings (`/settings`)
- `GET  /` — hero text, pricing, socials, QR (public)
- `GET  /qr` — current payment QR

### Admin (`/admin`) *(admin only)*
- `GET    /stats`
- `GET    /students?q=…` · `DELETE /students/:id`
- `GET    /appointments?status=…`
- `PATCH  /appointments/:id/status` — approve/reject/complete/reschedule (sends email + notification)
- `PATCH  /appointments/:id/schedule` — set date/time/link/notes (sends "Consultation Scheduled" email)
- `PATCH  /appointments/:id/stage` — update project stage
- `GET    /payments?status=…` · `PATCH /payments/:id/status`
- `GET    /reviews` · `PATCH /reviews/:id` · `DELETE /reviews/:id`
- `GET    /messages`
- `PATCH  /settings` · `POST /settings/qr` (multipart `image`)

---

## Security

- `helmet` HTTP headers
- `cors` locked to `CLIENT_URL`
- Global `express-rate-limit` (200 req/min per IP)
- `express-mongo-sanitize` + `hpp`
- Zod input validation on every write
- Passwords hashed with `bcryptjs` (cost 12)
- JWT auth with 7-day expiry
- File uploads limited to 5MB images only

---

## How to deploy

- **Frontend**: Vercel, Netlify, or Cloudflare Pages. Set `VITE_API_URL` to your production API.
- **Backend**: Render, Railway, Fly.io, or a VPS. Set all `server/.env` vars. Ensure `CLIENT_URL` matches your frontend origin.
- **File uploads**: This project stores uploads on local disk (`server/uploads`). For production, swap in S3 or Cloudinary — see `server/src/middleware/upload.ts`.

---

## Common errors

| Error | Fix |
|-------|-----|
| `Missing required env var: MONGODB_URI` | Copy `server/.env.example` → `server/.env` and fill it in |
| CORS blocked from browser | Set `CLIENT_URL` in `server/.env` to your frontend origin |
| `401 Unauthorized` on `/api/auth/me` | Token expired — log out and back in |
| `MongoServerError: bad auth` | Wrong password in `MONGODB_URI` |
| Screenshots don't load in admin | The frontend derives URLs from `VITE_API_URL`. Make sure it points to the same host that serves `/uploads` |

---

## Notes on the Lovable preview

The Lovable preview only runs the frontend. API calls will fail with a friendly error until you run `/server` locally. Once the backend is running and reachable, the full app works end-to-end.

Enjoy — and go ship those projects! 🚀