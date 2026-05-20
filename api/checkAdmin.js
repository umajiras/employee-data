export default async function handler(req, res) {

  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({
      ok: true,
      token: process.env.ADMIN_TOKEN
    });
  }

  res.json({
    ok: false
  });

}