import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { BagProvider } from "@/components/bag-provider";
import { ShoppingBag } from "@/components/shopping-bag";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "Cavendish House — Modern Modesty",
    template: "%s · Cavendish House",
  },
  description:
    "Modern Modesty, Rooted in London. A synthesis of British tailoring and Islamic tradition.",
  metadataBase: new URL("https://cavendish-house.vercel.app"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Cavendish House — Modern Modesty",
    description:
      "Modern modest menswear rooted in London. Quiet luxury, architectural silhouettes.",
    images: ["/images/hero-model.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col bg-background font-body-md text-body-md text-on-background antialiased">
        <BagProvider>
          {children}
          <ShoppingBag />
        </BagProvider>
      </body>
    </html>
  );
}
