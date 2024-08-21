"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCurrentUser } from "@/utils/dataHelpers";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      const currentUser = getCurrentUser(parseInt(userId));
      setUser(currentUser);
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="bg-purple-300 min-h-screen">
      <motion.div
        className="container mx-auto px-4 py-8 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-purple-800">My Profile</h1>
        <div className="bg-purple-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">{user.username}</h2>
          <p>Balance: £{user.balance}</p>
          {/* Add more user details and functionality */}
        </div>
      </motion.div>
    </div>
  );
}