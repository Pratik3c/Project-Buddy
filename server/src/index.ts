import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import path from "node:path";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/error.js";

import auth from "./routes/auth.js";
import users from "./routes/users.js";
import appointments from "./routes/appointments.js";
import payments from "./routes/payments.js";
import reviews from "./routes/reviews.js";
import notifications from "./routes/notifications.js";
import admin from "./routes/admin.js";
import contact from "./routes/contact.js";
import settings from "./routes/settings.js";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: env.CLIENT_URL.split(",").map((s) => s.trim()), credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(hpp());
app.use(morgan("dev"));
app.use("/api", rateLimit({ windowMs: 60_000, max: 200 }));

app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "project-buddy-api" }));
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/appointments", appointments);
app.use("/api/payments", payments);
app.use("/api/reviews", reviews);
app.use("/api/notifications", notifications);
app.use("/api/admin", admin);
app.use("/api/contact", contact);
app.use("/api/settings", settings);

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(env.PORT, () => console.log(`[api] listening on http://localhost:${env.PORT}`));
});