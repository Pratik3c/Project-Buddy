import { Schema, model } from "mongoose";

const qrSchema = new Schema({ image: String }, { timestamps: true });
export const QR = model("QR", qrSchema);