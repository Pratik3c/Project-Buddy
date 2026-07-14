import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";
import { User } from "../models/User.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string; role: "student" | "admin" };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
  try {
    const payload = verifyToken(header.slice(7));
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    req.user = { id: String(user._id), role: user.role as "student" | "admin" };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
}