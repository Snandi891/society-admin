import connectDB from "@/lib/mongodb";
import Member from "@/models/Member";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { flatNumber, password } = req.body;

    if (!flatNumber || !password) {
      return res.status(400).json({ error: "Flat number & password required" });
    }

    try {
      const member = await Member.findOne({ flatNumber });
      if (!member) return res.status(400).json({ error: "Member not found" });

      const isMatch = await bcrypt.compare(password, member.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid password" });

      return res.status(200).json({
        message: "✅ Login successful",
        member: {
          id: member._id,
          name: member.name,
          flatNumber: member.flatNumber,
          phone: member.phone,
          familyCount: member.familyCount,
          role: member.role,
        },
      });
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
