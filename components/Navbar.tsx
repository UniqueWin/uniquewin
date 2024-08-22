"use client";

import Link from "next/link";
import { useUser } from "@/utils/userHelpers";
import { useGame } from "@/contexts/GameContext";
import { useCountdown } from "@/hooks/useCountdown";

export default function NavBar() {
  const { user, logout } = useUser();
  const { currentGame } = useGame();
  const timeLeft = useCountdown(currentGame?.endTime || "");

  return (
    <header className="bg-purple-700 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          <Link href="/" className="text-2xl font-bold">
            UNIQUEWIN.CO.UK
          </Link>
          <div className="text-right">
            <div className="text-orange-300">
              LIVE: JACKPOT: £{currentGame?.jackpot || 0}
            </div>
            <div>GAME ENDS IN {timeLeft}</div>
          </div>
        </div>
        <nav className="flex flex-wrap justify-between items-center py-2">
          <div className="space-x-4">
            <Link href="/" className="hover:text-orange-300 transition">
              HOME
            </Link>
            <Link
              href="/how-it-works"
              className="hover:text-orange-300 transition"
            >
              HOW TO PLAY?
            </Link>
            <Link href="/winners" className="hover:text-orange-300 transition">
              WINNERS
            </Link>
            <Link href="/contact" className="hover:text-orange-300 transition">
              CONTACT US
            </Link>
          </div>
          <div className="space-x-4">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="hover:text-orange-300 transition"
                >
                  MY ACCOUNT
                </Link>
                <span>BALANCE: £{user.balance}</span>
                <button
                  onClick={logout}
                  className="text-orange-300 hover:text-orange-400 transition"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-orange-300 hover:text-orange-400 transition"
              >
                PLAY NOW/LOGIN
              </Link>
            )}
            <Link
              href="/buy-credits"
              className="bg-orange-500 px-2 py-1 rounded hover:bg-orange-600 transition"
            >
              DEPOSIT
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
