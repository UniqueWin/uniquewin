"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AnswerValidationPage() {
  const [pendingAnswers, setPendingAnswers] = useState<any[]>([]);
  const [showAllGames, setShowAllGames] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchPendingAnswers();
  }, [showAllGames]);

  const fetchPendingAnswers = async () => {
    try {
      // Fetch answers with game information
      let answersQuery = supabase
        .from("answers")
        .select(`
          *,
          games(id, question, status)
        `)
        .eq("status", "PENDING")
        .order("updated_at", { ascending: false });

      if (!showAllGames) {
        answersQuery = answersQuery.eq("games.status", "active");
      }

      const { data: answersData, error: answersError } = await answersQuery;

      if (answersError) throw answersError;

      // Fetch usernames separately
      const userIds = answersData.map(answer => answer.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const combinedData = answersData.map(answer => ({
        ...answer,
        profiles: profilesData.find(profile => profile.id === answer.user_id)
      }));

      console.log("Combined data:", combinedData);
      setPendingAnswers(combinedData);
    } catch (error) {
      console.error("Error fetching pending answers:", error);
    }
  };

  const handleValidation = async (answerId: string, isApproved: boolean) => {
    const { error } = await supabase
      .from("answers")
      .update({ status: isApproved ? "approved" : "rejected" })
      .eq("id", answerId);

    if (error) {
      console.error("Error updating answer status:", error);
    } else {
      fetchPendingAnswers();
    }
  };

  console.log({ pendingAnswers });

  return (
    <div className="p-6 bg-gray-100 text-gray-900 w-full max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Answer Validation</h1>
      <div className="mb-4">
        <Button
          onClick={() => setShowAllGames(!showAllGames)}
          variant="outline"
          className="mb-4 text-white"
        >
          {showAllGames ? "Show Only Active Games" : "Show All Games"}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Game Question</TableHead>
            <TableHead>Game Status</TableHead>
            <TableHead>Answer</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingAnswers.length ? (
            pendingAnswers.map((answer) => (
              <TableRow key={answer.id}>
                <TableCell>{answer?.games?.question}</TableCell>
                <TableCell>{answer?.games?.status}</TableCell>
                <TableCell>{answer?.answer_text}</TableCell>
                <TableCell>{answer?.profiles?.username}</TableCell>
                <TableCell>
                  {new Date(answer?.updated_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white"
                    onClick={() => handleValidation(answer.id, false)}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 text-white bg-green-800 hover:bg-green-600"
                    onClick={() => handleValidation(answer.id, true)}
                  >
                    Approve
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center font-bold">
                No pending answers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
