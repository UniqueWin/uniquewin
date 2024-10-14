import { GameProvider } from "@/contexts/GameContext";
import "./globals.css";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/utils/UserContext";
import localFont from "next/font/local";

const calibri = localFont({
  src: [
    {
      path: "../public/fonts/calibri.ttf",
      weight: "400",
    },
    {
      path: "../public/fonts/calibrib.ttf",
      weight: "700",
    },
  ],
  variable: "--font-calibri",
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  title: "UniqueWin",
  description: "Play unique games and win big!",
  openGraph: {
    images: ["https://uniquewin.vercel.app/opengraph-image.png"],
  },
  twitter: {
    images: ["https://uniquewin.vercel.app/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${calibri.variable}`}>
      <body className="font-calibri">
        <UserProvider>
          <GameProvider>
            <NavBar />
            {/* <AuroraBackground showRadialGradient={true} className=""> */}
            <main className="">{children}</main>
            {/* </AuroraBackground> */}
            <Footer />
          </GameProvider>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
