"use client";
import { useEffect, useState } from "react";
export default function HeaderSaldo() {
  const [saldo, setSaldo] = useState(null);
  useEffect(() => {
    fetch("/api/cek-saldo").then(r=>r.json()).then(d=>setSaldo(d.saldo));
    const i = setInterval(()=>{ fetch("/api/cek-saldo").then(r=>r.json()).then(d=>setSaldo(d.saldo)) }, 60000);
    return ()=>clearInterval(i);
  }, []);
  return (
    <div className={`px-4 py-2 rounded-full font-bold text-sm ${saldo===null?'bg-gray-700': saldo<50000?'bg-red-600 animate-pulse':'bg-green-600'} text-white`}>
      {saldo===null ? 'Cek Saldo...' : `Saldo: Rp ${saldo.toLocaleString("id-ID")} ${saldo<50000?'⚠️ TOPUP!':''}`}
    </div>
  );
}
