import connectDB from "@/lib/mongodb";
import Announcement from "@/models/Announcement";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { message, createdBy } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      const announcement = new Announcement({
        message,
        createdBy: createdBy || "Admin",
      });

      await announcement.save();

      return res.status(201).json({
        success: true,
        announcement,
        message: "✅ Announcement added",
      });
    } catch (err) {
      console.error("Error adding announcement:", err);
      return res.status(500).json({ error: "Failed to add announcement" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
