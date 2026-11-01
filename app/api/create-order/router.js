import { NextResponse } from "next/server";
import { botInvoicePembeli, botKonfirmasiAdmin } from "@/lib/wa.js";

export async function POST(req) {
  const body = await req.json();
  
  // 1. Simpan dulu biar muncul di /admin
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/get-orders`, {
    method: 'POST', headers: {"Content-Type":"application/json"}, body: JSON.stringify(body)
  }).catch(async()=>{
    // Fallback kalau base_url belum set - pakai memory langsung
    let ORDERS = global.ECELL_ORDERS || [];
    ORDERS.unshift({...body, status:'PENDING'});
    global.ECELL_ORDERS = ORDERS;
  });

  // 2. BOT WA #1 ke pembeli + #2 ke admin 083178084316
  await botInvoicePembeli(body.noPembeli, body.ref_id, body.produk.name, body.noTujuan);
  await botKonfirmasiAdmin(body.ref_id, body.produk.name, body.noTujuan, body.produk.price);

  return NextResponse.json({ success: true, ref_id: body.ref_id });
}
