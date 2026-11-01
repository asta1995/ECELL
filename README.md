#E-CELL - Toko Pulsa & PPOB Segoroyoso

Website resmi E-CELL - Jual Pulsa, Paket Data, Token Listrik, Topup Game Murah.  
Live: https://asta1995.github.io/ECELL/  
Admin Panel (Vercel): https://e-cell.vercel.app/admin

🔥 UPDATE BESAR - 1 Nov 2026 - BOT WA MULTIFUNGSI

Sekarang E-CELL sudah support Bot WA Otomatis 4-in-1 pakai Fonnte!

Bot yang Aktif:
1. **BOT Invoice Pembeli (Otomatis):** Setelah pembeli transfer & klik "Saya Sudah Transfer", bot otomatis kirim WA:
   > "✅ Pembayaran diterima! Invoice ECELLxxx - Mohon bersabar menunggu max 5 menit"

2. **BOT Konfirmasi Admin (083178084316):** Setiap ada order masuk, bot kirim WA ke Admin:
   > "🔔 ORDER BARU! Produk: AXIS 10rb - Tujuan: 0838xxx - Ref: ECELLxxx - Cek di /admin"

3. **BOT Warning Saldo < 50rb:** Header website tampilkan saldo Digiflazz LIVE. Jika < 50rb:
   - Header jadi MERAH BERKEDIP
   - Bot otomatis warning ke Admin: "⚠️ SALDO KRITIS! Segera Topup!"

4. **BOT Sukses Transaksi:** Setelah Admin klik KIRIM di /admin, bot kirim WA sukses + SN ke pembeli.

Tampilan Saldo di Header:
- Lokasi: Header sticky top (E-CELL PRO)
- Auto refresh tiap 30 detik via `/api/cek-saldo`
- Hijau = Aman, Merah Pulse = Kritis

📁 File Penting

http://index.html -> Landing Page utama (GitHub Pages)
app/page.jsx -> Versi Vercel http://Next.js dengan Header Saldo Live
app/admin/page.jsx -> Admin Panel 1-Klik Kirim Digiflazz
app/api/
  cek-saldo/route.js
  create-order/route.js
  execute-digiflazz/route.js
  get-orders/route.js
lib/wa.js -> Fungsi kirimWA + 4 Bot

⚙️ Cara Pasang Bot WA (Fonnte)

1. Daftar di https://fonnte.com
2. Connect WA Admin 083178084316
3. Copy Token: `MPy4LpPbAhGQCprjn2iS`
4. Pasang di Vercel Env:
FONNTE_TOKEN=MPy4LpPbAhGQCprjn2iS
ADMIN_WA=6283178084316
DIGIFLAZZ_USER=zebewaDzQQlo
DIGIFLAZZ_APIKEY=isi_api_key

🚀 Deploy

- GitHub Pages: Otomatis dari branch `main` -> `index.html`
- Vercel (Bot & Admin): Connect repo yang sama, tapi root `app` Next.js

📱 Hubungi Admin E-CELL

- WA Admin: 083178084316
- Lokasi: Segoroyoso, Bantul, DIY
- Buka: 08.00 - 22.00 WIB

---
© 2026 E-CELL PRO - Bot WA Multifungsi Aktif
