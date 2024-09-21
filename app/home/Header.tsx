import Link from "next/link";

export function Header() {
  return (
    <header className="bg-purple-700 text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          UniqueWin
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/how-to-play">How to play</Link>
            </li>
            <li>
              <Link href="/winners">Winners</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/contact">Contact us</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
