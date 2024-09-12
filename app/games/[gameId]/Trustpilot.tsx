import React from "react";
import { motion } from "framer-motion";

type Props = {};

function TrustPilot({}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="bg-red-800 p-4 text-center rounded-lg"
    >
      <p className="text-white">Trustpilot Rating: 4.8/5 from 1000+ reviews</p>
    </motion.div>
  );
}

export default TrustPilot;
