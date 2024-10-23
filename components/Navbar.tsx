"use client";

import { LoginModal } from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import NumberTicker from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";
import { useUser } from "@/utils/UserContext";
import { Game } from "@/utils/dataHelpers";
import { getCurrentGame } from "@/utils/gameHelpers";
import { createClient } from "@/utils/supabase/client";
import {
  ArrowRightIcon,
  UserIcon,
  UserRoundIcon,
  Grid,
  User,
  MonitorSmartphone,
  LineChart,
  Users,
  HelpCircle,
  Banknote,
  Circle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import FlipboardTimer from "./FlipboardTimer";
import AnimatedGradientText from "./ui/animated-gradient-text";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const { user, refreshUser } = useUser();
  const pathname = usePathname();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAddCreditsModalOpen, setIsAddCreditsModalOpen] = useState(false);
  const supabase = createClient();
  const [currentJackpot, setCurrentJackpot] = useState<number | null>(null);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    refreshUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
          refreshUser();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function fetchCurrentJackpot() {
      const game = await getCurrentGame();
      console.log({ game });
      if (game) {
        setCurrentGame(game);
        setCurrentJackpot(game.current_prize);
      }
    }

    fetchCurrentJackpot();
  }, []);

  const handleSignIn = () => {
    setIsSignUp(false);
    setIsLoginModalOpen(true);
  };

  const handleSignUp = () => {
    setIsSignUp(true);
    setIsLoginModalOpen(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    refreshUser();
  };

  const handleLoginSuccess = () => {
    refreshUser();
  };

  const links = [
    { href: "/", label: "Home", icon: <Grid /> },
    { href: "/how-to-play", label: "How to Play", icon: <User /> },
    { href: "/winners", label: "Winners", icon: <Banknote /> },
    { href: "/faq", label: "FAQ", icon: <LineChart /> },
    { href: "/contact", label: "Contact", icon: <Users /> },
  ];

  return (
    <>
      <nav className="w-full text-black relative hidden md:block">
        <div className="absolute top-0 left-0 w-full h-[105px] overflow-hidden z-0">
          <Image src="/nav.png" alt="Banner" layout="fill" objectFit="cover" />
        </div>
        <div className="absolute bottom-0 left-0 h-[50px] w-full bg-white z-0"></div>
        <div className="flex bg-white z-1 w-full">
          {/* Logo Section - spans both rows */}

          <div className="flex items-center md:w-1/5 lg:w-full">
            <Link href="/" className="w-full max-w-[285px] max-h-[500px]">
              <Image
                src="/logo-web-horizontal.png"
                alt="Logo"
                objectFit="contain"
                layout="fill"
                className="p-0 m-0 z-30 md:w-full md:h-full aspect-16/9 w-full max-w-[285px] max-h-[500px]"
              />
            </Link>
          </div>

          {/* Right side content */}
          <div className="flex-grow flex flex-col z-10">
            {/* Top Row */}
            <div className="flex justify-between items-center p-2">
              <div></div> {/* Empty div for spacing */}
              <div className="flex items-center space-x-4">
                {/* <div className="text-right"> */}
                <div className="relative w-full max-w-[235px] sm:max-w-[200px] sm:w-[200px] aspect-[235/87] z-10">
                  <Image
                    src="/sign BIG.png"
                    alt="Jackpot"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain"
                    priority
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text- font-bold drop-shadow-lg pt-2 text-4xl">
                      {typeof currentJackpot === "number" ? (
                        <span>
                          £
                          <NumberTicker
                            value={currentJackpot}
                            className="text-white"
                          />
                        </span>
                      ) : (
                        "?????"
                      )}
                    </span>
                  </div>
                  {/* </div> */}
                </div>
                <div className="tefxt-right">
                  {/* <div className="text-sm">GAME ENDS IN</div>
                <div className="text-xl font-bold">23:57:24</div> */}
                  {currentGame && (
                    <FlipboardTimer
                      game={currentGame}
                      showTitle={false}
                      mobile={false}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="bg-white flex justify-end items-center p-2 h-[50px] gap-4">
              {/* Navigation Links */}
              <div className="hidden md:flex gap-2 lg:mr-10">
                {links.map((link) => (
                  <a key={link.href} href={link.href}>
                    <span
                      className={`w-fit px-2 lg:px-3 py-1 font-semibold rounded-2xl hover:bg-[#eddeff] whitespace-nowrap ${
                        pathname === link.href ? "bg-[#eddeff]" : ""
                      }`}
                    >
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>

              {/* User Info and Credits */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center px-2 gap-4">
                  {user ? (
                    <>
                      {/* profile */}
                      <div className="flex items-center gap-2 border-r-2 px-2 border-purple-100">
                        <div className="bg-purple-200 rounded-full flex items-center justify-center w-8 h-8 text-purple-800 px-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-purple-900"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div className="text-xs w-full ml-2 text-black whitespace-nowrap">
                          Welcome back, <br />
                          {user?.email}!
                        </div>
                      </div>
                      {/* cash */}
                      <div className="flex flex-col justify-center items-center border-r-2 px-2 border-purple-100">
                        <span className="text-sm flex gap-1">
                          Cash:
                          <span className="font-bold text-pink-500">
                            £{user?.account_balance}
                          </span>
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-white font-semibold text-sm h-6 bg-gradient-to-b from-purple-400 to-purple-700 hover:from-purple-500 hover:to-purple-800"
                        >
                          Convert
                        </Button>
                      </div>
                      {/* credits */}
                      <div className="flex flex-col justify-center items-center px-2">
                        <span className="text-sm">
                          Credits:{" "}
                          <span className="text-pink-500 font-semibold">
                            {user?.credit_balance}
                          </span>
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-white font-semibold text-sm h-6 bg-gradient-to-t from-[#347158] to-[#58e364] hover:from-green-400 hover:to-green-500"
                        >
                          Buy Credits
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSignIn}
                        className={cn(
                          "group rounded-full border border-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200"
                        )}
                      >
                        <AnimatedGradientText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 bg-white">
                          <span
                            className={cn(
                              `inline-flex items-center justify-center animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
                            )}
                          >
                            Login
                            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 text-black/40 text-opacity-50" />
                          </span>
                        </AnimatedGradientText>
                      </button>

                      <button
                        type="button"
                        onClick={handleSignUp}
                        className={cn(
                          "group rounded-full border border-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200"
                        )}
                      >
                        <AnimatedGradientText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 bg-white">
                          <span
                            className={cn(
                              `inline-flex items-center justify-center animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
                            )}
                          >
                            Register
                            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 text-black/40 text-opacity-50" />
                          </span>
                        </AnimatedGradientText>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* mobile */}
      <nav className="w-full text-black relative md:hidden sm:h-[170px]">
        <div className="absolute top-0 left-0 w-full h-[150px] sm:h-[175px] overflow-hidden z-0">
          <Image src="/nav.png" alt="Banner" layout="fill" objectFit="cover" />
        </div>
        <div className="absolute bottom-0 left-0 h-[50px] w-full bg-white z-0"></div>
        <div className="flex flex-col h-[150px] sm:h-[175px]">
          <div className="flex justify-between items-start pt-1 z-10 w-full h-[150px]">
            <div className="flex items-start justify-start w-full">
              <Link href="/">
                <Image
                  src="/logo-web-horizontal.png"
                  alt="Logo"
                  objectFit="contain"
                  layout="fill"
                  className="p-0 m-0 z-0 w-[100px] h-[100px] max-w-[175px] max-h-[110px] sm:w-[100px] sm:h-[100px] sm:max-w-[250px] sm:max-h-[140px] md:w-full md:h-full md:max-w-[250px] md:max-h-[140px]"
                />
              </Link>
            </div>

            <div className="flex flex-col w-full justify-start items-center h-full">
              <div className="relative w-full max-w-[200px] sm:max-w-[200px] sm:w-[200px] aspect-[235/87] z-10">
                <Image
                  src="/sign BIG.png"
                  alt="Jackpot"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text- font-bold drop-shadow-lg pt-2 text-4xl">
                    {typeof currentJackpot === "number" ? (
                      <span>
                        £
                        <NumberTicker
                          value={currentJackpot}
                          className="text-white"
                        />
                      </span>
                    ) : (
                      "?????"
                    )}
                  </span>
                </div>
              </div>
              <div className="w-full flex justify-center items-center">
                {currentGame && (
                  <FlipboardTimer game={currentGame} showTitle={false} mobile />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center p-1 z-10 w-full h-[50px] px-4">
            <div className="flex items-center justify-center gap-2">
              <div className="bg-purple-200 rounded-full flex items-center justify-center w-9 h-9 text-purple-800 px-1">
                <UserRoundIcon className="h-10 w-10 text-purple-900" />
              </div>
              <div className="flex justify-center items-center gap-2">
                <div className="flex flex-col justify-center items-center">
                  <span className="font-bold text-pink-500">
                    {user?.credit_balance} Credits{" "}
                    <span className="text-sm text-black">left.</span>
                  </span>
                  <span className="text-xs">Buy more credits</span>
                </div>
                <Button
                  variant="secondary"
                  className="h-9 text-white font-semibold text-sm bg-gradient-to-t from-[#347158] to-[#58e364] hover:from-green-400 hover:to-green-500 rounded-xl"
                >
                  Buy Credits
                </Button>
              </div>
            </div>
            <Sheet>
              <SheetTrigger>
                
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-violet-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </SheetTrigger>
              <SheetContent className="bg-white text-black">
                <SheetHeader>
                  <SheetTitle>
                    <div className="w-full flex justify-center items-center">
                      <Image
                        src="/logo-web-horizontal.png"
                        alt="Logo"
                        width={200}
                        height={200}
                      />
                    </div>
                  </SheetTitle>
                  <SheetDescription>
                    <ul className="flex flex-col gap-2 w-full py-1 px-4">
                      {links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href}>
                            <li
                              className={`p-2 flex items-center gap-2 text-lg text-black hover:bg-purple-200 rounded-lg ${
                                pathname === link.href ? "font-bold" : ""
                              }`}
                            >
                              <div className="w-4 h-4 bg-purple-800 rounded-full" />
                              {link.label}
                            </li>
                          </Link>
                        </li>
                      ))}

                      {user ? (
                        <li className="p-2 flex items-center gap-2 text-lg font-bold text-black">
                          <Button
                            variant="secondary"
                            className="text-white text-lg font-bold bg-gradient-to-t from-purple-800 to-purple-700 hover:from-purple-500 hover:to-purple-800 w-full"
                            onClick={handleSignOut}
                          >
                            Logout
                          </Button>
                        </li>
                      ) : (
                        <>
                          <li className="w-full px-10 flex flex-col gap-f">
                            <Link href="/register">
                              <Button
                                variant="secondary"
                                className="text-white text-lg font-bold bg-gradient-to-t from-violet-700 to-violet-900 hover:from-violet-500 hover:to-violet-800 w-full"
                              >
                                Register
                              </Button>
                            </Link>
                          </li>
                          <li className="w-full px-10">
                            <Link href="/login">
                              <Button
                                variant="outline"
                                className="text-lg font-bold w-full bg-transparent hover:bg-violet-600 text-violet-800"
                              >
                                Login
                              </Button>
                            </Link>
                          </li>
                        </>
                      )}
                      {/* social icons */}
                      {/* 
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
             */}
                      <li className="w-full px-10 flex gap-4 justify-center mt-4">
                        <Link href="https://www.facebook.com/uniquewinuk">
                          <FacebookIcon className="h-5 w-5 cursor-pointer" />
                        </Link>
                        <Link href="https://x.com/UniqueWin">
                          <XIcon className="h-5 w-5" />
                        </Link>
                        <Link href="https://www.tiktok.com/@uniquewinuk/">
                          <TikTokIcon className="h-5 w-5" />
                        </Link>
                        <Link href="https://www.instagram.com/uniquewinuk/">
                          <InstagramIcon className="h-5 w-5" />
                        </Link>
                      </li>
                    </ul>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            {/* <button
              className="md:hidden text-purple-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button> */}
          </div>
        </div>
      </nav>

      {/* fixed mobile app navbar */}
      <nav className="bg-indigo-800 p-4 fixed bottom-0 left-0 w-full z-[99]">
        <ul className="flex justify-between items-center">
          {links.map((link) => (
            <Link href={link.href}>
              <li
                key={link.href}
                className={`p-2 rounded-lg hover:bg-orange-500 bg-indigo-700 bg-opacity-50 ${
                  pathname === link.href ? "bg-orange-500" : ""
                }`}
              >
                {link.icon}
              </li>
            </Link>
          ))}
          {/* <li className="bg-orange-400 p-2 rounded-md">
            <Grid className="w-6 h-6 text-white" />
          </li>
          <li>
            <User className="w-6 h-6 text-white" />
          </li>
          <li>
            <MonitorSmartphone className="w-6 h-6 text-white" />
          </li>
          <li>
            <LineChart className="w-6 h-6 text-white" />
          </li>
          <li>
            <Users className="w-6 h-6 text-white" />
          </li> */}
        </ul>
      </nav>
      {/* <nav className="fixed bottom-0 left-0 w-[100vw] h-[50px] bg-purple-900 z-[99]">
        <div className="flex justify-between items-center p-1 z-10 w-full h-[50px] px-4">
          <div className="flex items-center gap-2">
            <div className="bg-purple-200 rounded-full flex items-center justify-center w-9 h-9 text-purple-800 px-1">
              <UserRoundIcon className="h-10 w-10 text-purple-900" />
            </div>
            <span className="text-sm">Account</span>
            <div className="bg-purple-200 rounded-full flex items-center justify-center w-9 h-9 text-purple-800 px-1">
              <ArrowRightIcon className="h-10 w-10 text-purple-900" />
            </div>
            <span className="text-sm">Credits</span>
          </div>
        </div>
      </nav> */}

      {/* {isMobileMenuOpen && (
        <div className="relative">
          <div className="md:hidden bg-white/90 text-black p-4 absolute top-0 left-0 w-full z-30">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 px-4 text-sm hover:bg-[#eddeff]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )} */}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLoginSuccess}
        isSignUp={isSignUp}
      />
    </>
  );
};

export default Navbar;

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
