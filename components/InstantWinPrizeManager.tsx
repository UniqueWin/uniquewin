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
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface InstantWinPrize {
  id: string;
  game_id: string;
  answer: string;
  status: "LOCKED" | "UNLOCKED" | "SCRATCHED";
  winner_id: string | null;
  prize_type: "CASH" | "CREDITS" | "LUCKY_DIP" | "HANGMAN";
  prize_amount: number | null;
}

export default function InstantWinPrizeManager({ gameId }: { gameId: string }) {
  const [prizes, setPrizes] = useState<InstantWinPrize[]>([]);
  const [newPrize, setNewPrize] = useState<Partial<InstantWinPrize>>({
    game_id: gameId,
    answer: "",
    status: "LOCKED",
    prize_type: "CASH",
    prize_amount: 0,
  });
  const [quantity, setQuantity] = useState(1);
  const [validAnswers, setValidAnswers] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchPrizes();
    fetchValidAnswers();
  }, [gameId]);

  const fetchPrizes = async () => {
    const { data, error } = await supabase
      .from("answer_instant_wins")
      .select("*")
      .eq("game_id", gameId);

    if (error) console.error("Error fetching instant win prizes:", error);
    else setPrizes(data || []);
  };

  const fetchValidAnswers = async () => {
    const { data, error } = await supabase
      .from("games")
      .select("valid_answers")
      .eq("id", gameId)
      .single();

    if (error) console.error("Error fetching valid answers:", error);
    else setValidAnswers(data?.valid_answers || []);
  };

  const handleAddPrize = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newPrize.answer) {
      alert("Please enter a winning answer");
      return;
    }

    const normalizedAnswer = newPrize.answer.trim().toUpperCase();
    const isValidAnswer = validAnswers.some(answer => answer.trim().toUpperCase() === normalizedAnswer);

    if (!isValidAnswer) {
      setShowAlert(true);
      return;
    }

    const prizesToAdd = Array(quantity).fill({
      game_id: gameId,
      answer: normalizedAnswer,
      status: "LOCKED",
      prize_type: newPrize.prize_type,
      prize_amount: newPrize.prize_amount,
    });

    const { error } = await supabase.from("answer_instant_wins").insert(prizesToAdd);

    if (error) {
      console.error("Error adding instant win prizes:", error);
      return;
    }

    fetchPrizes();
    setNewPrize({
      game_id: gameId,
      answer: "",
      status: "LOCKED",
      prize_type: "CASH",
      prize_amount: 0,
    });
    setQuantity(1);
  };

  const handleDeletePrize = async (id: string) => {
    const { error } = await supabase
      .from("answer_instant_wins")
      .delete()
      .eq("id", id);
    if (error) console.error("Error deleting instant win prize:", error);
    else fetchPrizes();
    setShowDeleteAlert(false);
    setDeleteId(null);
  };

  const handleEditPrize = (prize: InstantWinPrize) => {
    setNewPrize(prize);
    setEditingId(prize.id);
  };

  const handleUpdatePrize = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from("answer_instant_wins")
      .update({
        answer: newPrize.answer,
        prize_type: newPrize.prize_type,
        prize_amount: newPrize.prize_amount,
      })
      .eq("id", editingId);

    if (error) {
      console.error("Error updating instant win prize:", error);
      return;
    }

    fetchPrizes();
    setNewPrize({
      game_id: gameId,
      answer: "",
      status: "LOCKED",
      prize_type: "CASH",
      prize_amount: 0,
    });
    setEditingId(null);
  };

  const handleAddValidAnswer = async () => {
    const updatedValidAnswers = [
      ...validAnswers,
      newPrize.answer?.toUpperCase() || "",
    ];
    const { error } = await supabase
      .from("games")
      .update({ valid_answers: updatedValidAnswers })
      .eq("id", gameId);

    if (error) {
      console.error("Error updating valid answers:", error);
    } else {
      setValidAnswers(updatedValidAnswers);
      setShowAlert(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-2">
          {editingId ? "Edit Prize" : "Add New Prize"}
        </h3>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="answer">Winning Answer</Label>
            <Input
              id="answer"
              value={newPrize.answer}
              onChange={(e) => setNewPrize({...newPrize, answer: e.target.value})}
              className="text-black bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valid-answers">Select from Valid Answers</Label>
            <Select onValueChange={(value) => setNewPrize({...newPrize, answer: value})}>
              <SelectTrigger className="w-full text-black bg-white">
                <SelectValue placeholder="Select a valid answer" />
              </SelectTrigger>
              <SelectContent>
                {validAnswers.map((answer) => (
                  <SelectItem key={answer} value={answer}>
                    {answer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="prize-type">Prize Type</Label>
            <Select
              value={newPrize.prize_type}
              onValueChange={(value: InstantWinPrize["prize_type"]) => 
                setNewPrize({...newPrize, prize_type: value})
              }
            >
              <SelectTrigger className="w-full text-black bg-white">
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
          <div>
            <Label htmlFor="prize-amount">Prize Amount</Label>
            <Input
              id="prize-amount"
              type="number"
              value={newPrize.prize_amount?.toString() || ""}
              onChange={(e) =>
                setNewPrize({
                  ...newPrize,
                  prize_amount: parseFloat(e.target.value),
                })
              }
              className="text-black bg-white"
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="text-black bg-white"
              min="1"
              disabled={!!editingId}
            />
          </div>
          <Button onClick={editingId ? handleUpdatePrize : handleAddPrize}>
            {editingId ? "Update Prize" : "Add Prize"}
          </Button>
          {editingId && (
            <Button onClick={() => setEditingId(null)}>Cancel Edit</Button>
          )}
        </form>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold">Current Instant Win Prizes</h3>
        <div className="flex flex-wrap gap-1 overflow-y-scroll max-h-[300px]">
          {prizes.map((prize) => (
            <Badge key={prize.id} variant="secondary" className="text-sm py-1 px-2 h-10">
              {prize.answer} ({prize.prize_type}: {prize.prize_amount})
              <button
                onClick={() => handleEditPrize(prize)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => {
                  setDeleteId(prize.id);
                  setShowDeleteAlert(true);
                }}
                className="ml-1 text-red-500 hover:text-red-700"
              >
                <Trash2 size={14} />
              </button>
            </Badge>
          ))}
        </div>
      </div>
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Invalid Answer</AlertDialogTitle>
            <AlertDialogDescription>
              The answer "{newPrize.answer}" is not in the list of valid
              answers. Would you like to add it?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAddValidAnswer}>
              Add to Valid Answers
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this instant win prize?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDeletePrize(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
