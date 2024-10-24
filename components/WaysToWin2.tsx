import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";

export default function WaysToWin2() {
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
      title: "Find a Unique Answer",
      image: "/gifts3.png",
      description:
        "Unleash your creativity and stand a chance to win exclusive prizes by providing a one-of-a-kind answer.",
    },
    {
      title: "Instant Prizes",
      image: "/Chest.png",
      description:
        "Get rewarded instantly with exciting prizes just by participating in our engaging contests.",
    },
    {
      title: "Live Raffle",
      image: "/Pound.png",
      description:
        "Experience the thrill of our live raffles and stand a chance to win big prizes in real-time and live on Facebook.",
    },
  ];

  return (
    <motion.div
      className="text-center px-4 text-black py-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <small className="text-lg text-purple-800 font-semibold">Discover</small>
      <h2 className="text-4xl md:text-6xl font-bold mb-4 text-[#1e1631] py-5">
        3 Ways to Win{" "}
        <span className="p-[0.5px]0.5px] relative whitespace-nowrap">
          <div className="rotate-[-2deg] absolute inset-0 w-full h-full bg-[#f79e07]"></div>
          <span className="relative z-10 text-white">Big Prizes</span>
        </span>
      </h2>
      <p className="mb-10 px-4 lg:max-w-[40%] mx-auto text-lg">
        Explore our exciting opportunities to win unique prizes, instant
        rewards, and participate in live raffles.
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center text-center gap-8 max-w-7xl mx-auto">
        {ways.map((way, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="w-full rounded-xl bg-white text-black shadow-lg lg:max-w-[405px] lg:max-h-[440px] h-[440px]"
          >
            <Image
              src={way.image}
              alt={way.title}
              width={405}
              height={245}
              className="mb-4 rounded-t-xl lg:h-[245px] lg:w-[405px] object-cover"
            />
            <div className="p-4 flex flex-col gap-2 py-6">
              <h3 className="font-bold text-3xl md:text-4xl mb-2 text-[#420982]">
                {way.title}
              </h3>
              <p className="text-lg px-2">{way.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
