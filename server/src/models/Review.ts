import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true, maxlength: 2000 },
    project: String,
    approved: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const Review = model("Review", reviewSchema);