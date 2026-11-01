import { NextResponse } from "next/server";
import md5 from "md5";
import { kirimWA } from "@/lib/wa.js";

export async function POST(req) {
  const { ref_id, produk, noTujuan, noPembeli } = await req.json();
  const user = process.env.DIGIFLAZZ_USER;
  const apiKey = process.env.DIGIFLAZZ_APIKEY;
  const sign = md5(user + apiKey + ref_id);

  const digiRes = await fetch("https://api.digiflazz.com/v1/transaction", {
    method: "POST", headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ username: user, buyer_sku_code: produk.sku, customer_no: noTujuan, ref_id, sign })
  });
  const digiData = await digiRes.json();

  // Anggap sukses kalau status Sukses/Pending (Digiflazz proses async)
  if (digiData?.data) {
    const target = noPembeli.replace(/^0/,"62");
    const pesan = `*E-CELL SUKSES ✅*\n\nRef: ${ref_id}\nProduk: ${produk.name}\nNo: ${noTujuan}\nSN: ${digiData.data.sn || '-'}\n\nPulsa sudah masuk Kak! Makasih 🙏`;
    await kirimWA(target, pesan);
    
    // Update status order di KV/memory (sementara)
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/get-orders`, { method: 'POST', body: JSON.stringify({ ref_id, status: 'SUKSES' }) }).catch(()=>{});

    return NextResponse.json({ success: true, message: `${produk.name} ke ${noTujuan} diproses Digiflazz`, raw: digiData });
  }
  return NextResponse.json({ success: false, message: digiData?.data?.message || 'Gagal', raw: digiData });
}
