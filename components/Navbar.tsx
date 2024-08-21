"use client";

import Link from "next/link";
import { useUser } from "@/utils/userHelpers";

export default function NavBar() {
  const { user, logout } = useUser();

  return (
    <header className="bg-purple-700 text-white p-4">
      <nav className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="space-x-4 mb-2 sm:mb-0">
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
              <span className="mr-4">
                Balance: £{user.balance}
              </span>
              <Link
                href="/profile"
                className="hover:text-orange-300 transition"
              >
                {user.username}'s PROFILE
              </Link>
              <button
                onClick={logout}
                className="hover:text-orange-300 transition"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-orange-300 transition">
              SIGN IN
            </Link>
          )}
          <Link
            href="/buy-credits"
            className="bg-orange-500 px-2 py-1 rounded hover:bg-orange-600 transition"
          >
            BUY CREDITS
          </Link>
        </div>
      </nav>
    </header>
  );
}