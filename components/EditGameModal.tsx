"use client";

import React, { useState, useEffect } from "react";
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

function adjustToUTC(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString();
}

function adjustToLocal(utcDateString: string): string {
  const date = new Date(utcDateString);
  return date.toLocaleString('sv-SE', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  }).replace(' ', 'T');
}

interface InstantWinPrize {
  id: string;
  prize_type: string;
  prize_amount: number;
  probability: number;
}

interface EditGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditGame: () => void;
  game: any;
  allInstantWinPrizes: InstantWinPrize[];
}

export const EditGameModal: React.FC<EditGameModalProps> = ({
  isOpen,
  onClose,
  onEditGame,
  game,
  allInstantWinPrizes,
}) => {
  const [question, setQuestion] = useState("");
  const [validAnswers, setValidAnswers] = useState("");
  const [price, setPrice] = useState("");
  const [luckyDipPrice, setLuckyDipPrice] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedPrizes, setSelectedPrizes] = useState<string[]>([]);
  const [prizeQuantities, setPrizeQuantities] = useState<{
    [key: string]: number;
  }>({});
  const supabase = createClient();

  useEffect(() => {
    if (game) {
      setQuestion(game.question);
      setValidAnswers(game.valid_answers.join(", "));
      setPrice(game.price.toString());
      setLuckyDipPrice(game.lucky_dip_price?.toString() || "");
      setStartTime(adjustToLocal(game.start_time));
      setEndTime(adjustToLocal(game.end_time));
      setSelectedPrizes(
        game.game_instant_win_prizes.map((p: any) => p.instant_win_prize_id)
      );
      const quantities: { [key: string]: number } = {};
      game.game_instant_win_prizes.forEach((p: any) => {
        quantities[p.instant_win_prize_id] = p.quantity;
      });
      setPrizeQuantities(quantities);
    }
  }, [game]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!game) return;

    const { error: gameError } = await supabase
      .from("games")
      .update({
        question,
        valid_answers: validAnswers.split(",").map((answer) => answer.trim()),
        price: parseInt(price),
        lucky_dip_price: luckyDipPrice ? parseFloat(luckyDipPrice) : null,
        start_time: formatDateTime(startTime),
        end_time: formatDateTime(endTime),
      })
      .eq("id", game.id);

    if (gameError) {
      console.error("Error updating game:", gameError);
      return;
    }

    // Remove existing instant win prizes
    const { error: deleteError } = await supabase
      .from("game_instant_win_prizes")
      .delete()
      .eq("game_id", game.id);

    if (deleteError) {
      console.error("Error deleting existing instant win prizes:", deleteError);
      return;
    }

    // Add new instant win prizes
    const newPrizes = selectedPrizes.map((prizeId) => ({
      game_id: game.id,
      instant_win_prize_id: prizeId,
      quantity: prizeQuantities[prizeId] || 0,
    }));

    const { error: insertError } = await supabase
      .from("game_instant_win_prizes")
      .insert(newPrizes);

    if (insertError) {
      console.error("Error inserting new instant win prizes:", insertError);
      return;
    }

    onEditGame();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Game</DialogTitle>
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
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
