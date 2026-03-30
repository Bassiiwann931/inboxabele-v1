import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Email Warmup Strategy Generator",
  description: "AI-powered email deliverability warmup strategy generator for inbox placement success",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ backgroundColor: "#030d1a", color: "#e2e8f0" }}>
        {children}
      </body>
    </html>
  );
}
