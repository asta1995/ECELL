// Kirim WA pakai Fonnte
async function kirimWA(nomor, pesan) {
  await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: { Authorization: 'TOKEN_FONNTE_KAMU' },
    body: new URLSearchParams({
      target: nomor, // 6283178084316 -> format 6283178084316
      message: pesan,
    })
  })
}

// BOT 1: Notif ke Pembeli setelah upload bukti
async function botInvoicePembeli(noPembeli, ref_id, produk) {
  let pesan = `*E-CELL - Invoice ${ref_id}*\n\n` +
              `✅ Pembayaran diterima!\n` +
              `Produk: ${produk}\n` +
              `Status: Menunggu Verifikasi Admin\n\n` +
              `Mohon bersabar ya Kak, pulsa akan dikirim max 5 menit setelah admin konfirmasi 🙏\n` +
              `Terimakasih sudah belanja di E-CELL!`;
  await kirimWA(noPembeli, pesan)
}

// BOT 2: Konfirmasi ke Admin (kamu)
async function botKonfirmasiAdmin(ref_id, produk, noTujuan, buktiUrl) {
  let pesan = `*ADA ORDER BARU BOS!*\n\n` +
              `Ref: ${ref_id}\n` +
              `Produk: ${produk}\n` +
              `Tujuan: ${noTujuan}\n` +
              `Bukti: ${buktiUrl}\n\n` +
              `Ketik: ECELL KIRIM ${ref_id} untuk eksekusi ke Digiflazz`;
  await kirimWA('6283178084316', pesan) // Nomor admin kamu
}

// BOT 3: Warning Saldo < 50rb
async function botWarningSaldo(saldo) {
  if (saldo < 50000) {
    let pesan = `*⚠️ WARNING SALDO DIGIFLAZZ!*\n\n` +
                `Saldo tinggal: Rp ${saldo}\n` +
                `Segera top-up Bos, di bawah 50rb!\n` +
                `Link: https://member.digiflazz.com/deposit`;
    await kirimWA('6283178084316', pesan)
  }
}
