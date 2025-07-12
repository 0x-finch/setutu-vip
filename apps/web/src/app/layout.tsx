import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "涩兔兔",
  description: "涩兔兔 - 一个你忘不了的网站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full flex flex-col antialiased">
        {children}
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="2a14b016-5061-42fc-b165-447a184793bd"
        ></Script>
      </body>
    </html>
  );
}
