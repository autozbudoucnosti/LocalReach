import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { ComplianceNote } from "@/components/compliance-note";
import { ToastProvider } from "@/components/toast-provider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocalReach",
  description: "Low-volume, highly targeted local business outreach dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${fraunces.variable} ${jetbrainsMono.variable} antialiased`}>
        <AppShell>
          <div className="space-y-6">
            <ComplianceNote />
            {children}
          </div>
          <ToastProvider />
        </AppShell>
      </body>
    </html>
  );
}
