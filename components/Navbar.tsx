"use client";

import { LoginModal } from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import NumberTicker from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";
import { useUser } from "@/utils/UserContext";
import { Game } from "@/utils/dataHelpers";
import { getCurrentGame } from "@/utils/gameHelpers";
import { createClient } from "@/utils/supabase/client";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import FlipboardTimer from "./FlipboardTimer";
import AnimatedGradientText from "./ui/animated-gradient-text";


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
    { href: "/", label: "Home" },
    { href: "/how-to-play", label: "How to Play" },
    { href: "/winners", label: "Winners" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
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
                  {currentGame && <FlipboardTimer game={currentGame} />}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="bg-white flex justify-between items-center p-2 h-[50px]">
              {/* Navigation Links */}
              <div className="hidden md:flex gap-2">
                {links.map((link) => (
                  <a key={link.href} href={link.href}>
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

              {/* Mobile Menu Button */}
              <button
                className="sm:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              </button>

              {/* User Info and Credits */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center px-2">
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
                        <div className="text-xs w-full ml-2 text-black">
                          Welcome back, <br />
                          {user?.email}!
                        </div>
                      </div>
                      {/* cash */}
                      <div className="flex flex-col justify-center items-center border-r-2 px-2 border-purple-100">
                        <span className="text-sm">
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="relative">
        <div className="sm:hidden bg-white/50 text-black p-4 absolute top-0 left-0 w-full z-10">
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
      )}

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
