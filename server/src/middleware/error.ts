import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: "Not found" });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: "Validation failed", issues: err.issues });
  }
  const e = err as { status?: number; message?: string; code?: number };
  if (e?.code === 11000) return res.status(409).json({ message: "Duplicate value" });
  const status = e?.status ?? 500;
  const message = e?.message ?? "Server error";
  if (status >= 500) console.error(err);
  res.status(status).json({ message });
}

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}