import connectDB from "@/lib/mongodb";
import Member from "@/models/Member";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const members = await Member.find();
      return res.status(200).json(members);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch members" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { id, name, flatNumber, phone, password } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Member ID required" });
      }

      const updateData = { name, flatNumber, phone };

      if (password) {
        // ✅ hash new password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }

      const updatedMember = await Member.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedMember) {
        return res.status(404).json({ error: "Member not found" });
      }

      return res.status(200).json({
        message: "✅ Member updated successfully",
        member: updatedMember,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update member" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
