"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
interface LoginModalProps {
  isSignUp: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isSignUp: initialIsSignUp,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: email.split("@")[0],
            full_name: "",
            email: email,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.log({ error });
        setError(error.message);
      } else if (data?.user) {
        setMessage("Check your email to continue sign up process");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Could not authenticate user");
      } else {
        router.refresh();
      }
    }
  };

  useEffect(() => {
    setIsSignUp(initialIsSignUp);
  }, [initialIsSignUp]);

  return (
    <Dialog>
      <span className="flex flex-col md:flex-row gap-2 border-l md:border-purple-200 md:pl-4 border-none pl-0 w-full">
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-violet-800 text-sm text-white font-bold rounded-lg focus:bg-violet-600 py-1 md:max-h-8 px-4 md:w-22 w-full hover:bg-violet-700 hover:text-white order-1 md:order-2 uppercase md:text-xs"
            onClick={() => setIsSignUp(true)}
          >
            Register
          </Button>
        </DialogTrigger>
        <DialogTrigger asChild className="w-full">
          <Button
            variant="outline"
            className="bg-white text-xs text-violet-800 font-bold rounded-lg focus:bg-violet-400 py-1 md:max-h-8 px-4 md:w-22 w-full hover:bg-violet-600 hover:text-white order-2 md:order-1 uppercase md:text-xs"
            onClick={() => setIsSignUp(false)}
          >
            Login
          </Button>
        </DialogTrigger>
      </span>
      <DialogContent className="rounded-xl max-w-[90vw] md:max-w-[400px] mx-auto bg-white text-black">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Register" : "Login"}</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-500">{message}</p>}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isSignUp
                ? "Already have an account? Login"
                : "Need an account? Sign Up"}
            </button>
          </div>
        </form>
        <DialogFooter className="flex flex-row justify-between items-center w-full">
          <DialogClose asChild className="w-full">
            <Button
              type="button"
              variant="secondary"
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 w-full"
            >
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild className="w-full">
            <Button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 w-full"
              onClick={handleSubmit}
            >
              {isSignUp ? "Register" : "Login"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
