// /api/digiflazz.js - FINAL V4
const USERNAME = "ISI_USERNAME_DIGIFLAZZ_KAMU";
const API_KEY = "ISI_API_KEY_PRODUCTION_KAMU";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();

  const { action, sku, customer_no } = req.method === 'POST' ? req.body : req.query;
  const crypto = await import('crypto');
  
  let endpoint = 'https://api.digiflazz.com/v1/';
  let payload = {};

  if(action === 'price-list'){
    endpoint += 'price-list';
    payload = { cmd:"prepaid", username:USERNAME, sign: crypto.createHash('md5').update(USERNAME + API_KEY + 'pricelist').digest('hex') };
  } else if(action === 'balance' || action === 'cek-saldo'){
    endpoint += 'cek-saldo';
    payload = { cmd:"deposit", username:USERNAME, sign: crypto.createHash('md5').update(USERNAME + API_KEY + 'depo').digest('hex') };
  } else if(action === 'topup'){
    endpoint += 'transaction';
    const ref = "ECELL"+Date.now();
    payload = { username:USERNAME, buyer_sku_code:sku, customer_no:customer_no, ref_id:ref, sign: crypto.createHash('md5').update(USERNAME + API_KEY + ref).digest('hex') };
  }

  try{
    const digiRes = await fetch(endpoint, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
    const data = await digiRes.json();
    return res.json(data);
  } catch(e){
    return res.status(500).json({error:e.message});
  }
}
