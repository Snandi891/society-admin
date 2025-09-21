import connectDB from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    await connectDB();
    res.status(200).json({ message: "✅ Database connected!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "❌ Database connection failed", details: err.message });
  }
}
