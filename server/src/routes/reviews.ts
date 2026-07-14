import { Router } from "express";
import { z } from "zod";
import { Review } from "../models/Review.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public but requires login to view (matches product requirement)
router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const reviews = await Review.find({ approved: true })
      .populate("student", "name college")
      .sort("-createdAt")
      .lean();
    res.json({ reviews });
  } catch (e) { next(e); }
});

router.get("/mine", requireAuth, async (req, res, next) => {
  try {
    const reviews = await Review.find({ student: req.user!.id }).sort("-createdAt").lean();
    res.json({ reviews });
  } catch (e) { next(e); }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const data = z.object({
      rating: z.coerce.number().int().min(1).max(5),
      comment: z.string().trim().min(5).max(2000),
      project: z.string().trim().max(200).optional(),
    }).parse(req.body);
    const review = await Review.create({ ...data, student: req.user!.id });
    res.status(201).json({ review });
  } catch (e) { next(e); }
});

export default router;