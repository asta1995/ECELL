"use client";
import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

const produkList = [
  { id: "ax10", name: "AXIS 10rb", price: 11000, sku: "ax10" },
  { id: "ax25", name: "AXIS 25rb", price: 26000, sku: "ax25" },
  { id: "xl10", name: "XL 10rb", price: 11200, sku: "xld10" },
  { id: "xl25", name: "XL 25rb", price: 26200, sku: "xld25" },
  { id: "ts10", name: "Telkomsel 10rb", price: 11300, sku: "tsel10" },
  { id: "is10", name: "Indosat 10rb", price: 11200, sku: "is10" },
];

export default function Home() {
  const [noTujuan, setNoTujuan] = useState("");
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(1);
  const [refId, setRefId] = useState("");
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSaldo = async () => {
    try {
      const res = await fetch("/api/cek-saldo");
      const data = await res.json();
      setSaldo(data.saldo);
    } catch {
      setSaldo(null);
    }
  };

  useEffect(() => {
    fetchSaldo();
    const iv = setInterval(fetchSaldo, 30000);
    return () => clearInterval(iv);
  }, []);

  const bayar = async () => {
    setLoading(true);
    const ref_id = `ECELL${Date.now()}`;
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ref_id,
          produk: selected,
          noTujuan,
          noPembeli: noTujuan,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRefId(ref_id);
        setStep(3);
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* HEADER SALDO LIVE */}
      <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-black border-b border-zinc-800">
        <div>
          <h1 className="font-black text-xl tracking-widest">E-CELL PRO</h1>
          <p className="text-[10px] opacity-40 -mt-1">ecell-theta-ten.vercel.app</p>
        </div>
        <div
          className={`px-4 py-1.5 rounded-full font-bold text-xs ${
            saldo === null
              ? "bg-zinc-800 text-zinc-400"
              : saldo < 50000
              ? "bg-red-600 animate-pulse text-white"
              : "bg-green-600 text-white"
          }`}
        >
          {saldo === null ? "CEK SALDO..." : `Rp ${saldo.toLocaleString()} ${saldo < 50000 ? "⚠️" : "● LIVE"}`}
        </div>
      </header>

      <div className="max-w-md mx-auto p-4">
        <div className="my-3 p-3 bg-yellow-900/30 border border-yellow-800 rounded-xl text-[11px]">
          ⚠️ Saldo LIVE Bos - Jika merah &lt;50rb, Bot WA otomatis warning ke 083178084316
        </div>

        {step === 1 && (
          <>
            <label className="text-xs opacity-60">Nomor Tujuan / WA Pembeli</label>
            <input
              value={noTujuan}
              onChange={(e) => setNoTujuan(e.target.value)}
              placeholder="083178084316"
              className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 mt-1 mb-4 outline-none focus:border-white font-mono"
            />
            <label className="text-xs opacity-60">Pilih Produk</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              {produkList.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selected?.id === p.id ? "bg-white text-black border-white scale-[0.98]" : "bg-zinc-900 border-zinc-800"
                  }`}
                >
                  <div className="font-black text-sm">{p.name}</div>
                  <div className="text-xs opacity-70">Rp {p.price.toLocaleString()}</div>
                  <div className="text-[10px] opacity-40">{p.sku}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (!noTujuan || !selected) return alert("Isi nomor & pilih produk Bos!");
                setStep(2);
              }}
              className="w-full mt-6 p-4 bg-white text-black font-black rounded-xl"
            >
              LANJUT BAYAR
            </button>
            <p className="text-center text-[10px] opacity-30 mt-4">Bot WA Multifungsi Aktif • Analytics On</p>
          </>
        )}

        {step === 2 && (
          <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
            <h2 className="font-black mb-3">Transfer ke:</h2>
            <div className="bg-black p-4 rounded-xl mb-4 border border-zinc-800">
              <div className="text-xs">QRIS E-CELL PRO / BCA 1234567890</div>
              <div className="text-[10px] opacity-40 mt-1">Ganti dengan rek asli kamu Bos</div>
            </div>
            <div className="flex justify-between mb-6">
              <span>Total:</span>
              <span className="font-black">Rp {selected?.price.toLocaleString()}</span>
            </div>
            <button onClick={bayar} disabled={loading} className="w-full p-4 bg-white text-black font-black rounded-xl">
              {loading ? "MENGIRIM BOT WA..." : "SAYA SUDAH TRANSFER"}
            </button>
            <button onClick={() => setStep(1)} className="w-full mt-3 p-2 text-zinc-400 text-sm">Kembali</button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8 bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="font-black text-xl">Pembayaran Diterima!</h2>
            <p className="font-mono text-xs bg-black border border-zinc-800 p-3 rounded-xl mt-4">{refId}</p>
            <div className="text-left mt-6 space-y-2 text-[13px] bg-black p-4 rounded-xl border border-zinc-800">
              <p>✅ Bot #1: Invoice terkirim ke WA pembeli</p>
              <p>✅ Bot #2: Konfirmasi terkirim ke Admin 083178084316</p>
              <p>✅ Bot #3: Monitoring saldo aktif</p>
            </div>
            <button onClick={() => { setStep(1); setSelected(null); setNoTujuan(""); }} className="mt-8 w-full p-4 bg-white text-black font-black rounded-xl">
              BELI LAGI
            </button>
            <a href="/admin" className="block mt-3 text-xs opacity-40 underline">Masuk Admin Panel</a>
          </div>
        )}
      </div>
      <Analytics />
    </main>
  );
}
