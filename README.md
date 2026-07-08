# Vicky's Lash Lab

Lashes & brows studio site with real-time online booking. Built with **Next.js 15**
(App Router), **Tailwind CSS v4**, and **Prisma + PostgreSQL** for booking storage.

The design amplifies the logo's energy — animated neon glow, gradient accents,
floating hero logo, and scroll-reveal sections on a dark base.

---

## 1. Add the logo

Save the logo image as **`public/logo.png`**. It powers the header, hero, footer,
browser tab, and social share preview. (You can delete `public/README-LOGO.txt`
once it's in place.)

## 2. Install

```bash
npm install
```

## 3. Connect a database

Bookings are stored in PostgreSQL. Any free provider works:

- **Vercel Postgres / Neon** — https://vercel.com/storage/postgres
- **Supabase** — https://supabase.com (use the "Connection string")

Copy the example env file and paste your connection string:

```bash
cp .env.example .env
# then edit .env and set DATABASE_URL="postgresql://..."
```

Create the `Booking` table:

```bash
npm run db:push
```

> Without a database the site still runs and previews end-to-end — the calendar
> shows every slot as open, and only the final "Confirm booking" step returns a
> "database isn't connected yet" message.

## 3b. (Optional) Admin dashboard + email confirmations

Set these in `.env` (all optional — the site works without them):

| Variable              | Purpose                                                    |
| --------------------- | ---------------------------------------------------------- |
| `ADMIN_PASSWORD`      | Unlocks **`/admin`**, where Vicky sees upcoming bookings.  |
| `RESEND_API_KEY`      | Enables email. Free key from https://resend.com.           |
| `BOOKING_FROM_EMAIL`  | "From" address, on a domain verified in Resend.            |
| `STUDIO_NOTIFY_EMAIL` | Inbox where Vicky is notified of each new booking.         |

- **Admin:** visit `/admin`, enter `ADMIN_PASSWORD`. Session lasts 14 days (httpOnly cookie). Until a password is set, the page shows a "not set up yet" note. The page is marked `noindex`.
- **Emails:** on each booking, the client gets a confirmation and Vicky gets a heads-up. Sent *after* the response so they never slow down or break a booking. If Resend isn't configured, sending is skipped silently.

## 4. Run

```bash
npm run dev        # http://localhost:3000
```

Other scripts:

| Command            | What it does                                   |
| ------------------ | ---------------------------------------------- |
| `npm run build`    | Production build (`prisma generate` + `next build`) |
| `npm start`        | Run the production build                       |
| `npm run db:push`  | Sync the Prisma schema to your database        |
| `npm run db:studio`| Visual browser for your bookings               |

---

## Editing the studio's details

Everything Vicky needs to change is marked with `EDIT` comments:

| What                         | Where                                    |
| ---------------------------- | ---------------------------------------- |
| Services, durations, prices  | `src/lib/schedule.ts` → `SERVICES`       |
| Open days & hours            | `src/lib/schedule.ts` → `HOURS`          |
| Slot spacing / booking window| `src/lib/schedule.ts` → `SLOT_STEP`, `DAYS_AHEAD` |
| Instagram URL                | `src/components/Header.tsx`, `Footer.tsx`|
| Phone, email, address, hours copy | `src/components/Footer.tsx`         |
| Gallery photos               | `src/components/Gallery.tsx`             |
| Colors / fonts / theme       | `src/app/globals.css`                    |

`HOURS` uses minutes-from-midnight in 24h (`600` = 10:00, `1080` = 18:00) and day
indexes `0`=Sun … `6`=Sat. Keep the footer hours copy in sync with it.

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at https://vercel.com/new.
3. Add a Postgres store (Storage tab) — it sets `DATABASE_URL` automatically —
   **or** paste your own `DATABASE_URL` under Settings → Environment Variables.
4. Deploy. The build runs `prisma generate` automatically. After the first deploy,
   run `npm run db:push` once (locally against the same `DATABASE_URL`, or via a
   one-off command) to create the table.

---

## Project structure

```
src/
  app/
    layout.tsx              fonts, metadata, favicon
    page.tsx                assembles the sections
    globals.css             neon design system
    api/
      availability/route.ts GET open days + times for a service
      bookings/route.ts     POST a new booking (re-validates the slot)
  components/               Header, Hero, Services, Gallery, Booking, Footer, Reveal
  lib/
    schedule.ts             services + hours config + scheduling engine
    db.ts                   Prisma client singleton
prisma/schema.prisma        Booking model
public/logo.png             ← your logo (add this)
legacy/index.html           the original single-file site (backup)
```

## Next steps (optional)

- **Email/SMS confirmations** — hook into the successful create in
  `src/app/api/bookings/route.ts` (e.g. Resend for email, Twilio for SMS).
- **Admin view** — a protected page listing upcoming bookings from the DB.
- **Real gallery** — swap the placeholder cells in `Gallery.tsx` for `next/image`.
