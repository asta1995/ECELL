# E-CELL PRO - Toko Pulsa Otomatis + Bot WA Multifungsi

Toko pulsa digital auto dengan sistem Bot WA 4-in-1 & Live Monitoring Saldo Digiflazz. Dibuat untuk E-CELL, Segoroyoso, Yogyakarta.

Live Demo: https://e-cell.vercel.app

## 🔥 FITUR TERBARU (Update 1 Nov 2026)

### 1. Bot WA Multifungsi (Fonnte)
Bot aktif 24 jam menggunakan API Fonnte (Token: `MPy4Lp...`)

- **BOT #1 - Invoice Pembeli:** Setelah user klik `SAYA SUDAH TRANSFER`, otomatis kirim WA ke pembeli:
  > "✅ Pembayaran diterima! Ref: ECELL... Mohon bersabar menunggu max 5 menit 🙏"

- **BOT #2 - Konfirmasi Admin:** Setiap ada order baru, otomatis kirim WA ke Admin `083178084316` (6283178084316):
  > "🔔 ORDER BARU! Ref: ECELL... Produk: AXIS 10rb Tujuan: 0838... Segera eksekusi di /admin"

- **BOT #3 - Warning Saldo Kritis:** System cek saldo tiap 30 detik via `/api/cek-saldo`. Jika saldo < Rp 50.000, otomatis:
    - Header berkedip merah + `animate-pulse`
    - Kirim WA warning ke Admin `083178084316`

- **BOT #4 - Sukses Transaksi:** Setelah Admin klik `KIRIM KE DIGIFLAZZ` di `/admin`, otomatis kirim WA sukses + SN ke pembeli.

### 2. Header Live Saldo Digiflazz
- Komponen `HeaderSaldo()` di `app/page.jsx`
- Sticky top, auto refresh 30 detik
- Warna: `bg-green-600` = Aman, `bg-red-600 animate-pulse` = Kritis < 50rb
- Endpoint: `/api/cek-saldo` -> `https://api.digiflazz.com/v1/cek-saldo`

### 3. Admin Panel 1-Klik (`/admin`)
- List order pending (dari memory / Vercel KV)
- Tombol `🚀 KIRIM KE DIGIFLAZZ + WA SUKSES`
- 1 klik = Tembak Digiflazz API + Kirim WA sukses ke pembeli + Update saldo

## 📁 STRUKTUR PROJECT FINAL
