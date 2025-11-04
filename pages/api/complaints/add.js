// /pages/api/complaints/add.js
import connectDB from "@/lib/mongodb";
import Complaint from "@/models/Complaint";

export default async function handler(req, res) {
  await connectDB();

  // Log the request method and body for debugging
  console.log("Request method:", req.method);
  console.log("Request body:", req.body);

  if (req.method === "POST") {
    try {
      // Check if body exists
      if (!req.body) {
        return res
          .status(400)
          .json({ success: false, message: "Request body is missing" });
      }

      const { flatNumber, name, complaintText } = req.body;

      // Validate required fields
      if (!flatNumber || !name || !complaintText) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required." });
      }

      // Create and save the complaint
      const newComplaint = new Complaint({
        flatNumber,
        name,
        complaintText,
        status: "Pending",
        createdAt: new Date(),
      });

      await newComplaint.save();

      return res
        .status(201)
        .json({ success: true, message: "Complaint submitted successfully!" });
    } catch (error) {
      console.error("Error saving complaint:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  } else {
    // Return 405 for non-POST requests
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
