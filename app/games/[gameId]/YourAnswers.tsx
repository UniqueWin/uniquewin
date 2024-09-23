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

interface UserAnswer {
  answer: string;
  status: string;
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {userAnswers.map((answer, index) => {
              // Trim and normalize case for comparison
              const normalizedAnswer = answer.answer.trim().toLowerCase();
              const uniqueAnswersCount =
                gameAnswers?.filter(
                  (a) => a.answer_text.trim().toLowerCase() === normalizedAnswer
                ).length || 0; // Adjusted to match the answer structure

              const totalUniqueAnswersCount =
                gameAnswers?.filter((a) => a.status === "UNIQUE").length || 0;

              const statusColor =
                totalUniqueAnswersCount > 1 && answer.status === "UNIQUE"
                  ? "text-orange-500"
                  : answer.status === "UNIQUE" && uniqueAnswersCount === 1
                  ? "text-green-500"
                  : answer.status === "NOT UNIQUE"
                  ? "text-red-500"
                  : "text-black";

              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {answer.answer.charAt(0).toUpperCase() +
                      answer.answer.slice(1)}
                  </TableCell>
                  <TableCell className={cn("font-medium", statusColor)}>
                    {answer.status}
                  </TableCell>
                  <TableCell>
                    {uniqueAnswersCount} {/* Display the frequency */}
                  </TableCell>
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
