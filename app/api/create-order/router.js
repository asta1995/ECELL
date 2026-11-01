import { NextResponse } from "next/server";
import { botInvoicePembeli, botKonfirmasiAdmin } from "@/lib/wa.js";

export async function POST(req) {
  const body = await req.json();
  await botInvoicePembeli(body.noPembeli, body.ref_id, body.produk.name, body.noTujuan);
  await botKonfirmasiAdmin(body.ref_id, body.produk.name, body.noTujuan, body.produk.price);
  return NextResponse.json({ success: true, ref_id: body.ref_id });
}
