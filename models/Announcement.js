import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    createdBy: { type: String, default: "Admin" },
    createdAtIST: {
      type: Date,
      default: () => {
        // Get current UTC time
        const now = new Date();
        // Convert to IST (UTC + 5:30)
        const istOffset = 5.5 * 60 * 60 * 1000;
        return new Date(now.getTime() + istOffset);
      },
    },
  },
  { timestamps: true } // keeps createdAt (UTC) and updatedAt (UTC)
);

export default mongoose.models.Announcement ||
  mongoose.model("Announcement", AnnouncementSchema);
