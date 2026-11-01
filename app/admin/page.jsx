"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState("");

  const fetchSaldo = async () => {
    const res = await fetch("/api/cek-saldo");
    const data = await res.json();
    setSaldo(data.saldo);
  };

  // Simulasi ambil order - ganti dengan DB kamu nanti
  // Untuk sekarang pakai localStorage biar bisa test langsung
  useEffect(() => {
    fetchSaldo();
    // Contoh data dummy - nanti diganti fetch dari DB
    const dummy = JSON.parse(localStorage.getItem("ecell_orders") || "[]");
    setOrders(dummy);
  }, []);

  const handleKirimDigiflazz = async (order) => {
    if(!confirm(`Kirim ${order.produk.name} ke ${order.noTujuan}?`)) return;
    setLoading(order.ref_id);
    try {
      const res = await fetch("/api/execute-digiflazz", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(order)
      });
      const data = await res.json();
      if(data.success){
        alert(`SUKSES! ${data.message}\nSaldo sisa: Rp ${data.saldo}`);
        fetchSaldo();
        // Hapus dari list atau tandai sukses
        const updated = orders.map(o=> o.ref_id===order.ref_id ? {...o, status:"SUKSES"} : o);
        setOrders(updated);
        localStorage.setItem("ecell_orders", JSON.stringify(updated));
      } else {
        alert("GAGAL: " + data.message);
      }
    } catch(e){
      alert("Error: " + e.message);
    }
    setLoading("");
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <header className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
        <h1 className="font-black text-xl">ADMIN E-CELL</h1>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${saldo<50000?'bg-red-600 animate-pulse':'bg-green-600'}`}>
          SALDO: Rp {saldo?.toLocaleString("id-ID") || '...'}
        </div>
      </header>

      {saldo < 50000 && saldo !== null && (
        <div className="bg-red-900 border border-red-700 p-3 rounded-xl mb-4 text-sm animate-pulse">
          ⚠️ SALDO KRITIS! Bot WA sudah warning ke 083178084316 - Segera Topup di Digiflazz!
        </div>
      )}

      <h2 className="font-bold mb-3">Order Masuk ({orders.length})</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <p>Belum ada order Bos.</p>
          <p className="text-xs mt-2">Order baru akan muncul disini + Bot WA otomatis ke 083178084316</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o)=>(
            <div key={o.ref_id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
              <div className="flex justify-between text-xs opacity-60">
                <span className="font-mono">{o.ref_id}</span>
                <span className={o.status==='SUKSES'?'text-green-400':'text-yellow-400'}>{o.status || 'PENDING'}</span>
              </div>
              <div className="font-bold mt-2">{o.produk.name} - Rp {o.produk.price.toLocaleString()}</div>
              <div className="text-sm opacity-80">Tujuan: {o.noTujuan}</div>
              <div className="text-xs opacity-50">WA Pembeli: {o.noPembeli}</div>
              
              {o.status !== 'SUKSES' && (
                <button 
                  onClick={()=>handleKirimDigiflazz(o)}
                  disabled={loading===o.ref_id}
                  className="w-full mt-4 p-3 bg-white text-black font-black rounded-xl disabled:opacity-30"
                >
                  {loading===o.ref_id ? 'MENGIRIM KE DIGIFLAZZ...' : `🚀 KIRIM KE DIGIFLAZZ + WA SUKSES`}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 p-4 bg-zinc-900 rounded-xl text-xs opacity-60">
        <p className="font-bold mb-2">Cara Kerja Bot:</p>
        <p>1. Pembeli klik Sudah Transfer -> Bot #1 & #2 jalan</p>
        <p>2. Kamu buka halaman ini -> Klik KIRIM</p>
        <p>3. Sistem tembak Digiflazz + Bot #4 kirim WA Sukses ke pembeli</p>
      </div>
    </div>
  );
}
