import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function WaysToWin() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Reduced for a smoother effect
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const ways = [
    {
      title: "1. Find a Unique Answer",
      description:
        "Submit a unique answer to win the jackpot. If your answer is the only one of its kind, you win!",
    },
    {
      title: "2. Instant Prizes",
      description:
        "Some answers have instant win prizes attached. Reveal your prize right after submitting!",
    },
    {
      title: "3. Live Raffle",
      description:
        "All entries go into a raffle drawn during our live show. Another chance to win big!",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {ways.map((way, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-purple-600">
                {way.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{way.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
