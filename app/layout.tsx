import { GameProvider } from "@/contexts/GameContext";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "UniqueWin",
  description: "Play unique games and win big!",
  openGraph: {
    images: ['/ogimage.png'],
  },
  twitter: {
    images: ['/twitter-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <GameProvider>
          {/* <NavBar /> */}
          <main className="min-h-screen flex flex-col items-center">
            <div className="w-full max-w5xl px4">{children}</div>
          </main>
        </GameProvider>
      </body>
    </html>
  );
}
