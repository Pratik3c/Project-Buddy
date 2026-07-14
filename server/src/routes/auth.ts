import { Router } from "express";
import { z } from "zod";
import { User } from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";
import { requireAuth } from "../middleware/auth.js";
import { HttpError } from "../middleware/error.js";
import { sendMail } from "../utils/mailer.js";
import { Settings } from "../models/Settings.js";
import { env } from "../config/env.js";

const router = Router();

const signupSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6).max(20),
  college: z.string().trim().min(2).max(150),
  branch: z.string().trim().min(2).max(100),
  year: z.string().trim().min(1).max(20),
  city: z.string().trim().min(2).max(100),
  password: z.string().min(6).max(200),
});

router.post("/signup", async (req, res, next) => {
  try {
    const data = signupSchema.parse(req.body);
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new HttpError(409, "Email already registered");
    const user = await User.create({ ...data, password: await hashPassword(data.password) });
    const token = signToken({ sub: String(user._id), role: user.role as "student" | "admin" });
    // Welcome email
    sendMail({
      to: user.email,
      subject: "Welcome to Project Buddy 🎓",
      html: `<div style="font-family:Inter,Arial,sans-serif;background:#f5f5f7;padding:24px"><div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px"><h1 style="margin:0 0 8px">Welcome, ${user.name}!</h1><p style="color:#555">Your Project Buddy account is ready. Book your free consultation any time from your dashboard.</p><p><a href="${env.CLIENT_URL}/dashboard" style="display:inline-block;background:#6d28d9;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none">Open dashboard</a></p><p style="color:#888;font-size:12px">— Project Buddy</p></div></div>`,
    }).catch(() => {});
    // Notify admin of new signup
    const settings = await Settings.findOne().lean();
    const adminTo = settings?.adminEmail || env.ADMIN_EMAIL;
    if (adminTo) {
      sendMail({
        to: adminTo,
        subject: `New student signup: ${user.name}`,
        html: `<p><b>${user.name}</b> (${user.email}) signed up.</p><p>College: ${user.college} — ${user.branch}, ${user.year}<br/>City: ${user.city} — Phone: ${user.phone}</p>`,
      }).catch(() => {});
    }
    res.json({ token, user: sanitize(user.toObject()) });
  } catch (e) { next(e); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body);
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) throw new HttpError(401, "Invalid credentials");
    const ok = await comparePassword(password, user.password);
    if (!ok) throw new HttpError(401, "Invalid credentials");
    const token = signToken({ sub: String(user._id), role: user.role as "student" | "admin" });
    res.json({ token, user: sanitize(user.toObject()) });
  } catch (e) { next(e); }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user!.id).lean();
    if (!user) throw new HttpError(404, "Not found");
    res.json({ user: sanitize(user) });
  } catch (e) { next(e); }
});

router.post("/forgot-password", async (req, res) => {
  // Placeholder: always respond OK to avoid email enumeration.
  res.json({ ok: true });
});

function sanitize(u: Record<string, unknown>) {
  const { password: _p, ...rest } = u as { password?: string };
  void _p;
  return rest;
}

export default router;