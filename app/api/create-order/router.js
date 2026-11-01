import { NextResponse } from "next/server";
import { kirimWA, botInvoicePembeli, botKonfirmasiAdmin } from "@/lib/wa.js";

export async function POST(req) {
  const { ref_id, produk, noTujuan, noPembeli } = await req.json();

  // 1. BOT ke Pembeli
  await botInvoicePembeli(noPembeli, ref_id, produk.name, noTujuan);

  // 2. BOT ke Admin (kamu 083178084316)
  await botKonfirmasiAdmin(ref_id, produk.name, noTujuan, produk.price);

  // 3. Simpan ke DB (sementara pakai Vercel KV / ganti pakai Sheet)
  // await saveOrderToDB(...)

  return NextResponse.json({ success: true, ref_id });
}
