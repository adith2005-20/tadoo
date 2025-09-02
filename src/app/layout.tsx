import "@/styles/globals.css";

import { type Metadata } from "next";
import { Rubik } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Tadoo",
  description: "Simple todo app",
  icons: [{ rel: "icon", url: "/tadoo.svg" }],
};

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${rubik.variable} antialiased`} suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <Providers>
            <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
              <Header/>
              {children}
              <Footer/>
            </ThemeProvider>
            </Providers>
          <Toaster position="bottom-right"/>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
