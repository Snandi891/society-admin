import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    createdBy: { type: String, default: "Admin" },
    createdAtIST: {
      type: Date,
      default: () => {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        return new Date(now.getTime() + istOffset);
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Announcement ||
  mongoose.model("Announcement", AnnouncementSchema);
