// /models/Complaint.js
import mongoose from "mongoose";

// Helper function to get Indian Standard Time (IST)
function getIndianTime() {
  const now = new Date();
  const utcOffset = now.getTime() + now.getTimezoneOffset() * 60000; // convert to UTC
  const istOffset = 5.5 * 60 * 60 * 1000; // IST offset (+5 hours 30 mins)
  return new Date(utcOffset + istOffset);
}

const ComplaintSchema = new mongoose.Schema({
  flatNumber: { type: String, required: true },
  name: { type: String, required: true },
  complaintText: { type: String, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: getIndianTime },
});

export default mongoose.models.Complaint ||
  mongoose.model("Complaint", ComplaintSchema);
