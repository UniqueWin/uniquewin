import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface AddInstantWinPrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPrize: () => void;
}

enum PrizeType {
  CASH = 'CASH',
  CREDITS = 'CREDITS',
  LUCKY_DIP = 'LUCKY_DIP',
  HANGMAN = 'HANGMAN'
}

const probabilityLevels = {
  LOW: 0.1,
  MEDIUM: 0.3,
  HIGH: 0.5
};

export function AddInstantWinPrizeModal({ isOpen, onClose, onAddPrize }: AddInstantWinPrizeModalProps) {
  const [prizeType, setPrizeType] = useState<PrizeType>(PrizeType.CASH);
  const [prizeAmount, setPrizeAmount] = useState('');
  const [probability, setProbability] = useState(probabilityLevels.LOW);
  const [isProbabilityPercentage, setIsProbabilityPercentage] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('instant_win_prizes')
      .insert({
        prize_type: prizeType,
        prize_amount: parseFloat(prizeAmount),
        probability: isProbabilityPercentage ? probability / 100 : probability
      });

    if (error) {
      console.error('Error adding instant win prize:', error);
    } else {
      onAddPrize();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white text-black">
        <DialogHeader>
          <DialogTitle>Add New Instant Win Prize</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prizeType" className="text-right">
                Prize Type
              </Label>
              <Select value={prizeType} onValueChange={(value) => setPrizeType(value as PrizeType)}>
                <SelectTrigger className="col-span-3 bg-white text-black">
                  <SelectValue placeholder="Select prize type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PrizeType).map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prizeAmount" className="text-right">
                Prize Amount
              </Label>
              <Input
                id="prizeAmount"
                type="number"
                step="0.01"
                value={prizeAmount}
                onChange={(e) => setPrizeAmount(e.target.value)}
                className="col-span-3 bg-white text-black"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Probability</Label>
              <div className="col-span-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Switch
                    checked={isProbabilityPercentage}
                    onCheckedChange={setIsProbabilityPercentage}
                  />
                  <span>{isProbabilityPercentage ? 'Percentage' : 'Level'}</span>
                </div>
                {isProbabilityPercentage ? (
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={probability * 100}
                    onChange={(e) => setProbability(parseFloat(e.target.value) / 100)}
                    className="bg-white text-black"
                    required
                  />
                ) : (
                  <RadioGroup
                    value={String(probability)}
                    onValueChange={(value) => setProbability(parseFloat(value))}
                  >
                    <div className="flex space-x-2">
                      <div className="flex items-center">
                        <RadioGroupItem value={String(probabilityLevels.LOW)} id="low" />
                        <Label htmlFor="low" className="ml-2">Low</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value={String(probabilityLevels.MEDIUM)} id="medium" />
                        <Label htmlFor="medium" className="ml-2">Medium</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value={String(probabilityLevels.HIGH)} id="high" />
                        <Label htmlFor="high" className="ml-2">High</Label>
                      </div>
                    </div>
                  </RadioGroup>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Prize</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}