export default async function handler(req, res) {
  let sign = md5(username + apikey + "depo")
  let response = await fetch('https://api.digiflazz.com/v1/cek-saldo', {
    method: 'POST',
    body: JSON.stringify({ cmd: "deposit", username, sign })
  })
  let data = await response.json()
  res.json({ saldo: data.data.deposit })
}
