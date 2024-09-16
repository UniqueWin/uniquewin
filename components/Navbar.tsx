"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Trophy } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { LoginModal } from "@/components/LoginModal";
import { useUser } from '@/utils/UserContext';

const Navbar = () => {
  const { user, refreshUser } = useUser();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const supabase = createClient();

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

  const handleBuyCredits = async () => {
    if (user) {
      const additionalCredits = 10; // You can adjust this value or make it dynamic
      const { data, error } = await supabase
        .from("profiles")
        .update({ credit_balance: user.credit_balance + additionalCredits })
        .eq("id", user.id)
        .select();

      if (error) {
        console.error("Error updating credits:", error);
      } else {
        refreshUser();
      }
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-pink-950 p-2 flex justify-between items-center text-white text-sm">
        <div className="flex items-center space-x-4">
          <Trophy className="text-yellow-400" />
          <div>Live jackpot £1,500</div>
          <Link href="/games">
            <Button
              variant="secondary"
              size="sm"
              className="bg-[#FFC700] text-black"
            >
              Play Now
            </Button>
          </Link>
        </div>
        <div className="flex items-center space-x-4 border-l border-white pl-4">
          {user ? (
            <div className="flex items-center gap-2">
              <Bell className="mr-" />
              <div className="flex flex-col">
                <span className="font-semibold">
                  You have{" "}
                  <span className="text-yellow-400">{user.credit_balance} credits</span>{" "}
                  left.
                </span>
                <small className="text-xxs">Buy more credits</small>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="bg-[#FFC700] text-black"
                onClick={handleBuyCredits}
              >
                Buy Credits
              </Button>
            </div>
          ) : (
            <div>Sign in to see your credits</div>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="bg-white p-4 flex justify-between items-center">
        <div className="flex justify-start items-center gap-4 text-black">
          <div className="text-lg font-bold">Logo</div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/games" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/how-to-play" className="hover:underline">
                  How to Play
                </Link>
              </li>
              <li>
                <Link href="/winners" className="hover:underline">
                  Winners
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex space-x-4 items-center">
          {user ? (
            <>
              <span className="text-sm font-semibold text-black">
                Welcome, {user.email}
              </span>
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
