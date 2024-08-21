import Link from "next/link";

export default function NavBar() {
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
          <Link href="/games" className="hover:text-orange-300 transition">
            GAMES
          </Link>
          <Link href="/winners" className="hover:text-orange-300 transition">
            WINNERS
          </Link>
          <Link href="/faq" className="hover:text-orange-300 transition">
            FAQ
          </Link>
          <Link href="/contact" className="hover:text-orange-300 transition">
            CONTACT US
          </Link>
        </div>
        <div className="space-x-4">
          <Link href="/login" className="hover:text-orange-300 transition">
            SIGN IN/LOGOUT
          </Link>
          <Link href="/account" className="hover:text-orange-300 transition">
            MY ACCOUNT
          </Link>
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
