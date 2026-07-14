import "dotenv/config";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Appointment } from "../models/Appointment.js";
import { Review } from "../models/Review.js";
import { Settings } from "../models/Settings.js";
import { QR } from "../models/QR.js";
import { hashPassword } from "../utils/hash.js";
import { env } from "../config/env.js";

async function run() {
  await connectDB();

  // Admin
  const adminExists = await User.findOne({ email: env.ADMIN_EMAIL });
  if (!adminExists) {
    await User.create({
      name: env.ADMIN_NAME,
      email: env.ADMIN_EMAIL,
      password: await hashPassword(env.ADMIN_PASSWORD),
      role: "admin",
      phone: "0000000000",
      college: "-",
      branch: "-",
      year: "-",
      city: "-",
      verified: true,
    });
    console.log(`[seed] Admin created: ${env.ADMIN_EMAIL} / ${env.ADMIN_PASSWORD}`);
  } else {
    console.log("[seed] Admin already exists — skipping");
  }

  // Settings
  await Settings.findOneAndUpdate({}, { $setOnInsert: { adminEmail: env.ADMIN_EMAIL } }, { upsert: true, new: true });
  await QR.findOneAndUpdate({}, { $setOnInsert: {} }, { upsert: true });

  // Demo students
  const demoStudents = [
    { name: "Aarav Sharma", email: "aarav@example.com", college: "IIT Bombay", branch: "CSE", year: "3rd", city: "Mumbai" },
    { name: "Diya Patel", email: "diya@example.com", college: "VIT Vellore", branch: "IT", year: "Final", city: "Vellore" },
    { name: "Rohan Iyer", email: "rohan@example.com", college: "NIT Trichy", branch: "ECE", year: "2nd", city: "Trichy" },
    { name: "Meera Nair", email: "meera@example.com", college: "BITS Pilani", branch: "CSE", year: "Final", city: "Pilani" },
    { name: "Kabir Singh", email: "kabir@example.com", college: "SRM University", branch: "AI/ML", year: "3rd", city: "Chennai" },
  ];
  const students: { _id: unknown }[] = [];
  for (const s of demoStudents) {
    const existing = await User.findOne({ email: s.email });
    if (existing) { students.push(existing); continue; }
    const u = await User.create({ ...s, phone: "9999999999", password: await hashPassword("Password123!"), role: "student" });
    students.push(u);
  }
  console.log(`[seed] ${students.length} demo students ready (password: Password123!)`);

  // Demo appointments
  const demoAppts = [
    { student: students[0]._id, title: "Library Management System", category: "major", technology: "React + Node + MongoDB", status: "approved", description: "Full CRUD, RBAC, reports" },
    { student: students[1]._id, title: "DBMS Lab Assignment", category: "assignment", technology: "MySQL", status: "pending", description: "ER diagram + normalization" },
    { student: students[2]._id, title: "IoT Home Automation", category: "major", technology: "ESP32 + Node", status: "completed", description: "Voice control + dashboard" },
    { student: students[3]._id, title: "Weather App", category: "assignment", technology: "React", status: "completed", description: "OpenWeather API" },
    { student: students[4]._id, title: "ML Fake News Detector", category: "major", technology: "Python + Flask", status: "approved", description: "NLP + logistic regression" },
  ] as const;
  for (const a of demoAppts) {
    const exists = await Appointment.findOne({ title: a.title, student: a.student });
    if (!exists) await Appointment.create(a);
  }
  console.log("[seed] Demo appointments ready");

  // Demo reviews
  const demoReviews = [
    { student: students[0]._id, rating: 5, comment: "Delivered on time and helped me ace the viva!", approved: true, project: "Library MS" },
    { student: students[1]._id, rating: 5, comment: "Very patient explanations. Highly recommend.", approved: true, project: "DBMS lab" },
    { student: students[2]._id, rating: 4, comment: "Great IoT project — deployment guide was gold.", approved: true, project: "Home Automation" },
    { student: students[3]._id, rating: 5, comment: "PPT and report were both perfect.", approved: true, project: "Weather App" },
    { student: students[4]._id, rating: 5, comment: "Made ML feel simple. Loved the mock viva.", approved: true, project: "Fake News Detector" },
    { student: students[0]._id, rating: 4, comment: "Quick to reply on chat.", approved: false, project: "Follow-up" },
  ];
  for (const r of demoReviews) {
    const exists = await Review.findOne({ student: r.student, comment: r.comment });
    if (!exists) await Review.create(r);
  }
  console.log("[seed] Demo reviews ready");

  console.log("\n✅ Seed complete.\n");
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });