import { Router } from "express";
import { z } from "zod";
import { Appointment } from "../models/Appointment.js";
import { requireAuth } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Settings } from "../models/Settings.js";
import { Notification } from "../models/Notification.js";
import { sendMail } from "../utils/mailer.js";
import { env } from "../config/env.js";

const router = Router();
router.use(requireAuth);

router.get("/mine", async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ student: req.user!.id }).sort("-createdAt").lean();
    res.json({ appointments });
  } catch (e) { next(e); }
});

router.get("/orders", async (req, res, next) => {
  try {
    const orders = await Appointment.find({ student: req.user!.id, status: { $in: ["approved", "completed"] } })
      .sort("-updatedAt").lean();
    res.json({ orders });
  } catch (e) { next(e); }
});

router.post("/", async (req, res, next) => {
  try {
    const data = z.object({
      title: z.string().trim().min(2).max(200),
      category: z.enum(["assignment", "major"]),
      technology: z.string().trim().max(150).optional(),
      description: z.string().trim().max(3000).optional(),
      preferredDate: z.string().optional(),
      preferredTime: z.string().optional(),
      budget: z.string().optional(),
    }).parse(req.body);
    const appt = await Appointment.create({ ...data, student: req.user!.id });
    const student = await User.findById(req.user!.id).lean();
    const settings = await Settings.findOne().lean();
    const adminTo = settings?.adminEmail || env.ADMIN_EMAIL;
    if (student?.email) {
      sendMail({
        to: student.email,
        subject: "Consultation request received",
        html: `<p>Hi ${student.name},</p><p>We received your consultation request for <b>${appt.title}</b>. We'll review and confirm within 24 hours.</p>`,
      }).catch(() => {});
    }
    if (adminTo) {
      sendMail({
        to: adminTo,
        subject: `New appointment: ${appt.title}`,
        html: `<p><b>${student?.name}</b> (${student?.email}) requested a consultation.</p><p><b>Title:</b> ${appt.title}<br/><b>Category:</b> ${appt.category}<br/><b>Tech:</b> ${data.technology ?? "-"}<br/><b>Preferred:</b> ${data.preferredDate ?? "-"} ${data.preferredTime ?? ""}</p><p>${(data.description ?? "").replace(/\n/g, "<br/>")}</p>`,
      }).catch(() => {});
    }
    if (student?._id) {
      await Notification.create({
        student: student._id,
        title: "Consultation requested",
        message: `We received your request for "${appt.title}". You'll hear back within 24 hours.`,
      });
    }
    res.status(201).json({ appointment: appt });
  } catch (e) { next(e); }
});

export default router;