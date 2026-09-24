-- Vicky's Lash Lab — initial schema for Supabase.
-- Run once in Supabase Dashboard -> SQL Editor (or `npm run db:push` with real
-- connection strings). Generated from prisma/schema.prisma.

-- CreateTable
CREATE TABLE IF NOT EXISTS "Booking" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "serviceId" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "idempotencyKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Booking_idempotencyKey_key" ON "Booking"("idempotencyKey");
CREATE INDEX IF NOT EXISTS "Booking_date_idx" ON "Booking"("date");

-- Client PII lives here. Supabase exposes the public schema over its REST API,
-- so lock it down: RLS on with no policies = anon/authenticated keys get
-- nothing. The app connects as the postgres role via Prisma, which bypasses RLS.
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "Booking" FROM anon, authenticated;
