import type { Metadata } from "next";
import "./globals.css";

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
      </body>
    </html>
  );
}
