import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";

type Props = {};

function SignUpBanner({}: Props) {
  return (
    <div className="bg-purple-800 text-white my-10 w-full max-w-4xl rounded-3xl flex items-center justify-start overflow-hidden bg-gradient-to-b from-purple-700 to-purple-900 md:w-[830px] md:h-[140px] z-10 relative">
      <div className="">
        <Image
          src="/trophy.png"
          alt="Instant Prizes"
          width={220}
          height={220}
          className="rounded-3xl mt-7"
        />
      </div>
      <div className="container flex flex-col gap-2 items-start justify-center w-3/5">
        <h3 className="text-2xl lg:text-2xl font-bold">
          Join 1,200 players and Win a BIG prize
        </h3>
        <p className="text-sm font-normal text-gray-200">
          Registration is free, no credit card required.
        </p>
      </div>
      <div className="flex justify-end w-1/5">
        <Button className="text-white bg-gradient-to-t from-[#f69808] to-[#fdc202] from-30% to-100% hover:from-[#f69708d9] hover:to-[#fec509] rounded-lg px-4 text-xl font-semibold mr-10">
          JOIN NOW!
        </Button>
      </div>
    </div>
  );
}

export default SignUpBanner;
