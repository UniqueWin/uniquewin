import { GeistSans } from "geist/font/sans";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { GameProvider } from "@/contexts/GameContext";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "UniqueWin",
  description: "Play unique games and win big!",
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
          <NavBar />
          <main className="min-h-screen flex flex-col items-center">
            <div className="w-full max-w-5xl px-4">{children}</div>
          </main>
        </GameProvider>
      </body>
    </html>
  );
}
