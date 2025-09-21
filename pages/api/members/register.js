import connectDB from "@/lib/mongodb";
import Member from "@/models/Member";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { name, flatNumber, phone, password, familyCount } = req.body;

    if (!name || !flatNumber || !phone || !password || !familyCount) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newMember = new Member({
        name,
        flatNumber,
        phone,
        password: hashedPassword,
        familyCount,
        role: "resident",
      });

      await newMember.save();

      return res.status(201).json({
        message: "✅ Member added successfully",
        member: {
          id: newMember._id,
          name: newMember.name,
          flatNumber: newMember.flatNumber,
          phone: newMember.phone,
          familyCount: newMember.familyCount,
          role: newMember.role,
        },
      });
    } catch (err) {
      return res.status(500).json({ error: "Failed to register member" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
