"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Gift,
  Trophy,
  Users,
  ChevronDown,
  Star,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import WheelOfFortune from "@/components/WheelOfFortune";
export default function Component() {
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const drawTime = new Date(now);
      drawTime.setHours(20, 0, 0, 0);
      if (now > drawTime) drawTime.setDate(drawTime.getDate() + 1);

      const diff = drawTime.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted email:", email);
  };

  return (
    <div className="bg-gray-900 text-white">
      <header className="sticky top-0 bg-gray-800 bg-opacity-90 shadow-md z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-orange-500 mr-2" />
            <span className="text-2xl font-bold text-orange-400">
              UniqueWin
            </span>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Join Waitlist
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="flex flex-col md:flex-row items-center mb-16">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-5xl font-bold text-orange-400 mb-4">
              Be Unique, Win Big!
            </h1>
            <p className="text-xl mb-6">
              Join the ultimate game show where your unique answers can lead to
              instant wins and exciting prizes!
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
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
          <div className="md:w-1/2">
            {/* <img
              src="/placeholder.svg?height=400&width=400"
              alt="Game Show Illustration"
              className="w-full h-auto"
            /> */}
            <WheelOfFortune />
          </div>
        </section>

        {/* Updated Daily Game Section */}
        <section className="text-center mb-16 bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-orange-400">
            New Daily Game Every Day!
          </h2>
          <p className="text-xl mb-8">
            Join us for exciting daily draws and win amazing prizes!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-6 rounded-lg">
              <Clock className="h-12 w-12 mb-4 text-orange-500 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Game Schedule</h3>
              <p>New game opens daily at 8:00 PM</p>
              <p>Live draw takes place at 9:00 PM</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <Gift className="h-12 w-12 mb-4 text-orange-500 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Exciting Prizes</h3>
              <p>Win cash, tokens, and more!</p>
              <p>Daily chances to claim rewards</p>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-lg mb-4">
              Don't miss out on the fun! Join our community of daily players.
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white text-lg py-3 px-6">
              Sign Up for the Waitlist
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center shadow-lg">
            <Users className="h-12 w-12 mb-4 text-orange-500" />
            <h3 className="text-xl font-semibold mb-2">Unique Answers</h3>
            <p>Stand out with your creativity and win big!</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center shadow-lg">
            <Trophy className="h-12 w-12 mb-4 text-orange-500" />
            <h3 className="text-xl font-semibold mb-2">Instant Wins</h3>
            <p>Be the only one with a unique answer and win instantly!</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center shadow-lg">
            <Gift className="h-12 w-12 mb-4 text-orange-500" />
            <h3 className="text-xl font-semibold mb-2">Daily Raffles</h3>
            <p>Multiple unique answers? Enter our exciting daily raffle!</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center shadow-lg">
            <Clock className="h-12 w-12 mb-4 text-orange-500" />
            <h3 className="text-xl font-semibold mb-2">Daily Draws</h3>
            <p>Join our thrilling draws every day at 8 PM!</p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-3xl font-bold text-orange-500 mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p>Join our waitlist to be notified when the game launches.</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-3xl font-bold text-orange-500 mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Answer Questions</h3>
              <p>Provide unique answers to our daily questions.</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-3xl font-bold text-orange-500 mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Win Prizes</h3>
              <p>Get instant wins or enter raffles for amazing prizes!</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            What Our Winners Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <p className="mb-4">
                "I never thought my unique answer would lead to such an amazing
                prize! This game is addictive and rewarding!"
              </p>
              <div className="flex items-center">
                <img
                  src="/placeholder.svg?height=50&width=50"
                  alt="Sarah J."
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold">Sarah J.</div>
                  <div className="text-yellow-500">
                    <Star className="inline-block h-4 w-4" />
                    <Star className="inline-block h-4 w-4" />
                    <Star className="inline-block h-4 w-4" />
                    <Star className="inline-block h-4 w-4" />
                    <Star className="inline-block h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <p className="mb-4">
                "The daily draws keep me coming back. It's so exciting to see if
                your answer is truly unique!"
              </p>
              <div className="flex items-center">
                <img
                  src="/placeholder.svg?height=50&width=50"
                  alt="Mike T."
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold">Mike T.</div>
                  <div className="text-yellow-500">
                    <Star className="inline-block h-4 w-4" />
                    <Star className="inline-block h-4 w-4" />
                    <Star className="inline-block h-4 w-4" />
                    <Star className="inline-block h-4 w-4" />
                    <Star className="inline-block h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Updated FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-orange-400">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I win?</AccordionTrigger>
              <AccordionContent>
                You win by providing a unique answer that no other player has
                given. If you're the only one with a unique answer, you win
                instantly!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>When are the daily draws?</AccordionTrigger>
              <AccordionContent>
                Daily draws happen every day at 9 PM. Make sure to submit your
                answers before then!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                What kind of prizes can I win?
              </AccordionTrigger>
              <AccordionContent>
                Prizes range from cash rewards to exciting experiences. The more
                unique your answer, the bigger the potential prize!
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-xl mb-6">
            Join our waitlist now and be the first to know when we launch!
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white text-lg py-6 px-12">
            Join the Waitlist
          </Button>
        </section>

        <section className="text-center mb-8">
          <div className="font-bold text-2xl mb-2">100,000+</div>
          <p>Players already on the waitlist</p>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Trophy className="h-8 w-8 text-orange-500 mr-2" />
              <span className="text-2xl font-bold">UniqueWin</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-orange-500">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-orange-500">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-orange-500">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            © 2023 UniqueWin. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
