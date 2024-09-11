import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

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

export function AddGameModal({ isOpen, onClose, onAddGame, allInstantWinPrizes }: AddGameModalProps) {
  const [question, setQuestion] = useState('');
  const [validAnswers, setValidAnswers] = useState('');
  const [price, setPrice] = useState('1');
  const [luckyDipPrice, setLuckyDipPrice] = useState('5');
  const [selectedPrizes, setSelectedPrizes] = useState<string[]>([]);
  const [prizeQuantities, setPrizeQuantities] = useState<{ [key: string]: number }>({});
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const startTime = new Date(now);
    startTime.setHours(20, 0, 0, 0); // Set to 8:00 PM today
    const endTime = new Date(startTime);
    endTime.setDate(endTime.getDate() + 1); // Set to 8:00 PM tomorrow

    const { data: newGame, error: gameError } = await supabase
      .from('games')
      .insert({
        question,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        valid_answers: validAnswers.split(',').map(answer => answer.trim()),
        price: parseInt(price),
        lucky_dip_price: parseFloat(luckyDipPrice),
        status: 'pending',
        current_prize: 0
      })
      .select()
      .single();

    if (gameError) {
      console.error('Error adding game:', gameError);
      return;
    }

    // Add instant win prizes
    const newPrizes = selectedPrizes.map((prizeId) => ({
      game_id: newGame.id,
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
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="mt-1 bg-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="validAnswers" className="text-sm font-medium">
                  Valid Answers
                </Label>
                <Textarea
                  id="validAnswers"
                  value={validAnswers}
                  onChange={(e) => setValidAnswers(e.target.value)}
                  className="mt-1 bg-white"
                  placeholder="Comma-separated answers"
                  required
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
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="luckyDipPrice" className="text-sm font-medium">
                    Lucky Dip Price
                  </Label>
                  <Input
                    id="luckyDipPrice"
                    type="number"
                    value={luckyDipPrice}
                    onChange={(e) => setLuckyDipPrice(e.target.value)}
                    className="mt-1 bg-white"
                    required
                  />
                </div>
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
                      {prize.prize_type} - £{prize.prize_amount} ({(prize.probability * 100).toFixed()}%)
                    </Label>
                    {selectedPrizes.includes(prize.id) && (
                      <Input
                        type="number"
                        value={prizeQuantities[prize.id] || 0}
                        onChange={(e) => handleQuantityChange(prize.id, parseInt(e.target.value))}
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