# Ledger — MERN + Next.js LMS

A full-featured Learning Management System scaffold: users, courses, orders,
notifications, and an admin dashboard. Built with Next.js 13 (App Router) +
TypeScript on the frontend, and Express + TypeScript + MongoDB + Redis +
Cloudinary on the backend.

## Structure

```
mern-lms/
├── backend/     Express API (TypeScript, MongoDB, Redis, Cloudinary, cron)
└── frontend/    Next.js 13 App Router + TypeScript + Tailwind + Redux Toolkit
```

## Backend setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in your own values
npm run dev             # http://localhost:8000
```

You'll need:
- A MongoDB connection string (`DB_URL`) — local or MongoDB Atlas
- A Redis instance (`REDIS_URL`) — local, or a free tier from Upstash/Redis Cloud
- A Cloudinary account (free tier is fine) for image uploads
- An SMTP account (e.g. a Gmail app password) for activation/order emails

Every route the backend exposes lives under `/api/v1`, for example:
`POST /api/v1/registration`, `GET /api/v1/get-courses`, `POST /api/v1/create-order`, etc.

### What's implemented
- User auth: registration + email activation codes, login/logout, access +
  refresh token rotation, protected-route middleware, role-based authorization
- Courses: create/edit (admin), public listing (locked content stripped for
  non-purchasers), full content access for buyers, nested Q&A threads, reviews
  with live rating averages
- Orders: purchase flow, order-confirmation emails, purchase-count tracking
- Notifications: admin inbox, status updates, and a daily cron job that
  deletes read notifications older than 30 days
- Layout: banner / FAQ / categories management for a homepage CMS
- Analytics: last-12-months signup/order/course counts for dashboard charts

## Frontend setup

```bash
cd frontend
npm install
cp .env.local.example .env.local   # points at your backend URL
npm run dev             # http://localhost:3000
```

### What's implemented
- Pages: home, course catalog, course detail, login, register (with
  activation-code step), profile, and an admin section (overview, courses,
  users, orders — the latter two are stubbed with wiring notes)
- Redux Toolkit + RTK Query wired to the backend's `/api/v1` routes for auth
  and courses
- A distinct visual identity ("Ledger" — deep indigo + gold, Fraunces/Inter/
  JetBrains Mono) instead of default Tailwind styling, including a signature
  "spine tab" level indicator on course cards

### What's left as a skeleton (by design, given the scope)
- Course creation/edit forms in the admin dashboard (the API is ready; the
  form UI isn't built)
- Wiring the admin overview cards and users/orders tables to their analytics
  and list endpoints
- Payment integration (Stripe/PayPal) inside `create-order`
- Video player + Q&A UI on the course-content page (the protected
  `get-course-content` endpoint is ready to consume)
- Social auth UI (Google/GitHub) — the `social-auth` endpoint exists;
  no OAuth provider buttons are wired up yet

## Notes
- The frontend build requires network access to Google Fonts
  (`fonts.googleapis.com`) at build time — this is normal for `next/font`
  and will work in any standard dev/deploy environment.
- This code was written fresh based on the feature list you described from
  the tutorial's chapter breakdown — it is not extracted or copied from any
  paid repository.
