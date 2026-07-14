import { Router } from "express";
import { z } from "zod";
import { User } from "../models/User.js";
import { Appointment } from "../models/Appointment.js";
import { Payment } from "../models/Payment.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.patch("/me", async (req, res, next) => {
  try {
    const data = z.object({
      name: z.string().trim().min(2).max(120).optional(),
      phone: z.string().trim().max(20).optional(),
      college: z.string().trim().max(150).optional(),
      branch: z.string().trim().max(100).optional(),
      year: z.string().trim().max(20).optional(),
      city: z.string().trim().max(100).optional(),
    }).parse(req.body);
    const user = await User.findByIdAndUpdate(req.user!.id, data, { new: true }).lean();
    res.json({ user });
  } catch (e) { next(e); }
});

router.get("/stats", async (req, res, next) => {
  try {
    const [appointments, pending, payments, orders] = await Promise.all([
      Appointment.countDocuments({ student: req.user!.id }),
      Appointment.countDocuments({ student: req.user!.id, status: "pending" }),
      Payment.countDocuments({ student: req.user!.id }),
      Appointment.countDocuments({ student: req.user!.id, status: { $in: ["approved", "completed"] } }),
    ]);
    res.json({ stats: { appointments, pending, payments, orders } });
  } catch (e) { next(e); }
});

export default router;