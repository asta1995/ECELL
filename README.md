# E-CELL - Digital Pulsa Store Pro

Toko pulsa otomatis dengan Bot WA Multifungsi & Live Saldo Digiflazz.

## 🔥 Fitur Terbaru (Update Nov 2026)

### 1. Bot WA Multifungsi (Fonnte)
- **BOT #1 - Invoice Pembeli:** Setelah upload bukti transfer, otomatis kirim WA ke pembeli: "Pembayaran diterima, mohon bersabar menunggu max 5 menit"
- **BOT #2 - Konfirmasi Admin:** Setiap ada order baru, otomatis kirim WA ke Admin `083178084316` dengan detail Ref, Produk, Tujuan + Link Eksekusi
- **BOT #3 - Warning Saldo:** Jika saldo Digiflazz < Rp 50.000, otomatis kirim warning ke Admin tiap 30 detik + header berkedip merah

### 2. Header Live Saldo
- Tampil di header sticky, auto refresh tiap 30 detik
- Hijau = Aman, Merah Berkedip + Pulse = Kritis < 50rb
- Endpoint: `/api/cek-saldo` -> Digiflazz API `cek-saldo`

### 3. Alur Order
`Pilih Produk -> Input No Tujuan -> Bayar QRIS/Rek -> Upload Bukti -> BOT WA -> Admin Konfirmasi 1 Klik -> Tembak Digiflazz -> Pulsa Masuk`

## ⚙️ Setup Environment Variables di Vercel

Wajib pasang di Vercel -> Settings -> Environment Variables:
