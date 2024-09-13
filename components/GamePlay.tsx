"use client";

import React, { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { LoginModal } from "./LoginModal";

interface GamePlayProps {
  game: any;
  userId: string | null;
}

export const GamePlay: React.FC<GamePlayProps> = ({ game, userId }) => {
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setMessage('You must be logged in to submit an answer.');
      return;
    }

    const { data, error } = await supabase
      .from('answers')
      .insert({
        game_id: game.id,
        user_id: userId,
        answer_text: answer,
        status: 'pending',
      })
      .select();

    if (error) {
      console.error('Error submitting answer:', error);
      setMessage('Error submitting your answer. Please try again.');
    } else {
      setMessage('Your answer has been submitted successfully!');
      setAnswer('');
    }
  };

  const handleLogin = () => {
    // Refresh the user ID after login
    // You might need to pass a function to refresh the user ID from the parent component
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">{game.question}</h2>
      {userId ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
            className="w-full p-2 border rounded mb-4"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Answer
          </button>
        </form>
      ) : (
        <div>
          <p className="text-red-500 mb-4">You must be logged in to play this game.</p>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Log In
          </button>
        </div>
      )}
      {message && <p className="mt-4 text-green-600">{message}</p>}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        isSignUp={false} // Add this line
      />
    </div>
  );
};