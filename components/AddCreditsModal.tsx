"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/utils/UserContext";

const CREDIT_PRESETS = [10, 20, 50, 100];
const MIN_CREDITS = 10;

export default function AddCreditsModal() {
  const [credits, setCredits] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { user, refreshUser } = useUser();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!credits) {
      setError("Please enter or select a credit amount");
      return;
    }

    const additionalCredits = parseInt(credits, 10);

    if (isNaN(additionalCredits) || additionalCredits < MIN_CREDITS) {
      setError(`Please enter a valid credit amount (minimum ${MIN_CREDITS} credits)`);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          credit_balance: (user?.credit_balance || 0) + additionalCredits,
        })
        .eq("id", user?.id)
        .select();

      if (error) {
        throw error;
      }

      refreshUser();
      setIsOpen(false);
      setCredits("");
    } catch (error) {
      console.error("Error updating credits:", error);
      setError("Failed to add credits. Please try again.");
    }
  };

  const handleCreditChange = (value: string) => {
    setCredits(value);
    if (parseInt(value, 10) < MIN_CREDITS) {
      setError(`Minimum credit purchase is ${MIN_CREDITS} credits (£${MIN_CREDITS})`);
    } else {
      setError("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[#FFC700] hover:bg-[#FFD700] text-black">
          {/* <PlusIcon className="mr-2 h-4 w-4" /> */}
          Add Credits
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-black">
        <DialogHeader>
          <DialogTitle>Add Credits</DialogTitle>
          <DialogDescription>
            Choose a preset amount or enter a custom number of credits to add (minimum {MIN_CREDITS} credits).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-2">
              {CREDIT_PRESETS.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant="outline"
                  className="bg-white text-black hover:text-white"
                  onClick={() => handleCreditChange(preset.toString())}
                >
                  {preset}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credits" className="text-right">
                Custom
              </Label>
              <Input
                id="credits"
                type="number"
                className="col-span-3 bg-white text-black"
                value={credits}
                onChange={(e) => handleCreditChange(e.target.value)}
                placeholder="Enter credits"
                min={MIN_CREDITS}
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
          <DialogFooter>
            <Button type="submit">Add Credits</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
