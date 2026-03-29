import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gitro",
  description: "Gitro lets you check the most maintained GitHub repositories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning={true}>
        <header className="flex flex-col items-center gap-4 text-center select-none">
          <div className="flex text-sm text-black dark:text-neutral-300 gap-x-4 my-3">
            <a className="cursor-pointer" href="/">Home</a>
            <a className="cursor-pointer" href="/usage">Usage</a>
            <a className="cursor-pointer" href="/faq">FAQ</a>
          </div>
          <h1 className="max-w-xs text-4xl font-semibold leading-10 text-black dark:text-zinc-50">
            Gitro
          </h1>
        </header>

        {children}
        <Toaster />

        <footer className="mt-auto mx-auto w-fit p-4">
          <small className="text-black dark:text-neutral-300 text-center cursor-default">
            &copy; 2026 Gitro, All rights reserved.
          </small>
        </footer>
      </body>
    </html>
  );
}
