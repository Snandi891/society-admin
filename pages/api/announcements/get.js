// pages/api/announcements.js
import connectDB from "@/lib/mongodb";
import Announcement from "@/models/Announcement";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      // Fetch all announcements, no limit
      const announcements = await Announcement.find().sort({ createdAt: -1 });

      const formatted = announcements.map((a) => ({
        ...a._doc,
        createdAtIST: new Date(a.createdAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        }),
      }));

      return res.status(200).json({ success: true, announcements: formatted });
    } catch (err) {
      console.error("Error fetching announcements:", err);
      return res.status(500).json({ error: "Failed to fetch announcements" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      if (!id)
        return res.status(400).json({ success: false, error: "ID required" });

      const deleted = await Announcement.findByIdAndDelete(id);
      if (!deleted)
        return res
          .status(404)
          .json({ success: false, error: "Announcement not found" });

      return res
        .status(200)
        .json({ success: true, message: "Announcement deleted" });
    } catch (err) {
      console.error("Error deleting announcement:", err);
      return res
        .status(500)
        .json({ success: false, error: "Failed to delete announcement" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
