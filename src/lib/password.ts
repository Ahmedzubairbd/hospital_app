import bcrypt from "bcrypt";

/** Hash a password with consistent cost across the app. */
export async function hashPassword(
  plain: string,
  rounds = 12,
): Promise<string> {
  return bcrypt.hash(plain, rounds);
}

/** Verify a plain password against a stored hash. */
export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
