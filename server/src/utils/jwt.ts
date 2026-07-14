import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type JwtPayload = { sub: string; role: "student" | "admin" };

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}