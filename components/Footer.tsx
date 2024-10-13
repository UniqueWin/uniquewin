import React from "react";
import Link from "next/link";

import {
  IconBrandFacebook,
  IconBrandFacebookFilled,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandX,
} from "@tabler/icons-react";
import { Facebook, FacebookIcon, Instagram } from "lucide-react";

const Footer = () => {
  return (
    //logo | horizontal links | social icons
    //copyright | terms privacy
    <section className="bg-gray-50 p-10 text-black z-20 h-full">
      <div className="container mx-auto p-4 rounded-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* logo */}
          <h2 className="text-xl font-bold mb-4">UniqueWin</h2>
          {/* horizontal links */}
          <ul className="flex gap-4 font-semibold">
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
            <li>
              <Link href="/support" className="hover:text-gray-300">
                Support
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-gray-300">
                Register
              </Link>
            </li>
          </ul>
          {/* social icons */}
          <div className="flex space-x-4">
            <Link href="#" className="bg-blue-400 text-white rounded-full p-2">
              <IconBrandFacebookFilled size={32} className="translate-y-3" />
            </Link>
            <Link href="#" className="text-black rounded-full p-2">
              <IconBrandX size={32} className="" />
            </Link>
            <Link href="#" className="text-black rounded-full p-2">
              <IconBrandInstagram size={32} className="" />
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
              <Link href="/terms" className="hover:text-gray-300">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-gray-300">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );

  return (
    <footer className="bg-red-800 text-white py-12 mx-4 rounded-t-3xl mt-20">
      <div className="container mx-auto px-4 bg-black bg-opacity-10 p-4 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">UniqueWin</h3>
            <p className="text-sm">
              Find unique answers and win exciting prizes in our daily games!
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/games" className="hover:text-gray-300">
                  Games
                </Link>
              </li>
              <li>
                <Link href="/how-to-play" className="hover:text-gray-300">
                  How to Play
                </Link>
              </li>
              <li>
                <Link href="/winners" className="hover:text-gray-300">
                  Winners
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gray-300">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-gray-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gray-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-gray-300">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/responsible-gaming"
                  className="hover:text-gray-300"
                >
                  Responsible Gaming
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-300">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Twitter size={24} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Youtube size={24} />
              </a>
            </div>
            <p className="mt-4 text-sm">
              Subscribe to our newsletter for updates and exclusive offers.
            </p>
            {/* Add newsletter subscription form here if needed */}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} UniqueWin. All rights reserved.
          </p>
          <p className="mt-2">
            UniqueWin is operated by UniqueWin Ltd. UniqueWin is not licensed or
            regulated by the UK Gambling Commission.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
