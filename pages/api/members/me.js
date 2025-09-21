// pages/api/members/me.js
import connectDB from "@/lib/mongodb";
import Member from "@/models/Member";
import { parse } from "cookie";

export default async function handler(req, res) {
  await connectDB();

  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const memberId = cookies.memberToken;

  if (!memberId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const member = await Member.findById(memberId).select("-password");
    if (!member) return res.status(404).json({ error: "Member not found" });

    return res.status(200).json({ member });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
