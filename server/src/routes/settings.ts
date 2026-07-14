import { Router } from "express";
import { Settings } from "../models/Settings.js";
import { QR } from "../models/QR.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const settings = (await Settings.findOne().lean()) ?? {};
    const qr = (await QR.findOne().sort("-updatedAt").lean()) ?? {};
    res.json({ settings, qr });
  } catch (e) { next(e); }
});

router.get("/qr", async (_req, res, next) => {
  try {
    const qr = (await QR.findOne().sort("-updatedAt").lean()) ?? {};
    res.json({ qr });
  } catch (e) { next(e); }
});

export default router;