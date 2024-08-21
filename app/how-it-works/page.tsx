import React from "react";

type Props = {};

function page({}: Props) {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">How UniqueWin Works</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3 Ways to Win!</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-purple-100 p-4 rounded">
            <h3 className="text-xl font-bold mb-2">1. Find a Unique Answer</h3>
            <p>Find a unique answer & win the jackpot.</p>
          </div>
          <div className="bg-purple-100 p-4 rounded">
            <h3 className="text-xl font-bold mb-2">2. Instant Prizes</h3>
            <p>
              Find one of our hidden answers & win an instant cash prize or game
              credit.
            </p>
          </div>
          <div className="bg-purple-100 p-4 rounded">
            <h3 className="text-xl font-bold mb-2">3. Live Raffle</h3>
            <p>All entries go into a raffle for another chance to win.</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">How to Play</h2>
        <ol className="list-decimal list-inside">
          <li>Choose a game from our list of active games.</li>
          <li>
            Submit your answer for £1, or use the Lucky Dip option for £5.
          </li>
          <li>Wait for the game to end to see if your answer is unique!</li>
        </ol>
      </div>
    </div>
  );
}

export default page;
