export async function kirimWA(target, message) {
  const form = new URLSearchParams({ target, message, countryCode: "62" });
  const res = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: { Authorization: process.env.FONNTE_TOKEN },
    body: form,
  });
  return res.json();
}

export async function botInvoicePembeli(noPembeli, ref_id, produk, noTujuan) {
  const pesan = `*E-CELL - INVOICE ${ref_id}*\n\n✅ *Pembayaran Diterima!*\nProduk: ${produk}\nNo Tujuan: ${noTujuan}\nStatus: Menunggu Verifikasi Admin\n\nMohon bersabar ya Kak, pulsa/data akan diproses max 5 menit 🙏\nTerimakasih sudah belanja di E-CELL!`;
  // ubah 08 jadi 62
  let target = noPembeli.replace(/^0/, "62");
  return kirimWA(target, pesan);
}

export async function botKonfirmasiAdmin(ref_id, produk, noTujuan, nominal) {
  const pesan = `*🔔 ORDER BARU E-CELL*\n\nRef: ${ref_id}\nProduk: ${produk}\nTujuan: ${noTujuan}\nBayar: Rp ${nominal}\n\nSegera cek & eksekusi di Admin Panel:\nhttps://e-cell.vercel.app/admin\n\nBalas: KIRIM ${ref_id}`;
  return kirimWA(process.env.ADMIN_WA, pesan);
}

export async function botWarningSaldo(saldo) {
  if (saldo < 50000) {
    const pesan = `*⚠️ WARNING SALDO DIGIFLAZZ KRITIS!*\n\nSaldo tinggal: Rp ${saldo.toLocaleString("id-ID")}\nSegera top-up Bos sebelum kehabisan!\n\nLink: https://member.digiflazz.com/deposit`;
    return kirimWA(process.env.ADMIN_WA, pesan);
  }
}
