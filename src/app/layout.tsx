import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TRPCProvider from "@/components/layouts/trpcProvider";
import { URL_LOGO } from "@/constants";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'Vazzuniverse - Top up terpercaya se-universe',
  description: ' %s | Vazzuniverse - Top up terpercaya se-universe',
  icons: {
    icon: URL_LOGO,
  },
  twitter: {
    site: 'Top Up Terpecaya se-Universe',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    		<link rel="icon" href={URL_LOGO || "/favicon.ico"} sizes="any" />
      <TRPCProvider>
        
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {children}
        <Toaster />
      </body>
        </TRPCProvider>
    </html>
  );
}
