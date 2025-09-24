export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const maxAge = 60 * 60;
    const isProd = process.env.NODE_ENV === "production";

    res.setHeader("Set-Cookie", [
      `loggedIn=true; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Lax${
        isProd ? "; Secure" : ""
      }`,
    ]);

    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ message: "Invalid credentials" });
}
