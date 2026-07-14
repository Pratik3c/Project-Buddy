import { Router } from "express";
import { z } from "zod";
import { User } from "../models/User.js";
import { Appointment } from "../models/Appointment.js";
import { Payment } from "../models/Payment.js";
import { Review } from "../models/Review.js";
import { Notification } from "../models/Notification.js";
import { Message } from "../models/Message.js";
import { Settings } from "../models/Settings.js";
import { QR } from "../models/QR.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { sendMail, meetingScheduledTemplate } from "../utils/mailer.js";

const router = Router();
router.use(requireAuth, requireAdmin);

router.get("/stats", async (_req, res, next) => {
  try {
    const [students, appointments, pending, payments, reviews, verifiedPayments] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "pending" }),
      Payment.countDocuments(),
      Review.countDocuments(),
      Payment.find({ status: "verified" }).select("amount").lean(),
    ]);
    const revenue = verifiedPayments.reduce((a, p) => a + (p.amount ?? 0), 0);
    res.json({ stats: { students, appointments, pending, payments, reviews, revenue } });
  } catch (e) { next(e); }
});

// Students
router.get("/students", async (req, res, next) => {
  try {
    const q = String(req.query.q ?? "").trim();
    const filter: Record<string, unknown> = { role: "student" };
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ name: rx }, { email: rx }, { college: rx }, { branch: rx }];
    }
    const students = await User.find(filter).sort("-createdAt").limit(200).lean();
    res.json({ students });
  } catch (e) { next(e); }
});
router.delete("/students/:id", async (req, res, next) => {
  try { await User.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (e) { next(e); }
});

// Appointments
router.get("/appointments", async (req, res, next) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    const appointments = await Appointment.find(filter).populate("student", "name email college").sort("-createdAt").limit(500).lean();
    res.json({ appointments });
  } catch (e) { next(e); }
});
router.patch("/appointments/:id/status", async (req, res, next) => {
  try {
    const { status } = z.object({ status: z.enum(["pending", "approved", "rejected", "completed"]) }).parse(req.body);
    const appt = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate("student", "name email");
    if (appt?.student) {
      const stu = appt.student as { name?: string; email?: string };
      await Notification.create({ student: (appt.student as { _id: string })._id, title: `Appointment ${status}`, message: `Your appointment "${appt.title}" is now ${status}.` });
      if (stu.email) await sendMail({ to: stu.email, subject: `Your appointment is now ${status}`, html: `<p>Hi ${stu.name},</p><p>Your appointment <b>${appt.title}</b> is now <b>${status}</b>.</p>` }).catch(() => {});
    }
    res.json({ appointment: appt });
  } catch (e) { next(e); }
});
router.patch("/appointments/:id/schedule", async (req, res, next) => {
  try {
    const data = z.object({
      meetingDate: z.string(),
      meetingTime: z.string(),
      meetingLink: z.string().url(),
      meetingNotes: z.string().optional(),
    }).parse(req.body);
    const appt = await Appointment.findByIdAndUpdate(req.params.id, { ...data, status: "approved" }, { new: true }).populate("student", "name email");
    if (appt?.student) {
      const stu = appt.student as { _id: string; name?: string; email?: string };
      await Notification.create({ student: stu._id, title: "Meeting scheduled", message: `Meeting for "${appt.title}" on ${data.meetingDate} at ${data.meetingTime}.` });
      if (stu.email) {
        const t = meetingScheduledTemplate({ studentName: stu.name ?? "Student", date: data.meetingDate, time: data.meetingTime, link: data.meetingLink, notes: data.meetingNotes });
        await sendMail({ to: stu.email, ...t }).catch(() => {});
      }
    }
    res.json({ appointment: appt });
  } catch (e) { next(e); }
});
router.patch("/appointments/:id/stage", async (req, res, next) => {
  try {
    const { stage } = z.object({ stage: z.enum(["requirements", "development", "documentation", "testing", "completed"]) }).parse(req.body);
    const appt = await Appointment.findByIdAndUpdate(req.params.id, { stage }, { new: true });
    res.json({ appointment: appt });
  } catch (e) { next(e); }
});

// Payments
router.get("/payments", async (req, res, next) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    const payments = await Payment.find(filter).populate("student", "name email").sort("-createdAt").limit(500).lean();
    res.json({ payments });
  } catch (e) { next(e); }
});
router.patch("/payments/:id/status", async (req, res, next) => {
  try {
    const { status } = z.object({ status: z.enum(["pending", "verified", "rejected"]) }).parse(req.body);
    const payment = await Payment.findByIdAndUpdate(req.params.id, { status, verifiedBy: req.user!.id }, { new: true }).populate("student", "name email");
    if (payment?.student) {
      const stu = payment.student as { _id: string; email?: string };
      await Notification.create({ student: stu._id, title: `Payment ${status}`, message: `Your payment of ₹${payment.amount} is now ${status}.` });
      if (stu.email) await sendMail({ to: stu.email, subject: `Payment ${status}`, html: `<p>Your payment of ₹${payment.amount} is now <b>${status}</b>.</p>` }).catch(() => {});
    }
    res.json({ payment });
  } catch (e) { next(e); }
});

// Reviews
router.get("/reviews", async (_req, res, next) => {
  try {
    const reviews = await Review.find().populate("student", "name college").sort("-createdAt").lean();
    res.json({ reviews });
  } catch (e) { next(e); }
});
router.patch("/reviews/:id", async (req, res, next) => {
  try {
    const { approved } = z.object({ approved: z.boolean() }).parse(req.body);
    const review = await Review.findByIdAndUpdate(req.params.id, { approved }, { new: true });
    res.json({ review });
  } catch (e) { next(e); }
});
router.delete("/reviews/:id", async (req, res, next) => {
  try { await Review.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (e) { next(e); }
});

// Messages
router.get("/messages", async (_req, res, next) => {
  try { const messages = await Message.find().sort("-createdAt").limit(500).lean(); res.json({ messages }); } catch (e) { next(e); }
});

// Settings
router.patch("/settings", async (req, res, next) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ settings });
  } catch (e) { next(e); }
});
router.post("/settings/qr", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file" });
    const qr = await QR.findOneAndUpdate({}, { image: `/uploads/${req.file.filename}` }, { new: true, upsert: true });
    res.json({ qr });
  } catch (e) { next(e); }
});

export default router;