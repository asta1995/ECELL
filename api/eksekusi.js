// File: /api/eksekusi.js - E CELL - MODE B 1 KLIK CS1 EKSEKUSI DIGIFLAZZ - FINAL BERSIH
export default async function handler(req, res) {
  const { ref, key, sku, tujuan, server, total } = req.query;
  
  if (key !== 'WARJAYA123') {
    return res.status(403).send(`
      <html><body style="font-family:monospace;background:#000;color:#fff;padding:20px">
      <h1>403 - Key Salah</h1><p>Key harus WARJAYA123</p><p>Ref: ${ref||'-'}</p>
      </body></html>
    `);
  }

  const DIGIFLAZZ_USER = process.env.DIGIFLAZZ_USER;
  const DIGIFLAZZ_KEY = process.env.DIGIFLAZZ_KEY;
  const FONNTE_TOKEN = (process.env.FONNTE_TOKEN || 'MPy4LpPbAhGQCprjn2iS').trim();

  if (!DIGIFLAZZ_USER || !DIGIFLAZZ_KEY) {
    return res.status(200).send(`
      <html>
      <head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>E-CELL - ENV BELUM SET</title></head>
      <body style="font-family:monospace;background:#0b0b0b;color:#fff;padding:20px;max-width:600px;margin:0 auto">
      <div style="background:#141414;border:1px solid #f59e0b;border-radius:20px;padding:20px">
      <h1 style="color:#f59e0b">⚠️ ENV DIGIFLAZZ BELUM SET</h1>
      <p><b>Ref:</b> ${ref}</p><p><b>SKU:</b> ${sku}</p><p><b>Tujuan:</b> ${tujuan}</p>
      <p>Set di Vercel:</p>
      <ul>
        <li>DIGIFLAZZ_USER = zebewaDzQQlo</li>
        <li>DIGIFLAZZ_KEY = de517822-b8a9-57e2-8f89-4d9c63b4288e</li>
      </ul>
      <p><a href="https://vercel.com/warjaya-s-projects/ecell-theta-ten/settings/environment-variables" style="color:#22c55e">Buka Vercel ENV</a></p>
      </div>
      </body>
      </html>
    `);
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
    const statusDigiflazz = result.data?.status || result.data?.message || result.message || JSON.stringify(result).substring(0,300);

    // NOTIF HASIL KE WA CS1 - NAMA CUMA E CELL - BERSIH
    const notifHasil = `*HASIL EKSEKUSI E-CELL*
Ref: ${ref}
SKU: ${sku}
Tujuan: ${tujuan} ${server?`| Server: ${server}`:''}
Total: Rp ${Number(total||0).toLocaleString()}
Status Digiflazz: ${statusDigiflazz}
Waktu: ${new Date().toLocaleString('id-ID')}

Detail: ${JSON.stringify(result).substring(0,400)}

E-CELL Yogyakarta`;

    try {
      const formHasil = new URLSearchParams();
      formHasil.append('target', '6283178084316');
      formHasil.append('message', notifHasil);
      formHasil.append('countryCode', '62');
      
      await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { 'Authorization': FONNTE_TOKEN },
        body: formHasil
      });
    } catch {}

    return res.status(200).send(`
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EKSEKUSI SUKSES E-CELL</title>
      </head>
      <body style="font-family:system-ui,monospace;background:#0b0b0b;color:#fff;padding:15px;max-width:600px;margin:0 auto">
      <div style="background:#141414;border:1px solid #22c55e;border-radius:20px;padding:20px">
        <h1 style="color:#22c55e;margin:0 0 10px 0;font-size:22px">✅ EKSEKUSI BERHASIL</h1>
        <p style="color:#888;margin:0 0 15px 0">E-CELL Yogyakarta 24 Jam</p>
        
        <div style="background:#000;border-radius:12px;padding:12px;margin-bottom:12px">
          <p style="margin:5px 0"><b>Ref:</b> ${ref}</p>
          <p style="margin:5px 0"><b>SKU:</b> ${sku}</p>
          <p style="margin:5px 0"><b>Tujuan:</b> ${tujuan}</p>
          <p style="margin:5px 0"><b>Server:</b> ${server||'-'}</p>
          <p style="margin:5px 0"><b>Total:</b> Rp ${Number(total||0).toLocaleString()}</p>
        </div>

        <div style="background:#000;border-radius:12px;padding:12px;margin-bottom:15px">
          <p style="margin:0 0 5px 0;color:#22c55e"><b>Status Digiflazz:</b></p>
          <p style="margin:0;font-size:14px">${statusDigiflazz}</p>
        </div>

        <pre style="background:#000;padding:10px;border-radius:10px;overflow:auto;font-size:11px;white-space:pre-wrap;border:1px solid #333">${JSON.stringify(result, null, 2)}</pre>

        <div style="margin-top:15px;background:#22c55e20;border:1px solid #22c55e;padding:10px;border-radius:10px;font-size:13px">
          ✅ Hasil eksekusi sudah dikirim ke WA CS1 083178084316 via BOT E-CELL
        </div>

        <a href="https://wa.me/6283178084316" style="display:block;margin-top:15px;background:#22c55e;color:#000;padding:12px;text-align:center;border-radius:12px;font-weight:900;text-decoration:none">
          BUKA WA CS1
        </a>

        <p style="text-align:center;color:#555;margin-top:15px;font-size:11px">
          E-CELL Yogyakarta 24 Jam<br/>083178084316
        </p>
      </div>
      </body>
      </html>
    `);

  } catch (e) {
    return res.status(500).send(`
      <html><body style="font-family:monospace;background:#000;color:#fff;padding:20px">
      <h1>Error Eksekusi E-CELL</h1>
      <p>Ref: ${ref}</p>
      <p>Error: ${e.message}</p>
      <p>SKU: ${sku}</p>
      <p>Tujuan: ${tujuan}</p>
      </body></html>
    `);
  }
}
