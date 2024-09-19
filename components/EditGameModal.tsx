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
import { CustomSlider } from "@/components/CustomSlider";
import InstantWinPrizeManager from './InstantWinPrizeManager';

function adjustToLocal(utcDateString: string): string {
  const date = new Date(utcDateString);
  return date.toLocaleString('sv-SE', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'UTC'
  }).replace(' ', 'T');
}

function formatDateTime(dateTimeString: string): string {
  return dateTimeString;
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
}) => {
  const [question, setQuestion] = useState("");
  const [validAnswers, setValidAnswers] = useState("");
  const [price, setPrice] = useState("");
  const [luckyDipPrice, setLuckyDipPrice] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [currentPrize, setCurrentPrize] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    if (game) {
      setQuestion(game.question);
      setValidAnswers(game.valid_answers.join(", "));
      setPrice(game.price.toString());
      setLuckyDipPrice(game.lucky_dip_price?.toString() || "");
      setStartTime(adjustToLocal(game.start_time));
      setEndTime(adjustToLocal(game.end_time));
      setCurrentPrize(game.current_prize);
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
        start_time: startTime,
        end_time: endTime,
        current_prize: currentPrize,
      })
      .eq("id", game.id);

    if (gameError) {
      console.error("Error updating game:", gameError);
      return;
    }

    onEditGame();
    onClose();
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

  const formatDateTimeLocal = (date: Date): string => {
    return date.toLocaleString('sv-SE', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit'
    }).replace(' ', 'T');
  };

  const prizeSteps = [0, 250, 500, 1000, 1500, 2000, 2500, 5000];

  const handleManualPrizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 5000) {
      setCurrentPrize(value);
    }
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
                <Label htmlFor="currentPrize" className="text-sm font-medium">
                  Current Prize: £{currentPrize}
                </Label>
                <CustomSlider
                  min={0}
                  max={5000}
                  steps={prizeSteps}
                  value={currentPrize}
                  onChange={(value) => setCurrentPrize(value)}
                />
                <Input
                  id="manualPrize"
                  type="number"
                  value={currentPrize}
                  onChange={handleManualPrizeInput}
                  className="mt-2 bg-white"
                  min={0}
                  max={5000}
                />
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
              {game && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Instant Win Prizes</h3>
                  <InstantWinPrizeManager gameId={game.id} />
                </div>
              )}
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
