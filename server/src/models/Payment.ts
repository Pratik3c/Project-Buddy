import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    appointment: { type: Schema.Types.ObjectId, ref: "Appointment" },
    amount: { type: Number, required: true, min: 0 },
    transactionId: { type: String, required: true },
    screenshot: String,
    status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending", index: true },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Payment = model("Payment", paymentSchema);