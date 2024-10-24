import Image from "next/image";
import Highlight from "./Highlight";
type Props = {};

function Banner({}: Props) {
  return (
    <section className="bg-[#fbead1] my-10 relative h-[400px] md:h-[200px]">
      <div className="block md:hidden absolute top-0 left-0 h-[400px] w-full md:w-full md:h-full z-0">
        <Image
          src="/mobile-banner-image.png"
          alt="banner"
          layout="fill"
          className="md:object-contain"
        />
      </div>
      <div className="hidden md:block absolute top-0 left-0 h-[400px] w-full md:w-full md:h-full z-0">
        <Image
          src="/bannerbg.png"
          alt="banner"
          layout="fill"
          className="md:object-contain"
        />
      </div>
      <div className="container flex flex-col md:flex-row justify-center items-center md:gap-12 h-[400px] md:h-[200px] z-10 relative px-4">
        <h3 className="text-2xl md:text-4xl font-bold w-full md:w-1/2 text-black px-4 md:px-0">
          If there is no unique answer found the prize is rolled over to the{" "}
          {/* <span className="bg-[#f15f53] px-[0.5] text-white">next game.</span> */}
          <Highlight fill="red-500" color="white">
            next game.
          </Highlight>
        </h3>
        <div className="flex gap-4">
          <div className="w-8 h-8 relative">
            <Image
              src="/dice 2.png"
              alt="Dice"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="w-16 h-16 relative">
            <Image
              src="/dice 3.png"
              alt="Dice"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="w-24 h-24 relative -ml-4">
            <Image
              src="/dice 1.png"
              alt="Dice"
              layout="fill"
              objectFit="contain"
              className="ml-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
