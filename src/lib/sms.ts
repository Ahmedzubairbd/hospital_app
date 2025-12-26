/** Sonali SMS helper (simple). For production, ensure your sender ID & route are approved. */

type ProviderResponse = { ok: boolean; status: number; body: string };

const ENDPOINT_SEND = process.env.SONALI_SMS_ENDPOINT_SEND || "";
const API_KEY = process.env.SONALI_SMS_API_KEY || "";
const SECRET_KEY = process.env.SONALI_SMS_SECRET_KEY || "";
const SENDER_ID = process.env.SONALI_SMS_SENDER_ID || "";

export function normalizePhoneBD(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("880")) return digits; // already MSISDN
  if (digits.startsWith("0")) return `88${digits}`; // 0XXXXXXXXX -> 88XXXXXXXXXX
  if (digits.startsWith("1")) return `880${digits}`; // 1XXXXXXXXX -> 8801XXXXXXXX
  return digits.length >= 11 ? digits : input; // fallback
}

export async function sendSms(
  to: string,
  text: string,
): Promise<ProviderResponse> {
  if (!ENDPOINT_SEND || !API_KEY || !SECRET_KEY || !SENDER_ID) {
    return { ok: false, status: 0, body: "Missing SONALI SMS envs" };
  }
  const msisdn = normalizePhoneBD(to);

  // Common parameter set used by many local gateways
  const params = new URLSearchParams({
    api_key: API_KEY,
    secret_key: SECRET_KEY,
    sender_id: SENDER_ID,
    msisdn, // try `msisdn` first
    message: text,
  });

  const url = `${ENDPOINT_SEND}?${params.toString()}`;
  const res = await fetch(url);
  const body = await res.text();
  // Typical success: {"Status":"200","Text":"ACCEPTD","Message_ID":"..."}
  const ok =
    res.status === 200 && /"Status"\s*:\s*"20[01]"|ACCEPTD/i.test(body);
  return { ok, status: res.status, body };
}
