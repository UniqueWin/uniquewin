"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Trophy } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { LoginModal } from "@/components/LoginModal";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchUserAndCredits();
  }, []);

  const fetchUserAndCredits = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('credit_balance')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching user credits:", error);
      } else {
        setCredits(data?.credit_balance || 0);
      }
    }
  };

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
    setUser(null);
    setCredits(0);
  };

  const handleLoginSuccess = () => {
    fetchUserAndCredits();
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-pink-950 p-2 flex justify-between items-center text-white text-sm">
        <div className="flex items-center space-x-4">
          <Trophy className="text-yellow-400" />
          <div>Live jackpot £1,500</div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-[#FFC700] text-black"
          >
            Play Now
          </Button>
        </div>
        <div className="flex items-center space-x-4 border-l border-white pl-4">
          {user ? (
            <div className="flex items-center gap-2">
              <Bell className="mr-" />
              <div className="flex flex-col">
                <span className="font-semibold">
                  You have <span className="text-yellow-400">{credits} credits</span> left.
                </span>
                <small className="text-xxs">Buy more credits</small>
              </div>
              <Link href="/buy-credits" className="text-xs ml-1 underline">
                Buy more credits
              </Link>
            </div>
          ) : (
            <div>Sign in to see your credits</div>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="bg-[#FFC700] text-black"
          >
            Buy Credits
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white p-4 flex justify-between items-center">
        <div className="flex justify-start items-center gap-4 text-black">
          <div className="text-lg font-bold">Logo</div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  How to Play
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Winners
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex space-x-4 items-center">
          {user ? (
            <>
              <span className="text-sm font-semibold text-black">Welcome, {user.email}</span>
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