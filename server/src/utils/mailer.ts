import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const enabled = !!(env.EMAIL_USER && env.EMAIL_PASS);

const transporter = enabled
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
    })
  : null;

export async function sendMail(opts: { to: string; subject: string; html: string; text?: string }) {
  if (!transporter) {
    console.log(`[mailer:dev] To: ${opts.to} | Subject: ${opts.subject}`);
    return;
  }
  await transporter.sendMail({ from: env.EMAIL_FROM, ...opts });
}

export function meetingScheduledTemplate(opts: {
  studentName: string;
  date: string;
  time: string;
  link: string;
  notes?: string;
}) {
  const { studentName, date, time, link, notes } = opts;
  return {
    subject: "Your Consultation has been Scheduled",
    html: `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;background:#f5f5f7;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 8px 30px -8px rgba(20,20,50,.08)">
    <div style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#6d28d9;font-weight:600">Project Buddy</div>
    <h1 style="font-size:22px;margin:8px 0 4px">Your consultation is scheduled</h1>
    <p style="color:#555">Hi ${escape(studentName)},</p>
    <p style="color:#555">Great news — your Project Buddy consultation has been scheduled. Details below:</p>
    <div style="border:1px solid #eee;border-radius:12px;padding:16px;margin:18px 0">
      <div><strong>Date:</strong> ${escape(date)}</div>
      <div style="margin-top:6px"><strong>Time:</strong> ${escape(time)}</div>
      <div style="margin-top:6px"><strong>Meet link:</strong> <a href="${escape(link)}" style="color:#6d28d9">${escape(link)}</a></div>
      ${notes ? `<div style="margin-top:10px;color:#555"><strong>Notes:</strong><br/>${escape(notes)}</div>` : ""}
    </div>
    <p style="color:#555">Instructions:</p>
    <ul style="color:#555;padding-left:18px">
      <li>Join 2 minutes before the scheduled time.</li>
      <li>Have your project requirements ready.</li>
      <li>Any working code, docs or reference material helps a lot.</li>
    </ul>
    <p style="color:#555">See you then!<br/>— Project Buddy</p>
  </div>
</body></html>`,
    text: `Your Project Buddy consultation is scheduled for ${date} at ${time}.\nMeet link: ${link}\n${notes ? `Notes: ${notes}` : ""}`,
  };
}

function escape(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}