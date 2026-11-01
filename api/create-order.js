// File: /api/create-order.js - E CELL - BERSIH FINAL - NAMA CUMA E CELL
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

    // INVOICE - NAMA CUMA E CELL
    const invoicePelanggan = `*INVOICE E-CELL*
Ref: ${ref_id}
Tujuan: ${noTujuan} ${server?`| Server: ${server}`:''}
Produk: ${produk?.name||produk} - ${(produk?.game||'').toUpperCase()}
Total: Rp ${Number(total||0).toLocaleString()}
Via: ${payMethod.toUpperCase()} A/N WARJAYA
WA Pembeli: ${nomorPembeli}
Waktu: ${new Date().toLocaleString('id-ID')}

*Rekening Resmi A/N WARJAYA:*
- Mandiri: 1370022647966
- Superbank: 030018699543
- Neo: 5859459406987262

Status: Menunggu Cek Admin

Terima kasih sudah order di E-CELL Yogyakarta 24 Jam 🙏
CS: 083178084316`;

    let invoiceResponse = null;
    let invoiceSent = false;
    try {
      const formData = new URLSearchParams();
      formData.append('target', wa62);
      formData.append('message', invoicePelanggan);
      formData.append('countryCode', '62');
      const fonnteRes = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { 'Authorization': FONNTE_TOKEN },
        body: formData
      });
      const text = await fonnteRes.text();
      try { invoiceResponse = JSON.parse(text); } catch { invoiceResponse = { raw: text }; }
      invoiceSent = text.toLowerCase().includes('success') || invoiceResponse.status === true;
    } catch (e) {
      invoiceResponse = { error: e.message };
    }

    // NOTIF EKSEKUSI CS1 - NAMA CUMA E CELL
    const skuCode = produk?.sku || produk?.name || 'axis5';
    const linkEksekusi = `${BASE_URL}/api/eksekusi?ref=${ref_id}&key=WARJAYA123&sku=${encodeURIComponent(skuCode)}&tujuan=${encodeURIComponent(noTujuan)}&server=${encodeURIComponent(server||'')}&total=${total}`;

    const notifCS1 = `*ORDER BARU E-CELL - EKSEKUSI DIGIFLAZZ*
Ref: ${ref_id}
Tujuan: ${noTujuan} ${server?`| Server: ${server}`:''}
Produk: ${skuCode} - ${produk?.name||''} - ${(produk?.game||'').toUpperCase()}
Total: Rp ${Number(total||0).toLocaleString()}
Via: ${payMethod.toUpperCase()} A/N WARJAYA
WA Pembeli: ${nomorPembeli} (${wa62})
Waktu: ${new Date().toLocaleString('id-ID')}

Invoice ke pembeli: ${invoiceSent ? 'Terkirim ✅' : 'Gagal ❌'}

Cek mutasi A/N WARJAYA:
Neo 5859459406987262 / Superbank 030018699543 / Mandiri 1370022647966

Jika uang sudah masuk, klik eksekusi:
${linkEksekusi}

E-CELL Yogyakarta`;

    let cs1Response = null;
    let cs1Sent = false;
    await new Promise(r => setTimeout(r, 3000));
    try {
      const form2 = new URLSearchParams();
      form2.append('target', CS1_WA);
      form2.append('message', notifCS1);
      form2.append('countryCode', '62');
      form2.append('delay', '5');
      const r2 = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { 'Authorization': FONNTE_TOKEN },
        body: form2
      });
      const t2 = await r2.text();
      try { cs1Response = JSON.parse(t2); } catch { cs1Response = { raw: t2 }; }
      cs1Sent = t2.toLowerCase().includes('success') || cs1Response.status === true;
    } catch (e) {
      cs1Response = { error: e.message };
    }

    return res.status(200).json({
      success: true,
      ref_id,
      waPembeli: wa62,
      invoice: { sent: invoiceSent, response: invoiceResponse },
      cs1: { sent: cs1Sent, response: cs1Response, link: linkEksekusi }
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  }
