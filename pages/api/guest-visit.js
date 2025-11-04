import connectDB from "@/lib/mongodb";
import GuestVisit from "@/models/GuestVisit";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { guestName, flatNumber } = req.body;

      if (!guestName || !flatNumber) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required" });
      }

      const newVisit = await GuestVisit.create({ guestName, flatNumber });

      res.status(200).json({
        success: true,
        message: "Visit logged successfully!",
        data: newVisit,
      });
    } catch (error) {
      console.error("Error saving visit:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const visits = await GuestVisit.find({}).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: visits });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body; // Expect {_id: "..."}

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "ID is required" });
      }

      const deleted = await GuestVisit.findByIdAndDelete(id);

      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Guest visit not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Guest visit deleted successfully!" });
    } catch (error) {
      console.error("Error deleting visit:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
