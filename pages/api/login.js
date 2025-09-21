export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const maxAge = 60 * 60; // 1 hour
    const isProd = process.env.NODE_ENV === "production";
    const cookie = `loggedIn=true; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Lax${
      isProd ? "; Secure" : ""
    }`;

    res.setHeader("Set-Cookie", cookie);
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ message: "Invalid credentials" });
}
