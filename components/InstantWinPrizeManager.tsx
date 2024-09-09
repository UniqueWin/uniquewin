"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface InstantWinPrize {
  id: string;
  prize_type: 'CASH' | 'CREDITS' | 'LUCKY_DIP' | 'HANGMAN';
  prize_amount: number;
  probability: number;
  prize_details?: {
    expiry_date?: string;
    currency?: string;
    guaranteed_unique?: boolean;
    hangman_prize_id?: string;
  };
}

const probabilityLevels = {
  LOW: 0.1,
  MEDIUM: 0.3,
  HIGH: 0.5
};

export default function InstantWinPrizeManager() {
  const [prizes, setPrizes] = useState<InstantWinPrize[]>([]);
  const [newPrize, setNewPrize] = useState<Partial<InstantWinPrize>>({
    prize_type: 'CASH',
    prize_amount: 0,
    probability: probabilityLevels.LOW,
    prize_details: {}
  });
  const [editingPrize, setEditingPrize] = useState<InstantWinPrize | null>(null);
  const [probabilityInput, setProbabilityInput] = useState<'level' | 'percentage'>('level');
  const supabase = createClient();

  useEffect(() => {
    fetchPrizes();
  }, []);

  const fetchPrizes = async () => {
    const { data, error } = await supabase.from("instant_win_prizes").select("*");
    if (error) console.error("Error fetching instant win prizes:", error);
    else setPrizes(data || []);
  };

  const handleAddPrize = async () => {
    const { data, error } = await supabase.from("instant_win_prizes").insert([newPrize]);
    if (error) console.error("Error adding instant win prize:", error);
    else {
      fetchPrizes();
      setNewPrize({
        prize_type: 'CASH',
        prize_amount: 0,
        probability: probabilityLevels.LOW,
        prize_details: {}
      });
    }
  };

  const handleUpdatePrize = async () => {
    if (!editingPrize) return;
    const { error } = await supabase
      .from("instant_win_prizes")
      .update(editingPrize)
      .eq("id", editingPrize.id);
    if (error) console.error("Error updating instant win prize:", error);
    else {
      fetchPrizes();
      setEditingPrize(null);
    }
  };

  const handleDeletePrize = async (id: string) => {
    const { error } = await supabase.from("instant_win_prizes").delete().eq("id", id);
    if (error) console.error("Error deleting instant win prize:", error);
    else fetchPrizes();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Manage Instant Win Prizes</h2>
      <div className="bg-purple-100 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-2 text-purple-600">
          {editingPrize ? "Edit Prize" : "Add New Prize"}
        </h3>
        <form className="space-y-4">
          <div>
            <Label htmlFor="prize-type">Prize Type</Label>
            <Select
              value={editingPrize ? editingPrize.prize_type : newPrize.prize_type}
              onValueChange={(value: InstantWinPrize['prize_type']) => editingPrize 
                ? setEditingPrize({...editingPrize, prize_type: value})
                : setNewPrize({...newPrize, prize_type: value})
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select prize type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="CREDITS">Credits</SelectItem>
                <SelectItem value="LUCKY_DIP">Lucky Dip</SelectItem>
                <SelectItem value="HANGMAN">Hangman</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(editingPrize?.prize_type === 'CASH' || editingPrize?.prize_type === 'CREDITS' || 
            newPrize.prize_type === 'CASH' || newPrize.prize_type === 'CREDITS') && (
            <div>
              <Label htmlFor="prize-amount">Prize Amount</Label>
              <Input
                id="prize-amount"
                className="text-black bg-white"
                type="number"
                value={editingPrize ? editingPrize.prize_amount : newPrize.prize_amount || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : Number(e.target.value);
                  editingPrize 
                    ? setEditingPrize({...editingPrize, prize_amount: value})
                    : setNewPrize({...newPrize, prize_amount: value});
                }}
              />
            </div>
          )}
          <div>
            <Label>Probability</Label>
            <RadioGroup
              value={probabilityInput}
              onValueChange={(value: string) => setProbabilityInput(value as 'level' | 'percentage')}
              className="flex space-x-4 mb-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="level" id="level" />
                <Label htmlFor="level">Level</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage">Percentage</Label>
              </div>
            </RadioGroup>
            
            {probabilityInput === 'level' ? (
              <Select
                value={String(editingPrize ? editingPrize.probability : newPrize.probability)}
                onValueChange={(value: string) => {
                  const probabilityValue = Number(value);
                  editingPrize 
                    ? setEditingPrize({...editingPrize, probability: probabilityValue})
                    : setNewPrize({...newPrize, probability: probabilityValue});
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select probability level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(probabilityLevels.LOW)}>Low</SelectItem>
                  <SelectItem value={String(probabilityLevels.MEDIUM)}>Medium</SelectItem>
                  <SelectItem value={String(probabilityLevels.HIGH)}>High</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                className="text-black bg-white"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={editingPrize ? editingPrize.probability * 100 : newPrize.probability ? newPrize.probability * 100 : 0}
                onChange={(e) => {
                  const value = Number(e.target.value) / 100;
                  editingPrize 
                    ? setEditingPrize({...editingPrize, probability: value})
                    : setNewPrize({...newPrize, probability: value});
                }}
              />
            )}
          </div>
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={(e) => {
              e.preventDefault();
              editingPrize ? handleUpdatePrize() : handleAddPrize();
            }}
          >
            {editingPrize ? "Update Prize" : "Add Prize"}
          </Button>
          {editingPrize && (
            <Button
              className="bg-gray-500 hover:bg-gray-600 ml-2"
              onClick={() => setEditingPrize(null)}
            >
              Cancel Edit
            </Button>
          )}
        </form>
      </div>
      <div className="space-y-4">
        {prizes.map((prize) => (
          <div key={prize.id} className="bg-purple-100 p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <p>Type: {prize.prize_type}</p>
              {prize.prize_amount !== null && <p>Amount: {prize.prize_type === 'CASH' ? `£${prize.prize_amount}` : `${prize.prize_amount} credits`}</p>}
              <p>Probability: {(prize.probability * 100).toFixed(1)}%</p>
            </div>
            <div>
              <Button
                className="bg-purple-500 hover:bg-purple-600 mr-2"
                onClick={() => setEditingPrize(prize)}
              >
                Edit
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={() => handleDeletePrize(prize.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
