import Image from "next/image";

type Props = {};

function HeroBG({}: Props) {
  return (
    <div className="absolute top-0 left-0 w-full h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[87vh] bg-black bg-opacity-10 z-1 overflow-hidden select-none">
      <div className="relative w-full h-full">
        <Image
          src="/title gfx.png"
          alt="hero-bg"
          layout="fill"
          objectFit="contain"
          objectPosition="center top"
          className="z-10 p-4 md:p-10 select-none"
        />
      </div>
    </div>
  );
}

export default HeroBG;
