import "./globals.css";
import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Providers from "./Providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import NextAuthProvider from "@/components/NextAuthProvider";
import SocialAuthBridge from "@/components/SocialAuthBridge";
import AdminNotificationListener from "@/components/AdminNotificationListener";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Ledger — Learn something worth keeping",
  description: "A MERN + Next.js Learning Management System",
};

const themeInitScript = `
  (function() {
    try {
      var stored = localStorage.getItem('theme');
      var theme = (stored === 'light' || stored === 'dark') ? stored : 'dark';
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} font-body bg-paper text-ink`}
      >
        <ThemeProvider>
          <NextAuthProvider>
            <Providers>
              <SocialAuthBridge />
              <AdminNotificationListener />
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </Providers>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
