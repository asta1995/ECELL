import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata = {
  title: "E-CELL PRO - Pulsa Otomatis + Bot WA",
  description: "Toko pulsa otomatis + Bot WA multifungsi 083178084316 - ecell-theta-ten.vercel.app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-[#0a0a0a] text-white antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
