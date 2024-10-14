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
import Image from "next/image";

const Footer = () => {
  return (
    //logo | horizontal links | social icons
    //copyright | terms privacy
    <section className="bg-gray-50 p-10 text-black z-20 h-full">
      <div className="container mx-auto p-4 rounded-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* logo */}
          <h2 className="text-xl font-bold mb-4">
            <Link href="/">
              <Image
                src="/logo-web-horizontal.png"
                alt="Logo"
                width={100}
                height={100}
              />
            </Link>
          </h2>
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
              <Link href="/terms-of-service" className="hover:text-gray-300">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-gray-300">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Footer;
