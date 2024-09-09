import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: () => void;
}

export function AddGameModal({ isOpen, onClose, onAddGame }: AddGameModalProps) {
  const [question, setQuestion] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [validAnswers, setValidAnswers] = useState('');
  const [price, setPrice] = useState('1');
  const [luckyDipPrice, setLuckyDipPrice] = useState('5');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('games')
      .insert({
        question,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        valid_answers: validAnswers.split(',').map(answer => answer.trim()),
        price: parseInt(price),
        lucky_dip_price: parseFloat(luckyDipPrice),
        status: 'pending',
        current_prize: 0
      });

    if (error) {
      console.error('Error adding game:', error);
    } else {
      onAddGame();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white text-black">
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