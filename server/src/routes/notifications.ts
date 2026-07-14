import { Router } from "express";
import { Notification } from "../models/Notification.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const notifications = await Notification.find({ student: req.user!.id }).sort("-createdAt").lean();
    res.json({ notifications });
  } catch (e) { next(e); }
});

router.post("/read-all", async (req, res, next) => {
  try {
    await Notification.updateMany({ student: req.user!.id, read: false }, { read: true });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;