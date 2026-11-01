// /api/digiflazz.js - TARUH DI VERCEL
const USERNAME = "ISI_USERNAME_DIGIFLAZZ_KAMU";
const API_KEY = "ISI_API_KEY_PRODUCTION_KAMU";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  const { action, sku, customer_no } = req.method === 'POST' ? req.body : req.query;
  
  const crypto = await import('crypto');
  const sign = crypto.createHash('md5').update(USERNAME + API_KEY + (action==='price-list'?'pricelist':'')).digest('hex');

  let payload = {};
  if(action === 'price-list'){
    payload = { cmd:"prepaid", username:USERNAME, sign };
  } else if(action === 'topup'){
    payload = { username:USERNAME, buyer_sku_code:sku, customer_no:customer_no, ref_id:"ECELL"+Date.now(), sign:crypto.createHash('md5').update(USERNAME+API_KEY+"ECELL"+Date.now()).digest('hex') };
  }

  const endpoint = action === 'price-list' ? 'https://api.digiflazz.com/v1/price-list' : 'https://api.digiflazz.com/v1/transaction';
  
  const digiRes = await fetch(endpoint, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
  const data = await digiRes.json();
  res.json(data);
}
