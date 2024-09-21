import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { WaysToWin } from "./WaysToWin";
import { Statistics } from "./Statistics";
import { LuckyDip } from "./LuckyDip";
import { ResultShow } from "./ResultShow";
import { RolloverInfo } from "./RolloverInfo";
import { Reviews } from "./Reviews";
import { Footer } from "./Footer";
import { SeoTitleSection } from "./SeoTitleSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* <Header /> */}
      <main className="container mx-auto px-4">
        <HeroSection />
        <WaysToWin />
        <SeoTitleSection />
        <Statistics />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          <LuckyDip />
          <ResultShow />
        </div>
        <RolloverInfo />
        <Reviews />
      </main>
      <Footer />
    </div>
  );
}
