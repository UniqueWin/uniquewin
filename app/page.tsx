"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy } from "lucide-react";
import WheelOfFortune from "@/components/WheelOfFortune";

export default function Component() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted email:", email);
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col">
      <header className="bg-gray-800 bg-opacity-90 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-orange-500 mr-2" />
            <span className="text-2xl font-bold text-orange-400">
              UniqueWin
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center">
          <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
            <h1 className="text-5xl font-bold text-orange-400 mb-4">
              Be Unique, Win Big!
            </h1>
            <p className="text-xl mb-6">
              Join our exclusive waitlist for a chance to win amazing prizes!
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-lg">
                  Enter your email to join the waitlist
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-lg py-3"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-6"
              >
                Join the Waitlist
              </Button>
            </form>
          </div>
          {/* <div className="md:w-1/2">
            <WheelOfFortune />
          </div> */}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <div className="text-sm w-full">
            © 2024 UniqueWin. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
