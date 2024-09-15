"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

function formatDateTimeLocal(date: Date): string {
  return date.toLocaleString('sv-SE', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit'
  }).replace(' ', 'T');
}

interface InstantWinPrize {
  id: string;
  prize_type: string;
  prize_amount: number;
  probability: number;
}

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: () => void;
  allInstantWinPrizes: InstantWinPrize[];
}

export function AddGameModal({
  isOpen,
  onClose,
  onAddGame,
  allInstantWinPrizes,
}: AddGameModalProps) {
  const [question, setQuestion] = useState("");
  const [validAnswers, setValidAnswers] = useState("");
  const [price, setPrice] = useState("1");
  const [luckyDipPrice, setLuckyDipPrice] = useState("5");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedPrizes, setSelectedPrizes] = useState<string[]>([]);
  const [prizeQuantities, setPrizeQuantities] = useState<{
    [key: string]: number;
  }>({});
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: newGame, error: gameError } = await supabase
      .from("games")
      .insert({
        question,
        start_time: startTime,
        end_time: endTime,
        valid_answers: validAnswers.split(",").map((answer) => answer.trim()),
        price: parseInt(price),
        lucky_dip_price: luckyDipPrice ? parseFloat(luckyDipPrice) : null,
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

  const handlePresetTime = (preset: string) => {
    const now = new Date();
    let newStartTime: Date;
    let newEndTime: Date;

    const roundToNearest15 = (date: Date) => {
      const minutes = date.getMinutes();
      const roundedMinutes = Math.ceil(minutes / 15) * 15;
      const newDate = new Date(date);
      newDate.setMinutes(roundedMinutes, 0, 0);
      return newDate;
    };

    const addMinutes = (date: Date, minutes: number) => {
      return new Date(date.getTime() + minutes * 60000);
    };

    switch (preset) {
      case '15min':
      case '30min':
      case '45min':
      case '60min':
        newStartTime = roundToNearest15(now);
        newEndTime = addMinutes(newStartTime, parseInt(preset));
        break;
      case 'next15':
      case 'next30':
      case 'next45':
      case 'next60':
        const minutesToAdd = parseInt(preset.slice(4));
        newStartTime = addMinutes(roundToNearest15(now), minutesToAdd);
        newEndTime = addMinutes(newStartTime, 15);
        break;
      case 'nextHour':
        newStartTime = new Date(now.setMinutes(0, 0, 0));
        newStartTime.setHours(newStartTime.getHours() + 1);
        newEndTime = addMinutes(newStartTime, 60);
        break;
      default:
        newStartTime = roundToNearest15(now);
        newEndTime = addMinutes(newStartTime, 60);
        break;
    }

    setStartTime(formatDateTimeLocal(newStartTime));
    setEndTime(formatDateTimeLocal(newEndTime));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Game</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="question" className="text-sm font-medium">
                  Question
                </Label>
                <Input
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="mt-1 bg-white"
                />
              </div>
              <div>
                <Label htmlFor="validAnswers" className="text-sm font-medium">
                  Valid Answers
                </Label>
                <Input
                  id="validAnswers"
                  value={validAnswers}
                  onChange={(e) => setValidAnswers(e.target.value)}
                  className="mt-1 bg-white"
                  placeholder="Comma-separated answers"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-medium">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 bg-white"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="luckyDipPrice"
                    className="text-sm font-medium"
                  >
                    Lucky Dip Price
                  </Label>
                  <Input
                    id="luckyDipPrice"
                    type="number"
                    value={luckyDipPrice}
                    onChange={(e) => setLuckyDipPrice(e.target.value)}
                    className="mt-1 bg-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Time Presets</Label>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Button type="button" onClick={() => handlePresetTime('15min')}>15 min</Button>
                  <Button type="button" onClick={() => handlePresetTime('30min')}>30 min</Button>
                  <Button type="button" onClick={() => handlePresetTime('45min')}>45 min</Button>
                  <Button type="button" onClick={() => handlePresetTime('60min')}>60 min</Button>
                  <Button type="button" onClick={() => handlePresetTime('next15')}>Next +15</Button>
                  <Button type="button" onClick={() => handlePresetTime('next30')}>Next +30</Button>
                  <Button type="button" onClick={() => handlePresetTime('next45')}>Next +45</Button>
                  <Button type="button" onClick={() => handlePresetTime('next60')}>Next +60</Button>
                  <Button type="button" onClick={() => handlePresetTime('nextHour')}>Next Hour</Button>
                </div>
              </div>
              <div>
                <Label htmlFor="startTime" className="text-sm font-medium">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1 bg-white"
                />
              </div>
              <div>
                <Label htmlFor="endTime" className="text-sm font-medium">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 bg-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Instant Win Prizes</Label>
              <div className="mt-1 space-y-2 max-h-[300px] overflow-y-auto">
                {allInstantWinPrizes.map((prize) => (
                  <div key={prize.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`prize-${prize.id}`}
                      checked={selectedPrizes.includes(prize.id)}
                      onCheckedChange={() => handlePrizeSelection(prize.id)}
                    />
                    <Label htmlFor={`prize-${prize.id}`} className="flex-grow">
                      {prize.prize_type} - £{prize.prize_amount} ({" "}
                      {(prize.probability * 100).toFixed()}%)
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
                        className="w-20 bg-white"
                        placeholder="Qty"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto">
              Add Game
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
