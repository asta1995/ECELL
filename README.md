# E-CELL PRO

Toko pulsa otomatis + Bot WA multifungsi.  
Live: https://ecell-theta-ten.vercel.app/  
GitHub Pages: https://asta1995.github.io/ECELL/

## Fitur
- Header Saldo LIVE - Auto refresh 30 detik, merah kedip jika < 50rb
- Bot WA #1 Invoice - Kirim invoice ke WA pembeli setelah transfer
- Bot WA #2 Admin - Kirim order baru ke Admin 083178084316
- Bot WA #3 Warning - Warning saldo kritis ke Admin
- Bot WA #4 Sukses - Kirim SN + status sukses ke pembeli
- Admin 1-Klik - /admin untuk eksekusi Digiflazz

## Setup Vercel Env
FONNTE_TOKEN=MPy4LpPbAhGQCprjn2iS
ADMIN_WA=6283178084316
DIGIFLAZZ_USER=zebewaDzQQlo
DIGIFLAZZ_APIKEY=isi_api_key_asli
NEXT_PUBLIC_BASE_URL=https://ecell-theta-ten.vercel.app

## Alur
Pembeli Bayar -> Bot Invoice ke Pembeli + Bot Konfirmasi ke 083178084316 -> Admin buka /admin -> Klik KIRIM -> Digiflazz + Bot Sukses ke Pembeli

## Struktur File
app/page.jsx - Index final + Header Saldo
app/admin/page.jsx - Admin panel
app/api/cek-saldo - Cek saldo Digiflazz
app/api/create-order - Create order + Bot 1&2
app/api/execute-digiflazz - Tembak Digiflazz + Bot 4
app/api/get-orders - Simpan order
lib/wa.js - Fungsi kirimWA
index.html - Versi GitHub Pages (API ke ecell-theta-ten.vercel.app)

## Deploy
npm i && npm i md5
vercel --prod

Admin: 083178084316 | Segoroyoso, Bantul DIY
