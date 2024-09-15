"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface InstantWinPrize {
  id: string;
  prize_type: string;
  prize_amount: number;
}

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: () => void;
  allInstantWinPrizes: InstantWinPrize[];
}

// Add this function at the top of the file
function formatDateTimeLocal(date: Date): string {
  return date.toLocaleString('sv-SE', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit'
  }).replace(' ', 'T');
}

export function AddGameModal({
  isOpen,
  onClose,
  onAddGame,
  allInstantWinPrizes,
}: AddGameModalProps) {
  const [question, setQuestion] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [validAnswers, setValidAnswers] = useState("");
  const [price, setPrice] = useState("1");
  const [luckyDipPrice, setLuckyDipPrice] = useState("5");
  const [selectedPrizes, setSelectedPrizes] = useState<string[]>([]);
  const [prizeQuantities, setPrizeQuantities] = useState<{
    [key: string]: number;
  }>({});
  const supabase = createClient();

  const handlePresetTime = (preset: string) => {
    const now = new Date();
    let startTime = new Date(now);
    let endTime = new Date(now);

    console.log("he");
    console.log({ preset, now, startTime, endTime });

    switch (preset) {
      case "15min":
        endTime.setMinutes(now.getMinutes() + 15);
        break;
      case "30min":
        endTime.setMinutes(now.getMinutes() + 30);
        break;
      case "45min":
        endTime.setMinutes(now.getMinutes() + 45);
        break;
      case "60min":
        endTime.setHours(now.getHours() + 1);
        break;
      case "next15":
        startTime.setMinutes(now.getMinutes() + 15);
        endTime.setMinutes(now.getMinutes() + 30);
        break;
      case "next30":
        startTime.setMinutes(now.getMinutes() + 30);
        endTime.setMinutes(now.getMinutes() + 45);
        break;
      case "next45":
        startTime.setMinutes(now.getMinutes() + 45);
        endTime.setHours(now.getHours() + 1);
        break;
      case "next60":
        startTime.setHours(now.getHours() + 1);
        endTime.setHours(now.getHours() + 1, now.getMinutes() + 15);
        break;
      case "nextHour":
        startTime.setHours(now.getHours() + 1, 0, 0, 0);
        endTime.setHours(now.getHours() + 2, 0, 0, 0);
        break;
    }

    // Update these lines
    const formattedStartTime = formatDateTimeLocal(startTime);
    const formattedEndTime = formatDateTimeLocal(endTime);

    setStartTime(formattedStartTime);
    setEndTime(formattedEndTime);

    console.log("Preset start time:", formattedStartTime);
    console.log("Preset end time:", formattedEndTime);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create Date objects from the input values
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Format dates to ISO string and keep only the necessary part
    const formattedStartTime = startDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const formattedEndTime = endDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    console.log("Submitting start time:", formattedStartTime);
    console.log("Submitting end time:", formattedEndTime);

    const { data: newGame, error: gameError } = await supabase
      .from("games")
      .insert({
        question,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        valid_answers: validAnswers.split(",").map((answer) => answer.trim()),
        price: parseInt(price),
        lucky_dip_price: parseFloat(luckyDipPrice),
        status: "active",
        current_prize: 0,
      })
      .select()
      .single();

    if (gameError) {
      console.error("Error adding game:", gameError);
      return;
    }

    if (newGame) {
      const instantWinPrizes = selectedPrizes.map((prizeId) => ({
        game_id: newGame.id,
        instant_win_prize_id: prizeId,
        quantity: prizeQuantities[prizeId] || 0,
      }));

      const { error: prizeError } = await supabase
        .from("game_instant_win_prizes")
        .insert(instantWinPrizes);

      if (prizeError) {
        console.error("Error adding instant win prizes:", prizeError);
        return;
      }
    }

    onAddGame();
    onClose();
  };

  const handlePrizeSelection = (prizeId: string) => {
    setSelectedPrizes((prev) =>
      prev.includes(prizeId)
        ? prev.filter((id) => id !== prizeId)
        : [...prev, prizeId]
    );
  };

  const handleQuantityChange = (prizeId: string, quantity: number) => {
    setPrizeQuantities((prev) => ({ ...prev, [prizeId]: quantity }));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      aria-describedby="add-game-modal"
    >
      <DialogContent className="sm:max-w-2xl bg-white text-black" aria-describedby="add-game-modal">
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="question" className="text-right">
                Question
              </Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="col-span-3 bg-white text-black"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Time Presets</Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                <Button type="button" onClick={() => handlePresetTime("15min")}>
                  15 min
                </Button>
                <Button type="button" onClick={() => handlePresetTime("30min")}>
                  30 min
                </Button>
                <Button type="button" onClick={() => handlePresetTime("45min")}>
                  45 min
                </Button>
                <Button type="button" onClick={() => handlePresetTime("60min")}>
                  60 min
                </Button>
                <Button
                  type="button"
                  onClick={() => handlePresetTime("next15")}
                >
                  Next +15
                </Button>
                <Button
                  type="button"
                  onClick={() => handlePresetTime("next30")}
                >
                  Next +30
                </Button>
                <Button
                  type="button"
                  onClick={() => handlePresetTime("next45")}
                >
                  Next +45
                </Button>
                <Button
                  type="button"
                  onClick={() => handlePresetTime("next60")}
                >
                  Next +60
                </Button>
                <Button
                  type="button"
                  onClick={() => handlePresetTime("nextHour")}
                >
                  Next Hour
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="col-span-3 bg-white text-black"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="col-span-3 bg-white text-black"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="validAnswers" className="text-right">
                Valid Answers
              </Label>
              <Textarea
                id="validAnswers"
                value={validAnswers}
                onChange={(e) => setValidAnswers(e.target.value)}
                placeholder="Comma-separated list of answers"
                className="col-span-3 bg-white text-black"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="col-span-3 bg-white text-black"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="luckyDipPrice" className="text-right">
                Lucky Dip Price
              </Label>
              <Input
                id="luckyDipPrice"
                type="number"
                value={luckyDipPrice}
                onChange={(e) => setLuckyDipPrice(e.target.value)}
                className="col-span-3 bg-white text-black"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Instant Win Prizes</Label>
              <div className="col-span-3 space-y-2 max-h-[150px] overflow-y-auto">
                {allInstantWinPrizes.map((prize) => (
                  <div key={prize.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`prize-${prize.id}`}
                      checked={selectedPrizes.includes(prize.id)}
                      onCheckedChange={() => handlePrizeSelection(prize.id)}
                    />
                    <Label htmlFor={`prize-${prize.id}`} className="flex-grow">
                      {prize.prize_type} - £{prize.prize_amount}
                    </Label>
                    {selectedPrizes.includes(prize.id) && (
                      <Input
                        type="number"
                        value={prizeQuantities[prize.id] || 0}
                        onChange={(e) =>
                          handleQuantityChange(
                            prize.id,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-20 bg-white text-black"
                        placeholder="Qty"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Game</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
