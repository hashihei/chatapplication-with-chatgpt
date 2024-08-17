import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProviderId } from "firebase/auth";
import { AppProvider } from "./context/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatApplication-with-ChatGPT",
  description: "udemy test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
