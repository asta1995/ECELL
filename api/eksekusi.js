// File: /api/eksekusi.js - E CELL - 100% ENV VERCEL - FINAL AMAN
export default async function handler(req, res) {
  const { ref, key, sku, tujuan, server, total } = req.query;
  
  const EKSEKUSI_KEY = process.env.EKSEKUSI_KEY || 'WARJAYA123';
  if (key !== EKSEKUSI_KEY) {
    return res.status(403).send(`<html><body style="background:#000;color:#fff;padding:20px"><h1>403 - Key Salah</h1><p>Ref: ${ref||'-'}</p></body></html>`);
  }

  const DIGIFLAZZ_USER = process.env.DIGIFLAZZ_USER;
  const DIGIFLAZZ_KEY = process.env.DIGIFLAZZ_KEY;
  const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
  const CS1_WA = process.env.CS1_WA || '6283178084316';

  if (!DIGIFLAZZ_USER || !DIGIFLAZZ_KEY || !FONNTE_TOKEN) {
    return res.status(200).send(`<html><body style="background:#0b0b0b;color:#fff;padding:20px"><h1>ENV Belum Lengkap</h1><p>Set DIGIFLAZZ_USER, DIGIFLAZZ_KEY, FONNTE_TOKEN di Vercel ENV</p><p>Ref: ${ref}</p></body></html>`);
  }

  try {
    const crypto = await import('crypto');
    const sign = crypto.createHash('md5').update(DIGIFLAZZ_USER + DIGIFLAZZ_KEY + ref).digest('hex');
    
    const digiflazzRes = await fetch('https://api.digiflazz.com/v1/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: DIGIFLAZZ_USER,
        buyer_sku_code: sku,
        customer_no: tujuan,
        ref_id: ref,
        sign: sign
      })
    });
    
    const result = await digiflazzRes.json();
    const statusDigiflazz = result.data?.status || result.data?.message || result.message || 'Cek detail';

    const notifHasil = `*HASIL EKSEKUSI E-CELL*
Ref: ${ref}
SKU: ${sku}
Tujuan: ${tujuan} ${server?`| Server: ${server}`:''}
Total: Rp ${Number(total||0).toLocaleString()}
Status: ${statusDigiflazz}
Waktu: ${new Date().toLocaleString('id-ID')}
E-CELL Yogyakarta`;

    try {
      const formHasil = new URLSearchParams();
      formHasil.append('target', CS1_WA);
      formHasil.append('message', notifHasil);
      formHasil.append('countryCode', '62');
      await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { 'Authorization': FONNTE_TOKEN.trim() },
        body: formHasil
      });
    } catch {}

    return res.status(200).send(`
      <html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>E-CELL - SUKSES</title></head>
      <body style="font-family:monospace;background:#0b0b0b;color:#fff;padding:15px;max-width:600px;margin:0 auto">
      <div style="background:#141414;border:1px solid #22c55e;border-radius:20px;padding:20px">
        <h1 style="color:#22c55e">✅ EKSEKUSI BERHASIL - E-CELL</h1>
        <p>Ref: ${ref}</p><p>SKU: ${sku}</p><p>Tujuan: ${tujuan}</p><p>Total: Rp ${Number(total||0).toLocaleString()}</p>
        <p>Status: ${statusDigiflazz}</p>
        <pre style="background:#000;padding:10px;border-radius:10px;font-size:11px;white-space:pre-wrap">${JSON.stringify(result, null, 2)}</pre>
      </div>
      </body></html>
    `);
  } catch (e) {
    return res.status(500).send(`<html><body style="background:#000;color:#fff;padding:20px"><h1>Error E-CELL</h1><p>${e.message}</p></body></html>`);
  }
}
