import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Prize } from "./types"; // Import Prize type
import { Coins, Gift, HelpCircle, Lock, Sparkles, Unlock } from "lucide-react";

function PrizeCard({
  prize,
  onReveal,
  winnerName, // Accept winner name as a prop
}: {
  prize: Prize;
  onReveal: (prize: Prize) => void;
  winnerName: string; // Define type for winner name
}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card
        className={`bg-opacity-20 backdrop-blur-lg bg-white cursor-pointer overflow-hidden border-2 min-h-[160px] flex items-center justify-center`}
        onClick={() => onReveal(prize)}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          <motion.div
            animate={{
              rotateY: prize.status === "LOCKED" ? [0, 360] : [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {prize.winner_id ? (
              <Unlock className="w-12 h-12 text-yellow-400 mb-2" /> // Use unlocked padlock for claimed prizes
            ) : (
              <Lock className="w-12 h-12 text-gray-400 mb-2" /> // Use padlock for unclaimed prizes
            )}
          </motion.div>
          <Badge variant="secondary" className="mb-2">
            {prize.prize_type}
          </Badge>
          {prize.status === "SCRATCHED" && winnerName && (
            <p className="text-xs mb-4 text-green-300">
              Claimed by: {winnerName}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default PrizeCard;
