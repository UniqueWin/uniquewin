"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, PoundSterlingIcon, Trophy } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { LoginModal } from "@/components/LoginModal";
import { useUser } from "@/utils/UserContext";
import AddCreditsModal from "@/components/AddCreditsModal";
import Image from "next/image";
import { getCurrentGame } from "@/utils/gameHelpers";
import { usePathname } from "next/navigation";
import NumberTicker from "@/components/ui/number-ticker";
import FlipboardTimer from "./FlipboardTimer";

const Navbar = () => {
  const { user, refreshUser } = useUser();
  const pathname = usePathname();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAddCreditsModalOpen, setIsAddCreditsModalOpen] = useState(false);
  const supabase = createClient();
  const [currentJackpot, setCurrentJackpot] = useState<number | null>(null);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);

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
    { href: "/", label: "Home" },
    { href: "/how-to-play", label: "How to Play" },
    { href: "/winners", label: "Winners" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="w-full text-black relative">
      <div className="absolute top-0 left-0 w-full h-[105px] overflow-hidden z-0">
        <Image src="/nav.png" alt="Banner" layout="fill" objectFit="cover" />
      </div>
      <div className="absolute bottom-0 left-0 h-[50px] w-full bg-white z-0"></div>
      <div className="flex bg-white z-1">
        {/* Logo Section - spans both rows */}
        <Link href="/">
          <div className="flex items-center">
            <Image
              src="/logo-web-horizontal.png"
              alt="Logo"
              width={300}
              height={300}
              className="p-0 m-0 z-0"
            />
          </div>
        </Link>

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
                <FlipboardTimer />
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="bg-white flex justify-between items-center p-2 h-[50px]">
            {/* Navigation Links */}
            <div className="flex gap-2 w-full">
              {links.map((link) => (
                <a href={link.href}>
                  <span
                    className={`w-fit px-3 py-1 font-semibold rounded-2xl hover:bg-[#eddeff] ${
                      pathname === link.href ? "bg-[#eddeff]" : ""
                    }`}
                  >
                    {link.label}
                  </span>
                </a>
              ))}
            </div>

            {/* User Info and Credits */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
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
                <select className="bg-purple-700 text-white">
                  <option>Welcome back, username!</option>
                </select>
              </div>
              <div>
                <span className="text-sm">Cash: </span>
                <span className="font-bold text-yellow-300">£100.20</span>
              </div>
              <div>
                <span className="text-sm">Credits left: </span>
                <span className="font-bold">10</span>
              </div>
              <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                Buy credits
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  //new grid based navbar
  return (
    //  remove later
    <div className="flex flex-col gap-4 relative">
      {/* remove later */}
      <div className="absolute top-0 left-0 w-full z-0 h-[65px] overflow-hidden">
        <Image
          src="/nav.png"
          alt="Banner"
          layout="fill"
          objectFit="cover"
          className="h-10"
        />
      </div>
      <div className="grid grid-cols-5 grid-rows-2 z-10">
        {/* logo */}
        <div className="col-span-1 row-span-2">
          <Link href="/">
            <Image
              src="/logo-web-horizontal.png"
              alt="Logo"
              width={500}
              height={500}
            />
          </Link>
        </div>
        {/* navbar on bottom row */}
        <div className="col-span-2 row-span-1 z-10 row-start-2">
          <div className="flex items-center space-x-4 w-full justify-center">
            <div
              className={`p-2 rounded-xl ${
                pathname === "/" ? "bg-[#eddeff]" : ""
              }`}
            >
              <Link href={`/`}>Home</Link>
            </div>

            {links.map((link) => (
              <div
                key={link.href}
                className={`p-2 rounded-xl w-fit ${
                  pathname === link.href ? "bg-[#eddeff]" : ""
                }`}
              >
                <Link href={link.href}>{link.label}</Link>
              </div>
            ))}
          </div>
        </div>
        {/* jackpot sign, game timer on top row */}
        {/* user dropdown | cash | credits  on bottom row*/}
        <div className="col-span-2 row-span-2"></div>
      </div>
      {/* remove later */}
      <>
        {/* Top Banner */}
        <div className="w-full max-w-screen overflow-x-hidden p-2 flex justify-between items-center text-white text-sm relative">
          <div className="absolute left-0 top-0 w-full h-full z-0">
            <Image
              src="/nav.png"
              alt="Banner"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex items-center space-x-4 z-10">
            <div className="">
              <Link href="/">
                <Image
                  src="/logo-web-horizontal.png"
                  alt="Logo"
                  width={100}
                  height={100}
                />
              </Link>
            </div>
            <div className="relative w-full max-w-[235px] aspect-[235/87] z-10">
              <Image
                src="/sign BIG.png"
                alt="Jackpot"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text- font-bold drop-shadow-lg pt-1">
                  {typeof currentJackpot === "number"
                    ? `£${currentJackpot}`
                    : "JACKPOT"}
                </span>
              </div>
            </div>
            <Link href={`/games/${currentGame?.id}`}>
              <Button
                variant="secondary"
                size="sm"
                className="bg-[#FFC700] text-black"
              >
                Play Now
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-4 border-l border-white pl-4 z-10">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="font-semibold">
                    Cash:
                    <span className="text-yellow-400">
                      £{user.account_balance}
                    </span>{" "}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">
                    You have{" "}
                    <span className="text-yellow-400">
                      {user.credit_balance} Q
                    </span>{" "}
                    left.
                  </span>
                  <small className="text-xxs">Buy more credits</small>
                </div>
                <AddCreditsModal />
              </div>
            ) : (
              <div>Sign in to see your credits</div>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="bg-white p-4 flex justify-between items-center w-full max-w-screen overflow-x-hidden">
          <div className="flex justify-start items-center gap-4 text-black">
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/games" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/how-to-play" className="hover:underline">
                    How to Play
                  </Link>
                </li>
                <li>
                  <Link href="/winners" className="hover:underline">
                    Winners
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:underline">
                    FAQ
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex space-x-4 items-center">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-sm font-semibold text-black"
                >
                  Welcome, {user.email}
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-pink-900 text-pink-900"
                  onClick={handleSignOut}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-pink-900 text-pink-900"
                  onClick={handleSignIn}
                >
                  Login
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-[#FF6B00] text-white"
                  onClick={handleSignUp}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLoginSuccess}
          isSignUp={isSignUp}
        />
      </>
      {/* remove later */}
    </div>
  );

  return (
    <>
      {/* Top Banner */}
      <div className="w-full max-w-screen overflow-x-hidden p-2 flex justify-between items-center text-white text-sm relative">
        <div className="absolute left-0 top-0 w-full h-full z-0">
          <Image src="/nav.png" alt="Banner" layout="fill" objectFit="cover" />
        </div>
        <div className="flex items-center space-x-4 z-10">
          <div className="">
            <Link href="/">
              <Image
                src="/logo-web-horizontal.png"
                alt="Logo"
                width={100}
                height={100}
              />
            </Link>
          </div>
          <div className="relative w-full max-w-[235px] aspect-[235/87] z-10">
            <Image
              src="/sign BIG.png"
              alt="Jackpot"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text- font-bold drop-shadow-lg pt-1">
                {typeof currentJackpot === "number"
                  ? `£${currentJackpot}`
                  : "JACKPOT"}
              </span>
            </div>
          </div>
          <Link href={`/games/${currentGame?.id}`}>
            <Button
              variant="secondary"
              size="sm"
              className="bg-[#FFC700] text-black"
            >
              Play Now
            </Button>
          </Link>
        </div>
        <div className="flex items-center space-x-4 border-l border-white pl-4 z-10">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="font-semibold">
                  Cash:
                  <span className="text-yellow-400">
                    £{user.account_balance}
                  </span>{" "}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">
                  You have{" "}
                  <span className="text-yellow-400">
                    {user.credit_balance} Q
                  </span>{" "}
                  left.
                </span>
                <small className="text-xxs">Buy more credits</small>
              </div>
              <AddCreditsModal />
            </div>
          ) : (
            <div>Sign in to see your credits</div>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="bg-white p-4 flex justify-between items-center w-full max-w-screen overflow-x-hidden">
        <div className="flex justify-start items-center gap-4 text-black">
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/games" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/how-to-play" className="hover:underline">
                  How to Play
                </Link>
              </li>
              <li>
                <Link href="/winners" className="hover:underline">
                  Winners
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex space-x-4 items-center">
          {user ? (
            <>
              <Link
                href="/profile"
                className="text-sm font-semibold text-black"
              >
                Welcome, {user.email}
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-pink-900 text-pink-900"
                onClick={handleSignOut}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-pink-900 text-pink-900"
                onClick={handleSignIn}
              >
                Login
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-[#FF6B00] text-white"
                onClick={handleSignUp}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>

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
