import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Combat Sports Intelligence",
    template: "%s | Combat Sports Intelligence",
  },
  description:
    "AI-powered combat sports analytics — fighter stats, rankings, matchmaking, and live debates across UFC, PFL, ONE Championship, Bellator, RIZIN, KSW, and more.",
  keywords: [
    "MMA",
    "UFC",
    "combat sports",
    "fighter analytics",
    "AI rankings",
    "martial arts",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Combat Sports Intelligence",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="bg-gray-950 text-gray-100 antialiased min-h-screen">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
