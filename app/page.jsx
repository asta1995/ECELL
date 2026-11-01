"use client";
import { useEffect, useState } from "react";

function HeaderSaldo() {
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const res = await fetch("/api/cek-saldo");
        const data = await res.json();
        setSaldo(data.saldo);
      } catch { setSaldo(0); }
      setLoading(false);
    };
    fetchSaldo();
    const i = setInterval(fetchSaldo, 30000);
    return () => clearInterval(i);
  }, []);
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-black border-b border-zinc-800">
      <h1 className="font-black text-xl tracking-widest">E-CELL PRO</h1>
      <div className={`px-4 py-1.5 rounded-full font-bold text-xs ${loading?'bg-zinc-800': saldo<50000?'bg-red-600 animate-pulse':'bg-green-600'}`}>
        {loading ? 'CEK SALDO...' : `SALDO: Rp ${saldo?.toLocaleString("id-ID")} ${saldo<50000?'⚠️':''}`}
      </div>
    </header>
  );
}

export default function Home() {
  const [noTujuan, setNoTujuan] = useState("");
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refId, setRefId] = useState("");

  const produk = [
    { id: "ax10", name: "AXIS 10rb", price: 11000, sku: "ax10" },
    { id: "ax25", name: "AXIS 25rb", price: 26000, sku: "ax25" },
    { id: "xl10", name: "XL 10rb", price: 11200, sku: "xld10" },
    { id: "ts10", name: "Telkomsel 10rb", price: 11300, sku: "tsel10" },
  ];

  const handleBayar = async () => {
    if(!noTujuan || !selected) return alert("Isi nomor & pilih produk!");
    setLoading(true);
    const newRefId = `ECELL${Date.now()}`;
    setRefId(newRefId);
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ ref_id: newRefId, produk: selected, noTujuan, noPembeli: noTujuan })
    });
    const data = await res.json();
    if(data.success) setStep(3);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <HeaderSaldo />
      <main className="max-w-md mx-auto p-4">
        {step === 1 && (
          <>
            <div className="my-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-xl text-xs">⚠️ Saldo di header live Bos. Kalau merah < 50rb, Bot WA otomatis warning ke 083178084316</div>
            <input value={noTujuan} onChange={e=>setNoTujuan(e.target.value)} placeholder="Nomor Tujuan / WA Pembeli 08xx" className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-4 outline-none" />
            <div className="grid grid-cols-2 gap-3">
              {produk.map(p=>(
                <button key={p.id} onClick={()=>setSelected(p)} className={`p-4 rounded-xl border text-left ${selected?.id===p.id?'bg-white text-black border-white':'bg-zinc-900 border-zinc-800'}`}>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-sm opacity-70">Rp {p.price.toLocaleString()}</div>
                  <div className="text-[10px] opacity-50">{p.sku}</div>
                </button>
              ))}
            </div>
            <button onClick={()=>selected && setStep(2)} disabled={!selected} className="w-full mt-6 p-4 bg-white text-black font-black rounded-xl disabled:opacity-30">LANJUT BAYAR</button>
          </>
        )}

        {step === 2 && (
          <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
            <h2 className="font-bold mb-3">Transfer Manual ke:</h2>
            <div className="bg-black p-4 rounded-xl mb-3 space-y-2">
              <div><div className="text-xs opacity-60">QRIS E-CELL</div><div className="font-bold">Scan QRIS di toko (a/n E-CELL)</div></div>
              <div className="h-[1px] bg-zinc-800"></div>
              <div><div className="text-xs opacity-60">BCA / BRI</div><div className="font-mono font-bold">1234567890 a/n E-CELL (contoh - ganti punya kamu)</div></div>
            </div>
            <div className="flex justify-between mb-4 text-sm"><span>Total:</span><span className="font-black">Rp {selected.price.toLocaleString()}</span></div>
            <div className="flex justify-between mb-6 text-xs opacity-60"><span>Ref ID:</span><span className="font-mono">{`ECELL${Date.now()}`}</span></div>
            <button onClick={handleBayar} disabled={loading} className="w-full p-4 bg-white text-black font-black rounded-xl">{loading?'MENGIRIM BOT WA...':'SAYA SUDAH TRANSFER'}</button>
            <button onClick={()=>setStep(1)} className="w-full mt-3 p-3 bg-transparent text-zinc-400 text-sm">Kembali</button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-16 bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="font-black text-xl">Pembayaran Diterima!</h2>
            <p className="font-mono text-xs bg-black p-2 rounded mt-3">{refId}</p>
            <div className="text-left mt-6 space-y-2 text-sm bg-black p-4 rounded-xl">
              <p>✅ Bot #1: Invoice terkirim ke pembeli {noTujuan}</p>
              <p>✅ Bot #2: Konfirmasi terkirim ke Admin 083178084316</p>
              <p>✅ Bot #3: Cek saldo {`< 50rb`} aktif</p>
            </div>
            <p className="opacity-60 mt-4 text-xs">Mohon bersabar menunggu max 5 menit ya Kak! Admin akan segera eksekusi ke Digiflazz.</p>
            <button onClick={()=>{setStep(1); setSelected(null); setNoTujuan("");}} className="mt-8 w-full p-4 bg-white text-black font-black rounded-xl">BELI LAGI</button>
          </div>
        )}
      </main>
    </div>
  );
        }
