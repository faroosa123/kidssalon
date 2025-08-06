import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MockAuthProvider } from "@/contexts/MockAuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WhatsApp Clone",
  description: "A modern WhatsApp clone built with Next.js and Firebase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MockAuthProvider>
          {children}
          <Toaster position="top-right" />
        </MockAuthProvider>
      </body>
    </html>
  );
}
