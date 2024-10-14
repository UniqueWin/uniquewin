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
  const [answers, setAnswers] = useState<any[]>([]);
  const [showPendingOnly, setShowPendingOnly] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchAnswers();

    // Set up real-time subscription
    const channel = supabase
      .channel("answer_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "answers",
        },
        (payload) => {
          console.log("Change received!", payload);
          handleRealTimeUpdate(payload);
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, [showPendingOnly]);

  const handleRealTimeUpdate = (payload: any) => {
    if (payload.eventType === "INSERT") {
      setAnswers((prevAnswers) => [payload.new, ...prevAnswers]);
    } else if (payload.eventType === "UPDATE") {
      setAnswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer.id === payload.new.id ? payload.new : answer
        )
      );
    } else if (payload.eventType === "DELETE") {
      setAnswers((prevAnswers) =>
        prevAnswers.filter((answer) => answer.id !== payload.old.id)
      );
    }
  };

  const fetchAnswers = async () => {
    try {
      let answersQuery = supabase
        .from("answers")
        .select(
          `
          *,
          games(id, question, status)
        `
        )
        .order("submitted_at", { ascending: false })
        .eq("games.status", "active");

      if (showPendingOnly) {
        answersQuery = answersQuery.eq("status", "PENDING");
      }

      const { data: answersData, error: answersError } = await answersQuery;

      if (answersError) throw answersError;

      const userIds = answersData.map((answer) => answer.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      const combinedData = answersData.map((answer) => ({
        ...answer,
        profiles: profilesData.find((profile) => profile.id === answer.user_id),
      }));

      setAnswers(combinedData);
    } catch (error) {
      console.error("Error fetching answers:", error);
    }
  };

  const handleValidation = async (answerId: string, isApproved: boolean) => {
    const supabase = createClient();
    let newStatus = isApproved ? "UNIQUE" : "INVALID";

    try {
      const { data: currentAnswer, error: currentAnswerError } = await supabase
        .from("answers")
        .select("*")
        .eq("id", answerId)
        .single();

      if (currentAnswerError) {
        throw currentAnswerError;
      }

      if (isApproved) {
        // Check for any existing answers with the same text for this game
        const { data: duplicateAnswers, error: duplicateError } = await supabase
          .from("answers")
          .select("*")
          .eq("game_id", currentAnswer.game_id)
          .eq("answer_text", currentAnswer.answer_text);

        if (duplicateError) throw duplicateError;

        if (duplicateAnswers.length > 1) {
          // If there are more than 1 answer (including the current one), set all to NOT UNIQUE
          newStatus = "NOT UNIQUE";

          // Update all duplicate answers to NOT UNIQUE
          const { error: updateDuplicatesError } = await supabase
            .from("answers")
            .update({ status: "NOT UNIQUE" })
            .eq("game_id", currentAnswer.game_id)
            .eq("answer_text", currentAnswer.answer_text);

          if (updateDuplicatesError) throw updateDuplicatesError;
        } else {
          // This is the only answer, set it to UNIQUE
          newStatus = "UNIQUE";
        }
      }

      // Update the current answer
      const { error: updateError } = await supabase
        .from("answers")
        .update({ status: newStatus })
        .eq("id", answerId);

      if (updateError) throw updateError;

      // Refresh the answers list
      fetchAnswers();
    } catch (error) {
      console.error("Error updating answer status:", error);
    }
  };

  console.log({ answers });

  return (
    <div className="p-6 bg-gray-100 text-gray-900 w-full max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Answer Validation</h1>
      <div className="mb-4">
        <Button
          onClick={() => setShowPendingOnly(!showPendingOnly)}
          variant="outline"
          className="mb-4 text-white"
        >
          {showPendingOnly ? "Show All Answers" : "Show Pending Answers Only"}
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
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {answers.length ? (
            answers.map((answer) => (
              <TableRow key={answer.id}>
                <TableCell>{answer?.games?.question}</TableCell>
                <TableCell>{answer?.games?.status}</TableCell>
                <TableCell>{answer?.answer_text}</TableCell>
                <TableCell>{answer?.profiles?.username}</TableCell>
                <TableCell>
                  {new Date(answer?.submitted_at).toLocaleString()}
                </TableCell>
                <TableCell>{answer?.status}</TableCell>
                <TableCell>
                  {answer.status === "PENDING" && (
                    <>
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
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center font-bold">
                No Pending Answers
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
