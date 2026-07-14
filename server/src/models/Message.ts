import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    college: String,
    branch: String,
    year: String,
    message: { type: String, required: true, maxlength: 5000 },
  },
  { timestamps: true }
);

export const Message = model("Message", messageSchema);