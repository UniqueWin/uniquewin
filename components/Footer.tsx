import Link from "next/link";

import Image from "next/image";
import SignUpBanner from "./SignUpBanner";
import { cn } from "@/lib/utils";

const Footer = () => {
  return (
    <section className="pt-4 md:p-10 bg-transparent text-black h-full lg:h-[500px] relative">
      <div className="absolute top-0 left-0 h-[200px] w-full md:w-full md:h-full z-[-1] text-gray-50 flex justify-center items-start">
        {/* this image is overalpping the container div below */}
        <Image
          src={"/wave.png"}
          alt="Signup"
          layout="fill" 
          objectFit="cover"
          className="z-[-1]"
        />
      </div>
      <div className="absolute -top-10 left-0 w-full h-fit -z-1 text-gray-50 flex justify-center items-start">
        <SignUpBanner />
      </div>

      {/* this container is being overlapped by the image above */}
      <div className="container mx-auto p-4 z-20 bg-[#f3f0f9] mt-16 md:mt-32 max-w-6xl pb-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center z-20 gap-10 md:gap-4">
          {/* logo */}
          <h2 className="text-xl font-bold mb-4">
            <Link href="/">
              <Image
                src="/footer-logo.png"
                alt="Logo"
                width={209}
                height={85}
              />
            </Link>
          </h2>
          {/* horizontal links */}
          <ul className="flex flex-col md:flex-row justify-center items-center gap-4 font-semibold">
            <li>
              <Link href="/how-to-play" className="hover:text-gray-300">
                How to Play
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-gray-300">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/winners" className="hover:text-gray-300">
                Winners
              </Link>
            </li>
          </ul>
          {/* social icons */}
          <div className="flex space-x-4">
            <Link
              href="https://www.facebook.com/uniquewinuk"
              className="cursor-pointer"
            >
              <FacebookIcon className="h-5 w-5 cursor-pointer" />
            </Link>
            <Link href="https://x.com/UniqueWin" className="">
              <XIcon className="h-5 w-5" />
            </Link>
            <Link href="https://www.tiktok.com/@uniquewinuk/" className="">
              <TikTokIcon className="h-5 w-5" />
            </Link>
            <Link href="https://www.instagram.com/uniquewinuk/" className="">
              <InstagramIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-400 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} UniqueWin. All rights reserved.
          </p>
          <p className="mt-2">
            UniqueWin is operated by UniqueWin Ltd. UniqueWin is not licensed or
            regulated by the UK Gambling Commission.
          </p>
          {/* links */}
          <ul className="flex gap-4 w-full justify-center items-center mt-4">
            <li>
              <Link
                href="/terms-of-service"
                className="hover:text-gray-300 underline"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-gray-300 underline"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Footer;

const FacebookIcon = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      id="svg9"
      width="666.66669"
      height="666.66718"
      viewBox="0 0 666.66668 666.66717"
      className={cn("cursor-pointer", className)}
    >
      <defs id="defs13">
        <clipPath clipPathUnits="userSpaceOnUse" id="clipPath25">
          <path d="M 0,700 H 700 V 0 H 0 Z" id="path23" />
        </clipPath>
      </defs>
      <g
        id="g17"
        transform="matrix(1.3333333,0,0,-1.3333333,-133.33333,799.99999)"
      >
        <g id="g19">
          <g id="g21" clipPath="url(#clipPath25)">
            <g id="g27" transform="translate(600,350)">
              <path
                d="m 0,0 c 0,138.071 -111.929,250 -250,250 -138.071,0 -250,-111.929 -250,-250 0,-117.245 80.715,-215.622 189.606,-242.638 v 166.242 h -51.552 V 0 h 51.552 v 32.919 c 0,85.092 38.508,124.532 122.048,124.532 15.838,0 43.167,-3.105 54.347,-6.211 V 81.986 c -5.901,0.621 -16.149,0.932 -28.882,0.932 -40.993,0 -56.832,-15.528 -56.832,-55.9 V 0 h 81.659 l -14.028,-76.396 h -67.631 V -248.169 C -95.927,-233.218 0,-127.818 0,0"
                style={{
                  fill: "#0866ff",
                  fillOpacity: 1,
                  fillRule: "nonzero",
                  stroke: "none",
                }}
                id="path29"
              />
            </g>
            <g id="g31" transform="translate(447.9175,273.6036)">
              <path
                d="M 0,0 14.029,76.396 H -67.63 v 27.019 c 0,40.372 15.838,55.899 56.831,55.899 12.733,0 22.981,-0.31 28.882,-0.931 v 69.253 c -11.18,3.106 -38.509,6.212 -54.347,6.212 -83.539,0 -122.048,-39.441 -122.048,-124.533 V 76.396 h -51.552 V 0 h 51.552 v -166.242 c 19.343,-4.798 39.568,-7.362 60.394,-7.362 10.254,0 20.358,0.632 30.288,1.831 L -67.63,0 Z"
                style={{
                  fill: "#ffffff",
                  fillOpacity: 1,
                  fillRule: "nonzero",
                  stroke: "none",
                }}
                id="path33"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

const XIcon = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="0 0 512 462.799"
      className={cn("cursor-pointer", className)}
    >
      <path
        fillRule="nonzero"
        d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
      />
    </svg>
  );
};

const InstagramIcon = ({ className }: { className: string }) => {
  return (
    <svg
      viewBox="0 0 16 16"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={cn("cursor-pointer", className)}
    >
      <defs>
        <radialGradient
          cx="13.2861314%"
          cy="100.4724%"
          fx="13.2861314%"
          fy="100.4724%"
          r="130.546822%"
          id="radialGradient-1"
        >
          <stop stopColor="#FA8F21" offset="9%"></stop>
          <stop stopColor="#D82D7E" offset="78%"></stop>
        </radialGradient>
      </defs>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g fill="url(#radialGradient-1)" fillRule="nonzero">
          <path d="M5.33397336,8 C5.33397336,6.527296 6.5275571,5.33312 8.00032001,5.33312 C9.47308292,5.33312 10.6673067,6.527296 10.6673067,8 C10.6673067,9.472704 9.47308292,10.66688 8.00032001,10.66688 C6.5275571,10.66688 5.33397336,9.472704 5.33397336,8 M3.89225169,8 C3.89225169,10.2688 5.73142926,12.107904 8.00032001,12.107904 C10.2692108,12.107904 12.1083883,10.2688 12.1083883,8 C12.1083883,5.7312 10.2692108,3.892096 8.00032001,3.892096 C5.73142926,3.892096 3.89225169,5.7312 3.89225169,8 M11.3109804,3.729216 C11.3107684,4.2594093 11.7404203,4.68938778 12.2706348,4.68959985 C12.8008493,4.68981191 13.230845,4.26017725 13.2310571,3.72998395 C13.2312692,3.19979065 12.8016174,2.76981212 12.2714029,2.7696 L12.2710188,2.7696 C11.7410565,2.76984699 11.3114395,3.19927504 11.3109804,3.729216 M4.76819073,14.511808 C3.98819153,14.476288 3.56423857,14.346368 3.2824993,14.236608 C2.90898036,14.0912 2.6424737,13.918016 2.36227049,13.638208 C2.08206728,13.3584 1.90862034,13.09216 1.76384655,12.718656 C1.65401816,12.437056 1.52409296,12.012992 1.48863555,11.233024 C1.44984999,10.38976 1.44210568,10.136448 1.44210568,8.000064 C1.44210568,5.86368 1.45049002,5.611072 1.48863555,4.767104 C1.52415697,3.987136 1.6550422,3.563904 1.76384655,3.281472 C1.90926037,2.907968 2.0824513,2.641472 2.36227049,2.36128 C2.64208968,2.081088 2.90834033,1.907648 3.2824993,1.76288 C3.56411056,1.653056 3.98819153,1.523136 4.76819073,1.48768 C5.61148846,1.448896 5.86481059,1.441152 8.00032001,1.441152 C10.1358294,1.441152 10.3894076,1.449536 11.2334093,1.48768 C12.0134085,1.5232 12.4366575,1.65408 12.7191008,1.76288 C13.0926197,1.907648 13.3591264,2.081472 13.6393296,2.36128 C13.9195328,2.641088 14.0923397,2.907968 14.2377535,3.281472 C14.3475819,3.563072 14.4775071,3.987136 14.5129645,4.767104 C14.5517501,5.611072 14.5594944,5.86368 14.5594944,8.000064 C14.5594944,10.136448 14.5517501,10.389056 14.5129645,11.233024 C14.4774431,12.012992 14.3468779,12.436928 14.2377535,12.718656 C14.0923397,13.09216 13.9191488,13.358656 13.6393296,13.638208 C13.3595104,13.91776 13.0926197,14.0912 12.7191008,14.236608 C12.4374895,14.346432 12.0134085,14.476352 11.2334093,14.511808 C10.3901116,14.550592 10.1367895,14.558336 8.00032001,14.558336 C5.86385055,14.558336 5.61123245,14.550592 4.76819073,14.511808 M4.70194808,0.048448 C3.85026601,0.087232 3.26829073,0.222272 2.7600464,0.420032 C2.23368935,0.624256 1.78810352,0.89824 1.34283771,1.342784 C0.897571903,1.787328 0.624280971,2.2336 0.420048802,2.759936 C0.222280891,3.26848 0.0872354894,3.850112 0.048449938,4.70176 C0.00902436097,5.554752 0,5.827456 0,8 C0,10.172544 0.00902436097,10.445248 0.048449938,11.29824 C0.0872354894,12.149952 0.222280891,12.73152 0.420048802,13.240064 C0.624280971,13.76608 0.897635905,14.212864 1.34283771,14.657216 C1.78803952,15.101568 2.23368935,15.375168 2.7600464,15.579968 C3.26925077,15.777728 3.85026601,15.912768 4.70194808,15.951552 C5.55542222,15.990336 5.82768911,16 8.00032001,16 C10.1729509,16 10.4456658,15.990976 11.2986919,15.951552 C12.150438,15.912768 12.7320293,15.777728 13.2405936,15.579968 C13.7666307,15.375168 14.2125365,15.10176 14.6578023,14.657216 C15.1030681,14.212672 15.375783,13.76608 15.5805912,13.240064 C15.7783591,12.73152 15.9140446,12.149888 15.9521901,11.29824 C15.9909756,10.444608 16,10.172544 16,8 C16,5.827456 15.9909756,5.554752 15.9521901,4.70176 C15.9134045,3.850048 15.7783591,3.26816 15.5805912,2.759936 C15.375783,2.23392 15.1023641,1.788032 14.6578023,1.342784 C14.2132405,0.897536 13.7666307,0.624256 13.2412336,0.420032 C12.7320293,0.222272 12.150374,0.086592 11.299332,0.048448 C10.4463059,0.009664 10.1735909,0 8.00096004,0 C5.82832913,0 5.55542222,0.009024 4.70194808,0.048448"></path>
        </g>
      </g>
    </svg>
  );
};

const TikTokIcon = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 293768 333327"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      className={cn("cursor-pointer", className)}
    >
      <path
        d="M204958 0c5369 45832 32829 78170 77253 81022v43471l-287 27V87593c-44424-2850-69965-30183-75333-76015l-47060-1v192819c6791 86790-60835 89368-86703 56462 30342 18977 79608 6642 73766-68039V0h58365zM78515 319644c-26591-5471-50770-21358-64969-44588-34496-56437-3401-148418 96651-157884v54345l-164 27v-40773C17274 145544 7961 245185 33650 286633c9906 15984 26169 27227 44864 33011z"
        fill="#26f4ee"
      />
      <path
        d="M218434 11587c3505 29920 15609 55386 35948 70259-27522-10602-43651-34934-47791-70262l11843 3zm63489 82463c3786 804 7734 1348 11844 1611v51530c-25770 2537-48321-5946-74600-21749l4034 88251c0 28460 106 41467-15166 67648-34260 58734-95927 63376-137628 35401 54529 22502 137077-4810 136916-103049v-96320c26279 15803 48830 24286 74600 21748V94050zm-171890 37247c5390-1122 11048-1985 16998-2548v54345c-21666 3569-35427 10222-41862 22528-20267 38754 5827 69491 35017 74111-33931 5638-73721-28750-49999-74111 6434-12304 18180-18959 39846-22528v-51797zm64479-119719h1808-1808z"
        fill="#fb2c53"
      />
      <path d="M206590 11578c5369 45832 30910 73164 75333 76015v51528c-25770 2539-48321-5945-74600-21748v96320c206 125717-135035 135283-173673 72939-25688-41449-16376-141089 76383-155862v52323c-21666 3569-33412 10224-39846 22528-39762 76035 98926 121273 89342-1225V11577l47060 1z" />
    </svg>
  );
};

const TikTokIconBox = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="0 0 1000 1000"
      className={cn("cursor-pointer", className)}
    >
      <path d="M906.25 0H93.75C42.19 0 0 42.19 0 93.75v812.49c0 51.57 42.19 93.75 93.75 93.75l812.5.01c51.56 0 93.75-42.19 93.75-93.75V93.75C1000 42.19 957.81 0 906.25 0zM684.02 319.72c-32.42-21.13-55.81-54.96-63.11-94.38-1.57-8.51-2.45-17.28-2.45-26.25H515l-.17 414.65c-1.74 46.43-39.96 83.7-86.8 83.7-14.57 0-28.27-3.63-40.35-9.99-27.68-14.57-46.63-43.58-46.63-76.97 0-47.96 39.02-86.98 86.97-86.98 8.95 0 17.54 1.48 25.66 4.01V421.89c-8.41-1.15-16.95-1.86-25.66-1.86-105.01 0-190.43 85.43-190.43 190.45 0 64.42 32.18 121.44 81.3 155.92 30.93 21.72 68.57 34.51 109.14 34.51 105.01 0 190.43-85.43 190.43-190.43V400.21c40.58 29.12 90.3 46.28 143.95 46.28V343.03c-28.89 0-55.8-8.59-78.39-23.31z" />
    </svg>
  );
};
