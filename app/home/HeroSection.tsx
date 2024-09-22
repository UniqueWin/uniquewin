import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative w-full" style={{ aspectRatio: "1200 / 564" }}>
      <Image
        src="/Design 2.png"
        alt="Background"
        layout="fill"
        objectFit="contain" // Keeps the full image visible
        className="absolute inset-0"
      />
    </section>
  );
}
