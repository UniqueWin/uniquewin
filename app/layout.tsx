import { GameProvider } from "@/contexts/GameContext";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer"; // Footer is imported here
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/utils/UserContext";

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
    <html lang="en" className={GeistSans.className}>
      <body className="bg-gradient-to-br from-red-700 to-fuchsia-900">
        <UserProvider>
          <GameProvider>
            <NavBar />
            <main className="min-h-screen flex flex-col items-center">
              {children}
            </main>
            <Footer />
          </GameProvider>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
