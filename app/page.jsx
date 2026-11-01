"use client";
import { useEffect, useState } from "react";

// --- HEADER SALDO LIVE ---
function HeaderSaldo() {
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchSaldo = async () => {
    try {
      const res = await fetch("/api/cek-saldo");
      const data = await res.json();
      setSaldo(data.saldo);
    } catch { setSaldo(0); }
    setLoading(false);
  };

  useEffect(() => {
    fetchSaldo();
    const interval = setInterval(fetchSaldo, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-black border-b border-zinc-800">
      <h1 className="font-black text-xl tracking-widest">E-CELL PRO</h1>
      <div className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all ${loading ? 'bg-zinc-800 text-zinc-400' : saldo < 50000 ? 'bg-red-600 animate-pulse text-white' : 'bg-green-600 text-white'}`}>
        {loading ? '● CEK SALDO...' : `Rp ${saldo?.toLocaleString("id-ID")} ${saldo < 50000 ? '⚠️' : '● LIVE'}`}
      </div>
    </header>
  );
}

// --- PAGE UTAMA ---
export default function Home() {
  const [noTujuan, setNoTujuan] = useState("");
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(1); // 1 pilih, 2 bayar, 3 sukses
  const [loading, setLoading] = useState(false);
  const [refId, setRefId] = useState("");

  const produk = [
    { id: "ax10", name: "AXIS 10rb", price: 11000, sku: "ax10", desc: "5-10 menit" },
    { id: "ax25", name: "AXIS 25rb", price: 26000, sku: "ax25", desc: "5-10 menit" },
    { id: "xl10", name: "XL 10rb", price: 11200, sku: "xld10", desc: "5-10 menit" },
    { id: "xl25", name: "XL 25rb", price: 26200, sku: "xld25", desc: "5-10 menit" },
    { id: "ts10", name: "Telkomsel 10rb", price: 11300, sku: "tsel10", desc: "5-10 menit" },
    { id: "is10", name: "Indosat 10rb", price: 11200, sku: "is10", desc: "5-10 menit" },
  ];

  const handleBayar = async () => {
    if (!noTujuan || !selected) return alert("Isi nomor tujuan & pilih produk Bos!");
    if (noTujuan.length < 10) return alert("Nomor HP tidak valid Bos!");
    
    setLoading(true);
    const newRefId = `ECELL${Date.now()}`;
    setRefId(newRefId);

    const orderData = {
      ref_id: newRefId,
      produk: selected,
      noTujuan: noTujuan,
      noPembeli: noTujuan, // Asumsi WA pembeli = no tujuan, bisa ditambah input terpisah
    };

    try {
      // 1. Kirim ke API (yang akan trigger Bot WA 1 & 2)
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();

      if (data.success) {
        // 2. SIMPAN KE LOCALSTORAGE BIAR MUNCUL DI /admin (PENTING!)
        const oldOrders = JSON.parse(localStorage.getItem("ecell_orders") || "[]");
        const newOrder = {
          ...orderData,
          status: "PENDING",
          createdAt: new Date().toISOString(),
        };
        oldOrders.unshift(newOrder);
        localStorage.setItem("ecell_orders", JSON.stringify(oldOrders));

        setStep(3);
      } else {
        alert("Gagal buat order: " + data.message);
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white selection:text-black">
      <HeaderSaldo />

      <main className="max-w-md mx-auto p-4 pb-20">
        {/* STEP 1 - PILIH PRODUK */}
        {step === 1 && (
          <>
            <div className="my-4 p-3 bg-yellow-900/30 border border-yellow-800 rounded-xl text-[11px] leading-relaxed">
              ⚠️ <b>INFO SALDO:</b> Saldo di header live Bos. Kalau merah &lt; 50rb, Bot WA otomatis warning ke Admin 083178084316
            </div>

            <label className="text-xs opacity-60 mb-2 block">Nomor Tujuan / No WA Pembeli</label>
            <input
              value={noTujuan}
              onChange={(e) => setNoTujuan(e.target.value)}
              placeholder="Contoh: 083178084316"
              type="tel"
              className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-5 outline-none focus:border-white transition-all font-mono"
            />

            <label className="text-xs opacity-60 mb-2 block">Pilih Produk</label>
            <div className="grid grid-cols-2 gap-3">
              {produk.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selected?.id === p.id ? "bg-white text-black border-white scale-[0.98]" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="font-black text-sm">{p.name}</div>
                  <div className="text-xs opacity-70 mt-1">Rp {p.price.toLocaleString("id-ID")}</div>
                  <div className="text-[10px] opacity-40 mt-1">{p.sku} • {p.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => selected && noTujuan && setStep(2)}
              disabled={!selected || !noTujuan}
              className="w-full mt-6 p-4 bg-white text-black font-black rounded-xl disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              LANJUT BAYAR
            </button>

            <p className="text-center text-[10px] opacity-30 mt-4">E-CELL PRO • Bot WA Multifungsi Aktif</p>
          </>
        )}

        {/* STEP 2 - BAYAR */}
        {step === 2 && (
          <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 animate-in fade-in">
            <h2 className="font-black mb-1">Konfirmasi Pembayaran</h2>
            <p className="text-xs opacity-60 mb-4">Transfer sesuai nominal agar bot otomatis verifikasi</p>

            <div className="bg-black p-4 rounded-xl mb-4 space-y-3 border border-zinc-800">
              <div>
                <div className="text-[10px] opacity-60 tracking-widest">QRIS E-CELL (Rekomendasi)</div>
                <div className="font-bold text-sm mt-1">Scan QRIS di Toko</div>
                <div className="text-xs opacity-50">a/n E-CELL PRO</div>
              </div>
              <div className="h-[1px] bg-zinc-800"></div>
              <div>
                <div className="text-[10px] opacity-60 tracking-widest">TRANSFER BANK</div>
                <div className="font-mono font-bold text-sm mt-1">BCA 1234567890</div>
                <div className="text-xs opacity-50">a/n E-CELL (Ganti dengan rek kamu Bos)</div>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between"><span className="opacity-60">Produk:</span><span className="font-bold">{selected.name}</span></div>
              <div className="flex justify-between"><span className="opacity-60">Tujuan:</span><span className="font-mono font-bold">{noTujuan}</span></div>
              <div className="flex justify-between"><span className="opacity-60">Total Bayar:</span><span className="font-black text-base">Rp {selected.price.toLocaleString("id-ID")}</span></div>
              <div className="flex justify-between text-xs"><span className="opacity-40">Ref ID:</span><span className="font-mono opacity-60">ECELL...</span></div>
            </div>

            <button onClick={handleBayar} disabled={loading} className="w-full p-4 bg-white text-black font-black rounded-xl active:scale-95 transition-all disabled:opacity-30">
              {loading ? 'MENGIRIM BOT WA...' : 'SAYA SUDAH TRANSFER'}
            </button>
            <button onClick={() => setStep(1)} className="w-full mt-3 p-3 bg-transparent text-zinc-400 text-sm">← Kembali Pilih Produk</button>
          </div>
        )}

        {/* STEP 3 - SUKSES */}
        {step === 3 && (
          <div className="text-center py-8 bg-zinc-900 rounded-2xl border border-zinc-800 p-6 animate-in fade-in">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="font-black text-xl">Pembayaran Diterima!</h2>
            <p className="font-mono text-xs bg-black border border-zinc-800 p-3 rounded-xl mt-4 select-all">{refId}</p>

            <div className="text-left mt-6 space-y-2.5 text-[13px] bg-black p-4 rounded-xl border border-zinc-800">
              <p className="flex gap-2"><span>✅</span><span>Bot #1: Invoice terkirim ke WA pembeli <b>{noTujuan}</b></span></p>
              <p className="flex gap-2"><span>✅</span><span>Bot #2: Konfirmasi terkirim ke Admin <b>083178084316</b></span></p>
              <p className="flex gap-2"><span>✅</span><span>Bot #3: Monitoring saldo {'< 50rb'} aktif</span></p>
            </div>

            <p className="opacity-60 mt-5 text-xs leading-relaxed">Mohon bersabar menunggu max 5 menit ya Kak! Admin akan segera eksekusi ke Digiflazz. Pulsa akan masuk otomatis + WA sukses.</p>

            <button onClick={() => { setStep(1); setSelected(null); setNoTujuan(""); setRefId(""); }} className="mt-8 w-full p-4 bg-white text-black font-black rounded-xl active:scale-95 transition-all">
              BELI LAGI
            </button>
            <a href="/admin" className="block mt-3 text-xs opacity-40 underline">Masuk sebagai Admin (083178084316)</a>
          </div>
        )}
      </main>
    </div>
  );
}
