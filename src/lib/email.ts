import nodemailer from "nodemailer";

const host = process.env.EMAIL_HOST || "smtp.gmail.com";
const port = Number(process.env.EMAIL_PORT || 587);
const secure =
  String(process.env.EMAIL_SECURE || "false").toLowerCase() === "true" ||
  port === 465;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const fromName = process.env.EMAIL_FROM_NAME || "Amin Diagnostics";

if (!user || !pass) {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn("[email] Missing EMAIL_USER/EMAIL_PASS – emails will fail.");
  }
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass },
});

export async function sendEmail(to: string, subject: string, html: string) {
  const from = `${fromName} <${user}>`;
  const info = await transporter.sendMail({ from, to, subject, html });
  return { messageId: info.messageId, accepted: info.accepted };
}
