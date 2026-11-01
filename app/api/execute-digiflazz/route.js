import { NextResponse } from "next/server";
import md5 from "md5";
import { kirimWA } from "@/lib/wa.js";

export async function POST(req) {
  try {
    const { ref_id, produk, noTujuan, noPembeli } = await req.json();
    
    const user = process.env.DIGIFLAZZ_USER;
    const apiKey = process.env.DIGIFLAZZ_APIKEY;
    const sign = md5(user + apiKey + ref_id);

    // 1. TEMBAK DIGIFLAZZ
    const digiRes = await fetch("https://api.digiflazz.com/v1/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user,
        buyer_sku_code: produk.sku,
        customer_no: noTujuan,
        ref_id: ref_id,
        sign: sign,
      }),
    });
    const digiData = await digiRes.json();

    if (digiData?.data?.status === "Sukses" || digiData?.data?.status === "Gagal" || digiData?.data?.rc === "00") {
      // 2. BOT WA SUKSES KE PEMBELI (BOT #4)
      let targetPembeli = noPembeli.replace(/^0/, "62");
      let pesanSukses = `*E-CELL - TRANSAKSI SUKSES ✅*\n\nRef: ${ref_id}\nProduk: ${produk.name}\nNo: ${noTujuan}\nStatus: *BERHASIL*\n\nPulsa/data sudah masuk ya Kak! Terimakasih sudah belanja di E-CELL 🙏\n\nCek: ${digiData?.data?.sn || ''}`;

      await kirimWA(targetPembeli, pesanSukses);

      // 3. CEK SALDO TERBARU
      const signSaldo = md5(user + apiKey + "depo");
      const saldoRes = await fetch("https://api.digiflazz.com/v1/cek-saldo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cmd: "deposit", username: user, sign: signSaldo }),
      });
      const saldoData = await saldoRes.json();

      return NextResponse.json({ 
        success: true, 
        message: `${produk.name} ke ${noTujuan} SUKSES`,
        sn: digiData?.data?.sn,
        saldo: saldoData?.data?.deposit,
        raw: digiData 
      });
    } else {
      return NextResponse.json({ success: false, message: digiData?.data?.message || "Gagal dari Digiflazz", raw: digiData });
    }
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
