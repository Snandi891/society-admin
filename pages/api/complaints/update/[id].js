import connectDB from "@/lib/mongodb";
import Complaint from "@/models/Complaint";

export default async function handler(req, res) {
  const { id } = req.query; // id comes from the URL: /api/complaints/update/<id>

  await connectDB();

  if (req.method === "PATCH") {
    try {
      const { status } = req.body;
      if (!status)
        return res
          .status(400)
          .json({ success: false, message: "Status required" });

      const updatedComplaint = await Complaint.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedComplaint)
        return res
          .status(404)
          .json({ success: false, message: "Complaint not found" });

      return res.status(200).json({ success: true, data: updatedComplaint });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  } else {
    res.setHeader("Allow", ["PATCH"]);
    return res
      .status(405)
      .json({ success: false, message: `Method ${req.method} not allowed` });
  }
}
