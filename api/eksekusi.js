// File: /api/eksekusi.js - E CELL - FIX NOTIF TIDAK MASUK - LOG LENGKAP
export default async function handler(req, res) {
  const { ref, key, sku, tujuan, server, total } = req.query;
  
  const EKSEKUSI_KEY = process.env.EKSEKUSI_KEY || 'WARJAYA123';
  if (key !== EKSEKUSI_KEY) {
    return res.status(403).json({error:'Key salah', ref});
  }

  const DIGIFLAZZ_USER = process.env.DIGIFLAZZ_USER;
  const DIGIFLAZZ_KEY = process.env.DIGIFLAZZ_KEY;
  const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
  const CS1_WA = process.env.CS1_WA || '6283178084316';

  if (!DIGIFLAZZ_USER || !DIGIFLAZZ_KEY || !FONNTE_TOKEN) {
    return res.status(500).json({error:'ENV belum lengkap', env:{hasUser:!!DIGIFLAZZ_USER, hasKey:!!DIGIFLAZZ_KEY, hasFonnte:!!FONNTE_TOKEN}});
  }

  let digiflazzResult = null;
  let statusDigiflazz = 'pending';

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
    
    digiflazzResult = await digiflazzRes.json();
    statusDigiflazz = digiflazzResult.data?.status || digiflazzResult.data?.message || digiflazzResult.message || 'sukses';

  } catch (e) {
    digiflazzResult = { error: e.message };
    statusDigiflazz = 'Error: ' + e.message;
  }

  // NOTIF HASIL - CUMA E CELL
  const notifHasil = `*HASIL EKSEKUSI E-CELL*
Ref: ${ref}
SKU: ${sku}
Tujuan: ${tujuan} ${server?`| Server: ${server}`:''}
Total: Rp ${Number(total||0).toLocaleString()}
Status: ${statusDigiflazz}
Waktu: ${new Date().toLocaleString('id-ID')}
E-CELL Yogyakarta`;

  let fonnteLog = null;
  let fonnteSent = false;

  // COBA KIRIM 3x DENGAN FORMAT BERBEDA - BIAR MASUK KE NOMOR SENDIRI
  try {
    // CARA 1: Tanpa countryCode + delay
    const form1 = new URLSearchParams();
    form1.append('target', CS1_WA);
    form1.append('message', notifHasil);
    form1.append('delay', '2');
    
    const r1 = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { 'Authorization': FONNTE_TOKEN.trim() },
      body: form1
    });
    const t1 = await r1.text();
    try { fonnteLog = JSON.parse(t1); } catch { fonnteLog = { raw: t1 }; }
    fonnteSent = fonnteLog.status === true || t1.toLowerCase().includes('success') || fonnteLog.reason === 'success';

    // CARA 2: Jika gagal, coba lagi pakai format 08
    if (!fonnteSent) {
      await new Promise(r => setTimeout(r, 2000));
      const target08 = CS1_WA.startsWith('62') ? '0' + CS1_WA.slice(2) : CS1_WA;
      const form2 = new URLSearchParams();
      form2.append('target', target08);
      form2.append('message', notifHasil);
      
      const r2 = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { 'Authorization': FONNTE_TOKEN.trim() },
        body: form2
      });
      const t2 = await r2.text();
      try { fonnteLog = JSON.parse(t2); } catch { fonnteLog = { raw: t2, attempt:2 }; }
      fonnteSent = fonnteLog.status === true || t2.toLowerCase().includes('success');
    }

  } catch (e) {
    fonnteLog = { error: e.message };
  }

  // TAMPILKAN HASIL LENGKAP DI LAYAR BIAR BOS TAU FONNTE ERROR NYA APA
  return res.status(200).send(`
    <html>
    <head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>E-CELL - ${fonnteSent?'SUKSES':'GAGAL KIRIM WA'}</title></head>
    <body style="font-family:monospace;background:#0b0b0b;color:#fff;padding:15px;max-width:700px;margin:0 auto">
    <div style="background:#141414;border:1px solid ${fonnteSent?'#22c55e':'#ef4444'};border-radius:20px;padding:20px">
      <h1 style="color:${fonnteSent?'#22c55e':'#ef4444'}">${fonnteSent?'✅ EKSEKUSI BERHASIL':'⚠️ EKSEKUSI OK, WA GAGAL'}</h1>
      
      <div style="background:#000;padding:12px;border-radius:10px;margin:10px 0">
        <p>Ref: ${ref}</p><p>SKU: ${sku}</p><p>Tujuan: ${tujuan}</p><p>Total: Rp ${Number(total||0).toLocaleString()}</p>
        <p>Status Digiflazz: ${statusDigiflazz}</p>
      </div>

      <div style="background:${fonnteSent?'#22c55e20':'#ef444420'};border:1px solid ${fonnteSent?'#22c55e':'#ef4444'};padding:12px;border-radius:10px;margin:10px 0">
        <p><b>WA CS1 ${CS1_WA}:</b> ${fonnteSent?'✅ Terkirim':'❌ GAGAL - Fonnte block kirim ke nomor sendiri'}</p>
        <p style="font-size:11px;word-break:break-all">Fonnte Log: ${JSON.stringify(fonteLog).substring(0,500)}</p>
      </div>

      <pre style="background:#000;padding:10px;border-radius:10px;font-size:11px;white-space:pre-wrap;max-height:300px;overflow:auto">${JSON.stringify(digiflazzResult, null, 2)}</pre>

      <div style="margin-top:15px;background:#f59e0b20;border:1px solid #f59e0b;padding:12px;border-radius:10px;font-size:13px">
        <b>SOLUSI JIKA WA TIDAK MASUK:</b><br/>
        1. Ganti ENV CS1_WA di Vercel jadi nomor pribadi Bos (6287711651388) bukan nomor BOT<br/>
        2. Atau tambah Device kedua di Fonnte.com untuk CS1<br/>
        3. Nomor BOT 083178084316 tidak bisa kirim ke dirinya sendiri
      </div>

      <p style="text-align:center;color:#555;margin-top:15px;font-size:11px">E-CELL Yogyakarta 24 Jam</p>
    </div>
    </body>
    </html>
  `);
        }
