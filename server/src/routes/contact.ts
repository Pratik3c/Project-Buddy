import { Router } from "express";
import { z } from "zod";
import { Message } from "../models/Message.js";
import { Settings } from "../models/Settings.js";
import { sendMail } from "../utils/mailer.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const data = z.object({
      name: z.string().trim().min(1).max(120),
      email: z.string().trim().email(),
      phone: z.string().trim().max(20).optional(),
      college: z.string().trim().max(150).optional(),
      branch: z.string().trim().max(100).optional(),
      year: z.string().trim().max(20).optional(),
      message: z.string().trim().min(1).max(5000),
    }).parse(req.body);
    const msg = await Message.create(data);
    const settings = await Settings.findOne().lean();
    const to = settings?.adminEmail || settings?.contactEmail;
    if (to) {
      await sendMail({
        to,
        subject: `New Project Buddy inquiry: ${data.name}`,
        html: `<p><b>${data.name}</b> (${data.email}) sent a message:</p><p>${data.message.replace(/\n/g, "<br/>")}</p>`,
      }).catch(() => {});
    }
    res.status(201).json({ ok: true, id: msg._id });
  } catch (e) { next(e); }
});

export default router;