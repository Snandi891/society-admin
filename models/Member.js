import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    flatNumber: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    familyCount: { type: Number, required: true }, // ✅ NEW FIELD
    role: { type: String, default: "resident" },
  },
  { timestamps: true }
);

export default mongoose.models.Member || mongoose.model("Member", MemberSchema);
