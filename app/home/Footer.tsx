import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-red-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <p>&copy; 2023 UniqueWin. All rights reserved.</p>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/how-to-play">How to play</Link>
              </li>
              <li>
                <Link href="/rules">Rules</Link>
              </li>
              <li>
                <Link href="/winners">Winners</Link>
              </li>
              <li>
                <Link href="/support">Support</Link>
              </li>
              <li>
                <Link href="/register">Register</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
