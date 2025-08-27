// src/lib/auth.ts
import jwt, {
  JwtPayload as StdJwtPayload,
  Secret,
  SignOptions,
} from "jsonwebtoken";

// App-visible roles in lowercase (used in JWT and UI)
export type AppRole = "admin" | "moderator" | "doctor" | "patient";

export type AppJwtPayload = {
  sub: string; // user id
  role: AppRole;
  phone?: string;
};

// Force a definite string; warn in dev if missing.
const JWT_SECRET: string = process.env.JWT_SECRET ?? "";
if (!JWT_SECRET && process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line no-console
  console.warn("[auth] Missing JWT_SECRET – set it in .env/.env.local");
}

/**
 * Sign a JWT with a stable HS256 default (jsonwebtoken defaults to HS256 when using a string secret).
 * Using SignOptions['expiresIn'] satisfies the v9 types (StringValue | number).
 */
export function signJwt(
  payload: AppJwtPayload,
  expiresIn: SignOptions["expiresIn"] = "7d",
): string {
  if (!JWT_SECRET) throw new Error("JWT_SECRET not set");
  const options: SignOptions = { expiresIn }; // algorithm default is HS256 for string secret
  return jwt.sign(payload, JWT_SECRET as Secret, options);
}

export function verifyJwt(
  token: string,
): (AppJwtPayload & StdJwtPayload) | null {
  if (!JWT_SECRET) throw new Error("JWT_SECRET not set");
  try {
    return jwt.verify(token, JWT_SECRET as Secret) as AppJwtPayload &
      StdJwtPayload;
  } catch {
    return null;
  }
}

export function getRoleFromToken(cookieHeader?: string): AppRole | null {
  if (!cookieHeader) return null;
  const m = /(?:^|; )token=([^;]+)/.exec(cookieHeader);
  if (!m) return null;
  const payload = verifyJwt(decodeURIComponent(m[1]));
  return payload?.role ?? null;
}
