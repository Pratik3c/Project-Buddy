# Database

Project Buddy uses MongoDB via Mongoose. All schemas live in
`server/src/models/`. Collections are created on first write — no manual
setup required. Connect with any `MONGODB_URI` (local or Atlas).

## Entities

```text
User ────< Appointment ────< Payment
   │              │
   │              └──── Notification
   │
   └──< Review

Settings (singleton)  QR (singleton)  Message (contact-form inbox)
```

## Collections

| Collection | Purpose |
|------------|---------|
| `users` | Students + admin. `role: "student" \| "admin"` |
| `appointments` | Consultation requests, meeting details, project stage |
| `payments` | Manual QR payments with screenshot + transaction ID |
| `reviews` | Student reviews, approved by admin |
| `notifications` | Per-student in-app notifications |
| `messages` | Public contact-form submissions |
| `settings` | Hero text, pricing, socials, admin email (singleton) |
| `qrs` | Current payment QR (singleton) |

See `server/src/models/*.ts` for full field lists, indexes, and validators.

## Seeding

```bash
cd server
npm run seed
```

Creates one admin (from `ADMIN_EMAIL` / `ADMIN_PASSWORD`), 5 demo students,
5 demo appointments across statuses, and 6 demo reviews.

Default demo student password: `Password123!`.