export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const isProd = process.env.NODE_ENV === "production";
  const cookie = `loggedIn=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax${
    isProd ? "; Secure" : ""
  }`;

  res.setHeader("Set-Cookie", cookie);
  return res.status(200).json({ success: true });
}
