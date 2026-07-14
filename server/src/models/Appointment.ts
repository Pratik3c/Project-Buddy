import { Schema, model, type InferSchemaType } from "mongoose";

const appointmentSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    category: { type: String, enum: ["assignment", "major"], required: true },
    technology: String,
    description: String,
    budget: String,
    preferredDate: String,
    preferredTime: String,
    status: { type: String, enum: ["pending", "approved", "rejected", "completed"], default: "pending", index: true },
    meetingDate: String,
    meetingTime: String,
    meetingLink: String,
    meetingNotes: String,
    stage: { type: String, enum: ["requirements", "development", "documentation", "testing", "completed"], default: "requirements" },
  },
  { timestamps: true }
);

export type AppointmentDoc = InferSchemaType<typeof appointmentSchema>;
export const Appointment = model("Appointment", appointmentSchema);