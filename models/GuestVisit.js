import mongoose from "mongoose";

const GuestVisitSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  flatNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.GuestVisit ||
  mongoose.model("GuestVisit", GuestVisitSchema);
