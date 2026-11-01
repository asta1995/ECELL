"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [saldo, setSaldo] = useState(null);
  const [loadingId, setLoadingId] = useState("");

  const loadData = async () => {
    const s = await fetch("/api/cek-saldo").then(r=>r.json());
    setSaldo(s.saldo);
    const o = await fetch("/api/get-orders").then(r=>r.json());
    setOrders(o.orders || []);
  };

  useEffect(()=>{ loadData(); }, []);

  const kirim = async (order) => {
    if(!confirm(`Kirim ${order.produk.name} ke ${order.noTujuan}?`)) return;
    setLoadingId(order.ref_id);
    const res = await fetch("/api/execute-digiflazz", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify(order)
    });
    const data = await res.json();
    alert(data.success ? `SUKSES BOS! ${data.message}` : `GAGAL: ${data.message}`);
    setLoadingId(""); loadData();
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center py-4 border-b border-zinc-800 mb-4">
        <h1 className="font-black">ADMIN E-CELL</h1>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${saldo<50000?'bg-red-600 animate-pulse':'bg-green-600'}`}>Rp {saldo?.toLocaleString() || '...'}</div>
      </div>
      {saldo<50000 && saldo!==null && <div className="bg-red-900 border border-red-600 p-3 rounded-xl mb-4 text-sm">⚠️ SALDO KRITIS! WA Warning sudah terkirim ke 083178084316</div>}
      <h2 className="font-bold mb-3">Order Pending ({orders.filter(o=>o.status!=='SUKSES').length})</h2>
      {orders.length===0 ? <div className="py-20 text-center opacity-40">Belum ada order. Coba order di halaman depan Bos.</div> :
        <div className="space-y-3">
          {orders.map(o=>(
            <div key={o.ref_id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
              <div className="flex justify-between text-[10px] font-mono opacity-50"><span>{o.ref_id}</span><span className={o.status==='SUKSES'?'text-green-400':'text-yellow-400'}>{o.status}</span></div>
              <div className="font-bold mt-1">{o.produk.name} → {o.noTujuan}</div>
              <div className="text-xs opacity-60">WA: {o.noPembeli} • Rp {o.produk.price.toLocaleString()}</div>
              {o.status!=='SUKSES' && <button onClick={()=>kirim(o)} disabled={loadingId===o.ref_id} className="w-full mt-3 p-3 bg-white text-black font-black rounded-xl">{loadingId===o.ref_id?'PROSES...':'🚀 KIRIM KE DIGIFLAZZ + WA SUKSES'}</button>}
            </div>
          ))}
        </div>
      }
    </div>
  );
}
