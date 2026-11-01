import md5 from "md5";
export default async function handler(req, res) {
  const sign = md5(process.env.DIGIFLAZZ_USER + process.env.DIGIFLAZZ_APIKEY + "depo");
  const r = await fetch("https://api.digiflazz.com/v1/cek-saldo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cmd: "deposit", username: process.env.DIGIFLAZZ_USER, sign }),
  });
  const data = await r.json();
  const saldo = data?.data?.deposit || 0;
  // Auto warning jika < 50rb
  if (saldo < 50000) {
    const { botWarningSaldo } = await import("../../lib/wa.js");
    await botWarningSaldo(saldo);
  }
  res.json({ saldo });
}
