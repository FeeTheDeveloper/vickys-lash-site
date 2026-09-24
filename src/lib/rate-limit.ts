// Fixed-window, in-memory rate limiter. Best effort: on serverless each warm
// instance keeps its own counters, so pair it with platform-level protection
// (Vercel Firewall rate limiting / BotID) before promoting to production.

type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();

/** Returns true if the call is allowed, false once `limit` is hit within `windowMs`. */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const w = buckets.get(key);
  if (!w || w.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) prune(now);
    return true;
  }
  w.count += 1;
  return w.count <= limit;
}

function prune(now: number) {
  for (const [k, w] of buckets) if (w.resetAt <= now) buckets.delete(k);
}

/** Client IP from standard proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
