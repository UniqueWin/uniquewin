import Image from "next/image";
import Highlight from "./Highlight";

type Props = {};

function Features({}: Props) {
  return (
    <section className="container flex text-black max-w-7xl w-full justify-between items-center my-20 gap-4 mx-auto px-0">
      <div className="w-full h-full flex flex-col gap-4 max-w-xlf justify-start items-start">
        <div className="relative lg:w-[620px] lg:h-[640px]">
          <Image
            src="/luck.png"
            alt="Unique Answer"
            width={620}
            height={640}
            className="rounded-xl"
          />
          <div className="absolute bottom-0 left-0 w-full h-20 flex items-center justify-center font-bold text-white text-4xl px-10 mb-8">
            <span className="w-[93%] leading-tight p-[0.5px] relative">
              <div></div>
              Discover Your Luck with Our Exciting{" "}
              <Highlight fill="white" color="purple-900">
                Lucky Dip
              </Highlight>
            </span>
          </div>
        </div>
        <p className="text-left mt-4 pr-10">
          Find a Unique Answer and WIN! Unleash your creativity and stand a
          chance to win exclusive prizes by providing a one-of-a-kind answer.
          Play now and see if you can be the lucky winner!
        </p>
      </div>
      <div className="w-full h-full flex flex-col gap-4 max-w-xfl justify-center items-center">
        <div className="flex flex-col text-left w-full">
          <h4 className="text-sm lg:text-lg font-bold text-[#6b14cd]">
            Instant Prizes
          </h4>
          <h3 className="lg:text-6xl font-bold">
            WIN <Highlight>EVERYDAY</Highlight>
          </h3>
        </div>
        <div className="relative lg:w-[620px] lg:h-[640px]">
          <Image
            src="/wheel.png"
            alt="Unique Answer"
            width={620}
            height={640}
            className="rounded-xl"
          />
          <div className="absolute bottom-0 left-0 w-full h-20 flex items-center justify-center font-bold text-white text-4xl px-10 mb-8">
            <span className="w-[93%] leading-tight">
              Don't Miss the 8pm Result Show on{" "}
              <span className="bg-white px-1 rotate-[-3deg] text-blue-800">
                Facebook
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
