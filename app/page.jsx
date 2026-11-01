"use client";
import { useEffect, useState } from "react";

// --- HEADER SALDO COMPONENT ---
function HeaderSaldo() {
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSaldo = async () => {
    try {
      const res = await fetch("/api/cek-saldo");
      const data = await res.json();
      setSaldo(data.saldo);
    } catch(e){ setSaldo(0) }
    setLoading(false);
  };

  useEffect(() => {
    fetchSaldo();
    const interval = setInterval(fetchSaldo, 30000); // cek tiap 30 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-black border-b border-zinc-800">
      <h1 className="font-black text-xl text-white tracking-widest">E-CELL</h1>
      <div className={`px-4 py-1.5 rounded-full font-bold text-xs md:text-sm transition-all ${loading ? 'bg-zinc-800 text-zinc-400' : saldo < 50000 ? 'bg-red-600 animate-pulse text-white' : 'bg-green-600 text-white'}`}>
        {loading ? '● CEK SALDO...' : `Rp ${saldo?.toLocaleString("id-ID")} ${saldo < 50000 ? '⚠️' : '● LIVE'}`}
      </div>
    </header>
  );
}

// --- MAIN PAGE ---
export default function Home() {
  const [noTujuan, setNoTujuan] = useState("");
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(1); // 1 pilih produk, 2 bayar, 3 upload
  const [loading, setLoading] = useState(false);

  const produk = [
    { id: "ax10", name: "AXIS 10rb", price: 11000, sku: "ax10" },
    { id: "ax25", name: "AXIS 25rb", price: 26000, sku: "ax25" },
    { id: "xl10", name: "XL 10rb", price: 11200, sku: "xld10" },
    { id: "ts10", name: "Telkomsel 10rb", price: 11300, sku: "tsel10" },
  ];

  const handleBayar = async () => {
    if(!noTujuan || !selected) return alert("Isi nomor & pilih produk Bos!");
    setLoading(true);
    const ref_id = `ECELL${Date.now()}`;
    
    // 1. Simpan order + kirim WA Bot
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ ref_id, produk: selected, noTujuan, noPembeli: noTujuan })
    });
    const data = await res.json();
    
    if(data.success){
      setStep(3);
      alert(`Invoice ${ref_id} dibuat! Silahkan transfer & upload bukti.`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <HeaderSaldo />
      
      <main className="max-w-md mx-auto p-4">
        {step === 1 && (
          <>
            <input value={noTujuan} onChange={e=>setNoTujuan(e.target.value)} placeholder="Nomor Tujuan 0838xxxx" className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-4 outline-none focus:border-white" />
            <div className="grid grid-cols-2 gap-3">
              {produk.map(p=>(
                <button key={p.id} onClick={()=>setSelected(p)} className={`p-4 rounded-xl border text-left ${selected?.id===p.id?'bg-white text-black border-white':'bg-zinc-900 border-zinc-800'}`}>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-sm opacity-70">Rp {p.price.toLocaleString()}</div>
                </button>
              ))}
            </div>
            <button onClick={()=>selected && setStep(2)} className="w-full mt-6 p-4 bg-white text-black font-black rounded-xl">LANJUT BAYAR</button>
          </>
        )}

        {step === 2 && (
          <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
            <h2 className="font-bold mb-3">Transfer ke:</h2>
            <div className="bg-black p-3 rounded-xl mb-3">
              <div className="text-xs opacity-60">QRIS / BCA</div>
              <div className="font-mono font-bold">QRIS E-CELL (scan di kasir) / 1234567890 a/n E-CELL</div>
            </div>
            <div className="flex justify-between mb-4">
              <span>Total Bayar:</span><span className="font-black">Rp {selected.price.toLocaleString()} - {`ECELL${Date.now()}`.slice(-3)}</span>
            </div>
            <button onClick={handleBayar} disabled={loading} className="w-full p-4 bg-white text-black font-black rounded-xl">{loading?'PROSES...':'SAYA SUDAH TRANSFER'}</button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="font-black text-xl">Pembayaran Diterima!</h2>
            <p className="opacity-60 mt-2 text-sm">Bot WA sudah kirim invoice ke nomor kamu & konfirmasi ke admin 083178084316. Mohon bersabar max 5 menit ya Kak!</p>
            <button onClick={()=>setStep(1)} className="mt-8 w-full p-4 bg-zinc-800 rounded-xl">Beli Lagi</button>
          </div>
        )}
      </main>
    </div>
  );
}
