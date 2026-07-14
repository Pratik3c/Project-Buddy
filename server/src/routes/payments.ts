import { Router } from "express";
import { z } from "zod";
import { Payment } from "../models/Payment.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { User } from "../models/User.js";
import { Settings } from "../models/Settings.js";
import { sendMail } from "../utils/mailer.js";
import { env } from "../config/env.js";

const router = Router();
router.use(requireAuth);

router.get("/mine", async (req, res, next) => {
  try {
    const payments = await Payment.find({ student: req.user!.id }).sort("-createdAt").lean();
    res.json({ payments });
  } catch (e) { next(e); }
});

router.post("/", upload.single("screenshot"), async (req, res, next) => {
  try {
    const data = z.object({
      amount: z.coerce.number().min(1),
      transactionId: z.string().trim().min(3).max(120),
      appointment: z.string().optional(),
    }).parse(req.body);
    const screenshot = req.file ? `/uploads/${req.file.filename}` : undefined;
    const payment = await Payment.create({
      ...data,
      student: req.user!.id,
      screenshot,
    });
    const student = await User.findById(req.user!.id).lean();
    const settings = await Settings.findOne().lean();
    const adminTo = settings?.adminEmail || env.ADMIN_EMAIL;
    if (student?.email) {
      sendMail({
        to: student.email,
        subject: "Payment received — pending verification",
        html: `<p>Hi ${student.name},</p><p>We received your payment of <b>₹${payment.amount}</b> (Txn: ${payment.transactionId}). Our team will verify it shortly.</p>`,
      }).catch(() => {});
    }
    if (adminTo) {
      sendMail({
        to: adminTo,
        subject: `New payment: ₹${payment.amount} from ${student?.name ?? "student"}`,
        html: `<p><b>${student?.name}</b> (${student?.email}) submitted a payment.</p><p>Amount: <b>₹${payment.amount}</b><br/>Txn ID: ${payment.transactionId}</p>${screenshot ? `<p>Screenshot: ${env.CLIENT_URL.replace(/\/$/, "")}${screenshot} (served by API at /uploads)</p>` : ""}`,
      }).catch(() => {});
    }
    res.status(201).json({ payment });
  } catch (e) { next(e); }
});

export default router;