import NextLogo from "./NextLogo";
import SupabaseLogo from "./SupabaseLogo";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-purple-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">UNIQUEWIN.CO.UK</h1>
        <nav>
          <Link href="/" className="mx-2 hover:text-orange-300">Home</Link>
          <Link href="/how-it-works" className="mx-2 hover:text-orange-300">How to Play</Link>
          <Link href="/winners" className="mx-2 hover:text-orange-300">Winners</Link>
          <Link href="/contact" className="mx-2 hover:text-orange-300">Contact Us</Link>
        </nav>
      </div>
    </header>
  );
}
