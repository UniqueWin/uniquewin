"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Adjusted import for Tooltip components

interface UserAnswer {
  answer: string;
  status: string;
  isInstantWin: boolean;
  instantWin: string;
  submittedAt: string;
  user_id: string; // Changed to user_id
}

interface YourAnswersProps {
  userAnswers: UserAnswer[];
  gameAnswers: any[]; // Adjust type as necessary
  loading: boolean;
}

const YourAnswers: React.FC<YourAnswersProps> = ({
  userAnswers,
  gameAnswers,
  loading,
}) => {
  if (loading) return <div>Loading your answers...</div>;

  if (userAnswers.length === 0) {
    return (
      <Card className="my-8 text-black">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-red-700">
            No answers submitted yet
          </CardTitle>
        </CardHeader>
        <CardContent className="text-black p-4">
          You haven't submitted any answers for this game yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle className="text-xl text-black font-bold mb-4">
          Your Answers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Your Answer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Instant Win</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userAnswers
              .sort((a, b) => {
                // Sort by status: UNIQUE (Green) first, then UNIQUE (Orange), then NOT UNIQUE
                if (
                  a.status === "UNIQUE" &&
                  a.isInstantWin &&
                  b.status !== "UNIQUE"
                )
                  return -1; // Green UNIQUE first
                if (
                  b.status === "UNIQUE" &&
                  b.isInstantWin &&
                  a.status !== "UNIQUE"
                )
                  return 1; // Green UNIQUE first
                if (a.status === "UNIQUE" && b.status === "UNIQUE") {
                  return a.isInstantWin ? -1 : 1; // Prioritize green over orange
                }
                if (a.status === "UNIQUE" && b.status !== "UNIQUE") return -1; // Keep UNIQUE answers at the top
                if (a.status !== "UNIQUE" && b.status === "UNIQUE") return 1; // Keep UNIQUE answers at the top
                return 0; // Keep original order for equal statuses
              })
              .map((answer, index) => {
                // Trim and normalize case for comparison
                const normalizedAnswer = answer.answer.trim().toLowerCase();

                // Count how many unique answers each user has
                const uniqueAnswersByUser =
                  gameAnswers?.filter(
                    (a) =>
                      a.answer_text.trim().toLowerCase() === normalizedAnswer &&
                      a.user_id === answer.user_id // Check if the answer is from the same user
                  ).length || 0;

                // Count how many unique users have submitted unique answers
                const uniqueUsersCount = new Set(
                  gameAnswers
                    .filter((a) => a.status === "UNIQUE")
                    .map((a) => a.user_id) // Changed to user_id
                ).size;

                const statusColor =
                  uniqueUsersCount > 1 && answer.status === "UNIQUE"
                    ? "text-orange-500" // More than 1 user has unique answers
                    : uniqueUsersCount === 1 && answer.status === "UNIQUE"
                    ? "text-green-500" // Only 1 user has unique answers
                    : answer.status === "NOT UNIQUE"
                    ? "text-red-500"
                    : "text-black";

                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {answer.answer.charAt(0).toUpperCase() +
                        answer.answer.slice(1)}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={cn("font-medium", statusColor)}>
                              {answer.status}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center mb-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
                                <p
                                  className={`text-sm ${
                                    uniqueUsersCount > 1 &&
                                    answer.status === "UNIQUE"
                                      ? "font-bold"
                                      : ""
                                  }`}
                                >
                                  Unique (Orange): More than 1 person has a
                                  unique answer
                                </p>
                              </div>
                              <div className="flex items-center mb-2">
                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                                <p
                                  className={`text-sm ${
                                    uniqueUsersCount === 1 &&
                                    answer.status === "UNIQUE"
                                      ? "font-bold"
                                      : ""
                                  }`}
                                >
                                  Unique (Green): You are the only player with a
                                  unique answer
                                </p>
                              </div>
                              <div className="flex items-center mb-2">
                                <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                                <p
                                  className={`text-sm ${
                                    answer.status === "NOT UNIQUE"
                                      ? "font-bold"
                                      : ""
                                  }`}
                                >
                                  Not Unique: Not unique, someone else has this
                                  answer
                                </p>
                              </div>
                              <div className="flex items-center mb-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                                <p
                                  className={`text-sm ${
                                    answer.status === "PENDING"
                                      ? "font-bold"
                                      : ""
                                  }`}
                                >
                                  Pending: This answer is awaiting review
                                </p>
                              </div>
                              <div className="flex items-center mb-2">
                                <div className="w-3 h-3 rounded-full bg-gray-500 mr-2" />
                                <p
                                  className={`text-sm ${
                                    answer.status === "REJECTED"
                                      ? "font-bold"
                                      : ""
                                  }`}
                                >
                                  Rejected: This answer was declined
                                </p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      {uniqueAnswersByUser} {/* Display the frequency */}
                    </TableCell>
                    <TableCell>{answer.isInstantWin ? "Yes" : "No"}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default YourAnswers;
