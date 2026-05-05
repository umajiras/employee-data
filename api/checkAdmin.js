export default async function handler(req, res) {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ ok: true });
  }
  res.json({ ok: false });
}