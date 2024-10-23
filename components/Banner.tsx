import Image from "next/image";

type Props = {};

function Banner({}: Props) {
  return (
    <section className="bg-[#fbead1] my-10 relative h-[200px]">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Image
          src="/bannerbg.png"
          alt="banner"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="container flex justify-center items-center gap-12 h-[200px] z-10 relative">
        <h3 className="text-4xl font-bold w-1/2 text-black">
          If there is no unique answer found the prize is rolled over to the{" "}
          <span className="bg-[#f15f53] px-[0.5] text-white">next game.</span>
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
