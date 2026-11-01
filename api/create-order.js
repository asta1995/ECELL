// File: /api/create-order.js - E-CELL PRO WARJAYA - LOCKED - Invoice Auto WA BOT CS1
// TOKEN FONNTE: MPy4LpPbAhGQCprjn2iS - KUNCI - JANGAN UBAH SELAIN INI
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

    const waPembeli = (nomorPembeli62 || nomorPembeli).replace(/\D/g,'');
    const wa62 = waPembeli.startsWith('62') ? waPembeli : waPembeli.startsWith('0') ? '62'+waPembeli.slice(1) : '62'+waPembeli;

    // INVOICE AUTO YANG DIKIRIM BOT CS1 KE WA PEMBELI
    const invoiceText = `*INVOICE OTOMATIS E-CELL PRO - WARJAYA*
*Yogyakarta 24 Jam - WA BOT CS1 083178084316*

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
- QRIS: qris-ecell.jpg

✅ *Status: Menunggu Cek Admin*
⏳ Proses 1-5 menit setelah admin cek mutasi A/N WARJAYA

📞 *CS:*
- WA CS 1 (BOT OTOMATIS INI): 083178084316
- CS 2 Backup Email: ecell.yogya@gmail.com

Simpan Ref ID ya Kak untuk cek status!

Terima kasih!
© 2026 E-CELL PRO WARJAYA
*Invoice otomatis dari WA BOT CS1*
`;

    // TOKEN FONNTE BOS - TERKUNCI - JANGAN DIUBAH
    const FONNTE_TOKEN = process.env.FONNTE_TOKEN || 'MPy4LpPbAhGQCprjn2iS';
    
    let waSent = false;
    let waResponse = null;
    
    try {
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
      waResponse = await fonnteRes.json();
      waSent = waResponse.status === true || waResponse.status === 'true' || waResponse.detail === 'success' || waResponse.reason === 'success';
    } catch (e) {
      waResponse = { error: e.message };
    }

    return res.status(200).json({
      success: true,
      ref_id,
      waPembeli: wa62,
      waSent,
      waResponse,
      message: waSent ? `Invoice otomatis terkirim dari WA BOT CS1 083178084316 ke WA Pembeli ${wa62}` : `Order tersimpan, WA BOT: ${JSON.stringify(waResponse)}`,
    });

  } catch (err) {
    return res.status(500).json({error: err.message});
  }
}
