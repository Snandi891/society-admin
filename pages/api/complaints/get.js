// /pages/api/complaints/get.js
import connectDB from "@/lib/mongodb";
import Complaint from "@/models/Complaint";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const complaints = await Complaint.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: complaints });
    } catch (error) {
      console.error("Error fetching complaints:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
