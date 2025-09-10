type Bucket = { tokens: number; last: number };

const globalAny = globalThis as any;
if (!globalAny.__rateBuckets) globalAny.__rateBuckets = new Map<string, Bucket>();
const buckets: Map<string, Bucket> = globalAny.__rateBuckets;

export type RateLimitOptions = {
  capacity: number; // max tokens in bucket
  refillPerSec: number; // tokens added per second
};

const DEFAULTS: RateLimitOptions = { capacity: 10, refillPerSec: 5 };

function keyFrom(req: Request, scope: string, extra?: string) {
  const ipHeader = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  const ip = ipHeader.split(",")[0].trim() || "unknown";
  return `${scope}:${ip}${extra ? ":" + extra : ""}`;
}

export function takeToken(key: string, opts: RateLimitOptions = DEFAULTS) {
  const now = Date.now();
  const b = buckets.get(key) || { tokens: opts.capacity, last: now };
  // refill
  const elapsed = (now - b.last) / 1000;
  b.tokens = Math.min(opts.capacity, b.tokens + elapsed * opts.refillPerSec);
  b.last = now;
  if (b.tokens >= 1) {
    b.tokens -= 1;
    buckets.set(key, b);
    return true;
  }
  buckets.set(key, b);
  return false;
}

export function rateLimit(req: Request, scope: string, extra?: string, opts?: RateLimitOptions) {
  const key = keyFrom(req, scope, extra);
  return takeToken(key, opts);
}

// Upstash Redis-backed fixed window limiter (fallbacks to in-memory on error)
export async function rateLimitAsync(
  req: Request,
  scope: string,
  extra?: string,
  redisOpts?: { limit?: number; windowSec?: number },
) {
  const key = keyFrom(req, scope, extra);
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const limit = redisOpts?.limit ?? 30;
  const windowSec = redisOpts?.windowSec ?? 60;
  if (!url || !token) {
    return rateLimit(req, scope, extra);
  }
  try {
    const incr = await fetch(`${url}/incr/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json() as Promise<{ result: number }>);
    if (incr.result === 1) {
      await fetch(`${url}/expire/${encodeURIComponent(key)}/${windowSec}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => undefined);
    }
    return incr.result <= limit;
  } catch {
    return rateLimit(req, scope, extra);
  }
}
