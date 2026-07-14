import { Schema, model } from "mongoose";

const settingsSchema = new Schema(
  {
    heroTitle: { type: String, default: "Project Buddy" },
    heroSubtitle: {
      type: String,
      default:
        "Helping college students successfully build academic projects with guidance, mentoring, documentation, presentations and technical support.",
    },
    pricingBasic: { type: String, default: "₹499" },
    pricingMajor: { type: String, default: "₹3999" },
    contactEmail: { type: String, default: "hello@projectbuddy.dev" },
    contactPhone: String,
    linkedin: String,
    github: String,
    instagram: String,
    adminEmail: String,
  },
  { timestamps: true }
);

export const Settings = model("Settings", settingsSchema);