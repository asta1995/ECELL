import { NextResponse } from "next/server";
import md5 from "md5";
import { botWarningSaldo } from "@/lib/wa.js";

export async function POST() { return GET(); }

export async function GET() {
  try {
    const user = process.env.DIGIFLAZZ_USER;
    const apiKey = process.env.DIGIFLAZZ_APIKEY;
    const sign = md5(user + apiKey + "depo");
    
    const r = await fetch("https://api.digiflazz.com/v1/cek-saldo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cmd: "deposit", username: user, sign }),
    });
    const data = await r.json();
    const saldo = data?.data?.deposit || 0;

    if (saldo < 50000 && saldo > 0) {
      await botWarningSaldo(saldo);
    }

    return NextResponse.json({ saldo, raw: data });
  } catch (e) {
    return NextResponse.json({ saldo: 0, error: e.message }, { status: 500 });
  }
      }
