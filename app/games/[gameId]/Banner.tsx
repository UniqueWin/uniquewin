import React from "react";
import { motion } from "framer-motion";

type Props = {};

function Banner({}: Props) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-red-800 rounded-lg text-white p-4 text-center mb-8"
      >
        <h3 className="text-xl font-bold">DON'T MISS THE 8PM RESULTS SHOW</h3>
        <p>EVERY MONDAY NIGHT LIVE ON FACEBOOK</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="flex f justify-between items-center mb-8 text-card-foreground p-4 gap-10"
      >
        <div className="w-full bg-red-800 rounded-lg h-32 mb-4 md:mb-0">
          <p className="text-white p-4">
            "I won £500 last week with UniqueWin! It's so exciting!" - Sarah T.
          </p>
        </div>
        <div className="w-full p-4 md:pl-4 bg-red-800 rounded-lg h-32 text-white">
          <h3 className="text-xl font-bold">NEW WINNERS EVERYDAY</h3>
          <p>WILL YOU BE NEXT?</p>
        </div>
      </motion.div>
    </>
  );
}

export default Banner;
