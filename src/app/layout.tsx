import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import Providers from "./lib/Providers";


export const metadata: Metadata = {
  title: "My App",
  description: "Social medial app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <Providers>
          <div className="mx-auto container">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
