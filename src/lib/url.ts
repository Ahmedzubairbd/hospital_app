/** Create absolute URLs using NEXT_PUBLIC_APP_URL as base in non-request contexts. */
export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return base.replace(/\/$/, "") + (path.startsWith("/") ? path : `/${path}`);
}
