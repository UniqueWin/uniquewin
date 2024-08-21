"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/utils/userHelpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { user, addCredits, updateUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  if (!user) return <div>Loading...</div>;

  const handleSave = () => {
    updateUser(editedUser);
    setEditMode(false);
  };

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
          {editMode ? (
            <>
              <Input
                className="mb-4"
                value={editedUser.username}
                onChange={(e) => setEditedUser({...editedUser, username: e.target.value})}
                placeholder="Username"
              />
              <Input
                className="mb-4"
                value={editedUser.email}
                onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                placeholder="Email"
              />
              <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 mr-2">
                Save
              </Button>
              <Button onClick={() => setEditMode(false)} className="bg-red-500 hover:bg-red-600">
                Cancel
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4 text-purple-700">{user.username}</h2>
              <p className="mb-2">Email: {user.email}</p>
              <p className="mb-4">Balance: £{user.balance}</p>
              <Button 
                onClick={() => setEditMode(true)}
                className="bg-blue-500 hover:bg-blue-600 mr-2"
              >
                Edit Profile
              </Button>
              <Button 
                onClick={() => addCredits(10)} 
                className="bg-orange-500 hover:bg-orange-600"
              >
                Add £10 Credits
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}