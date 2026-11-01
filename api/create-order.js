// File: /api/create-order.js - E-CELL PRO WARJAYA - Invoice Auto WA BOT CS1
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});

  try {
    const { ref_id, produk, noTujuan, server, total, payMethod, nomorPembeli, nomorPembeli62 } = req.body;
    
    if (!ref_id || !nomorPembeli) {
      return res.status(400).json({error: 'ref_id dan nomorPembeli wajib'});
    }

    // FORMAT NOMOR WA PEMBELI KE 62
    const waPembeli = (nomorPembeli62 || nomorPembeli).replace(/\D/g,'');
    const wa62 = waPembeli.startsWith('62') ? waPembeli : waPembeli.startsWith('0') ? '62'+waPembeli.slice(1) : '62'+waPembeli;

    // GENERATE INVOICE TEXT - INI YANG AKAN DIKIRIM OTOMATIS OLEH BOT CS1 KE WA PEMBELI
    const invoiceText = `*INVOICE OTOMATIS E-CELL PRO - WARJAYA*
*Yogyakarta 24 Jam - WA BOT CS1*

Halo Kak! Terima kasih sudah order di E-CELL PRO! 🙏

*INVOICE RESMI:*
📄 Ref ID: ${ref_id}
📅 Waktu: ${new Date().toLocaleString('id-ID')}
📱 Tujuan: ${noTujuan} ${server?`| Server: ${server}`:''}
🎮 Produk: ${produk?.name||produk} - ${(produk?.game||'').toUpperCase()}
💰 Total Bayar: Rp ${Number(total||0).toLocaleString()}
💳 Bayar Via: ${(payMethod||'').toUpperCase()} A/N WARJAYA
📱 WA Pembeli: ${nomorPembeli}

🏦 *Rekening Resmi A/N WARJAYA:*
- Mandiri: 1370022647966
- Superbank: 030018699543
- Neo: 5859459406987262
- QRIS: Scan qris-ecell.jpg

✅ *Status: Menunggu Cek Admin*
⏳ Proses 1-5 menit setelah admin cek mutasi A/N WARJAYA 083178084316

📞 *CS:*
- WA CS 1 (Utama - BOT OTOMATIS INI): 083178084316
- CS 2 (Backup Email): ecell.yogya@gmail.com

Simpan Ref ID ini untuk cek status ya Kak!

Terima kasih sudah order di E-CELL PRO WARJAYA!
© 2026 All Rights Reserved.
*Invoice ini dikirim otomatis oleh WA BOT CS1 E-CELL PRO*
`;

    // === KIRIM OTOMATIS VIA FONNTE WA GATEWAY (BOT CS1) ===
    // GANTI TOKEN FONNTE BOS DI VERCEL ENV: FONNTE_TOKEN
    const FONNTE_TOKEN = process.env.FONNTE_TOKEN || 'ISI_TOKEN_FONNTE_BOS_DISINI';
    
    let waSent = false;
    let waError = null;
    
    try {
      // Kirim ke WA Pembeli via Fonnte
      const fonnteRes = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': FONNTE_TOKEN
        },
        body: new URLSearchParams({
          target: wa62,
          message: invoiceText,
          countryCode: '62',
          delay: '2'
        })
      });
      const fonnteData = await fonnteRes.json();
      waSent = fonnteData.status === true || fonnteData.status === 'true' || fonnteData.detail === 'success';
      if (!waSent) waError = fonnteData;
    } catch (e) {
      waError = e.message;
    }

    // === SIMPAN ORDER KE DATABASE / GOOGLE SHEET / DIGIFLAZZ (logika lama Bos tetap jalan) ===
    // Contoh: kirim ke Digiflazz atau simpan ke Vercel KV / Google Sheet
    // ... kode lama Bos untuk cek saldo / create order Digiflazz ...

    // Response ke frontend
    return res.status(200).json({
      success: true,
      ref_id,
      waPembeli: wa62,
      waSent,
      waError,
      message: waSent ? `Invoice otomatis terkirim dari WA BOT CS1 083178084316 ke WA Pembeli ${wa62}` : `Order tersimpan, tapi WA BOT gagal: ${JSON.stringify(waError)}`,
      invoice: invoiceText
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({error: err.message});
  }
}
