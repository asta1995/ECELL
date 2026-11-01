// File: /api/create-order.js - FIX INVOICE TIDAK TERKIRIM - KUNCI FINAL
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});

  try {
    const { ref_id, produk, noTujuan, server, total, payMethod, nomorPembeli, nomorPembeli62 } = req.body;
    
    let waRaw = (nomorPembeli62 || nomorPembeli || '').toString().replace(/\D/g,'');
    let wa62 = waRaw;
    if (waRaw.startsWith('0')) wa62 = '62' + waRaw.slice(1);
    else if (!waRaw.startsWith('62')) wa62 = '62' + waRaw;

    const FONNTE_TOKEN = (process.env.FONNTE_TOKEN || 'MPy4LpPbAhGQCprjn2iS').trim();
    const CS1_WA = '6283178084316';
    const BASE_URL = 'https://ecell-theta-ten.vercel.app';

    // INVOICE KUNCI
    const invoicePelanggan = `*INVOICE E-CELL PRO - WARJAYA*
Ref: ${ref_id}
Tujuan: ${noTujuan} ${server?`| Server: ${server}`:''}
Produk: ${produk?.name||produk} - ${(produk?.game||'').toUpperCase()}
Total: Rp ${Number(total||0).toLocaleString()}
Via: ${payMethod.toUpperCase()} A/N WARJAYA
WA Pembeli: ${nomorPembeli}
Waktu: ${new Date().toLocaleString('id-ID')}
Rek: Mandiri 1370022647966 / Superbank 030018699543 / Neo 5859459406987262 A/N WARJAYA
Status: Menunggu Cek Admin - KUNCI`;

    console.log('KIRIM INVOICE KE:', wa62, 'TOKEN:', FONNTE_TOKEN.substring(0,4)+'****');

    let invoiceResponse = null;
    let invoiceSent = false;

    try {
      // FIX FORMAT FONNTE - HARUS PAKAI FORM-DATA + AUTHORIZATION
      const formData = new URLSearchParams();
      formData.append('target', wa62);
      formData.append('message', invoicePelanggan);
      formData.append('countryCode', '62');

      const fonnteRes = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': FONNTE_TOKEN
        },
        body: formData
      });
      
      const text = await fonnteRes.text();
      console.log('FONNTE RESPONSE:', text);
      
      try { invoiceResponse = JSON.parse(text); } catch { invoiceResponse = { raw: text }; }
      
      invoiceSent = invoiceResponse.status === true || invoiceResponse.status === 'true' || invoiceResponse.reason === 'success' || invoiceResponse.detail?.toLowerCase().includes('success');
      
    } catch (e) {
      console.log('FONNTE ERROR:', e.message);
      invoiceResponse = { error: e.message };
    }

    // LINK EKSEKUSI CS1 - MODE B
    const skuCode = produk?.sku || 'CEK_MANUAL';
    const linkEksekusi = `${BASE_URL}/api/eksekusi?ref=${ref_id}&key=WARJAYA123&sku=${encodeURIComponent(skuCode)}&tujuan=${encodeURIComponent(noTujuan)}`;

    const notifCS1 = `*ORDER BARU MODE B*
Ref: ${ref_id}
Tujuan: ${noTujuan}
SKU: ${skuCode}
Total: Rp ${Number(total||0).toLocaleString()}
WA Pembeli: ${nomorPembeli} (${wa62})
Invoice ke pembeli: ${invoiceSent ? '✅ TERKIRIM' : '❌ GAGAL - '+JSON.stringify(invoiceResponse).substring(0,100)}
Via: ${payMethod.toUpperCase()}

KLIK EKSEKUSI:
${linkEksekusi}`;

    let cs1Response = null;
    let cs1Sent = false;
    try {
      const form2 = new URLSearchParams();
      form2.append('target', CS1_WA);
      form2.append('message', notifCS1);
      form2.append('countryCode', '62');
      
      const r2 = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { 'Authorization': FONNTE_TOKEN },
        body: form2
      });
      const t2 = await r2.text();
      try { cs1Response = JSON.parse(t2); } catch { cs1Response = { raw: t2 }; }
      cs1Sent = cs1Response.status === true || cs1Response.reason === 'success';
    } catch (e) {
      cs1Response = { error: e.message };
    }

    return res.status(200).json({
      success: true,
      ref_id,
      waPembeli: wa62,
      tokenUsed: FONNTE_TOKEN.substring(0,4)+'****',
      invoice: { sent: invoiceSent, response: invoiceResponse },
      cs1: { sent: cs1Sent, response: cs1Response, link: linkEksekusi },
      debug: 'Cek Vercel Logs untuk detail Fonnte response'
    });

  } catch (err) {
    console.error('ERROR:', err);
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
                      }
