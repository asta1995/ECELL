import { NextResponse } from "next/server";
// Pakai memory sederhana, ganti ke Vercel KV / Supabase nanti
let ORDERS = global.ECELL_ORDERS || [];
global.ECELL_ORDERS = ORDERS;

export async function GET() {
  return NextResponse.json({ orders: ORDERS.reverse() });
}
export async function POST(req) {
  const body = await req.json();
  if(body.ref_id && body.status){
    ORDERS = ORDERS.map(o=> o.ref_id===body.ref_id ? {...o, status: body.status} : o);
  } else if(body.ref_id) {
    ORDERS.unshift({...body, status: 'PENDING', createdAt: new Date().toISOString()});
  }
  global.ECELL_ORDERS = ORDERS;
  return NextResponse.json({ success: true });
}
