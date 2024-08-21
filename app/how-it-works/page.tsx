export default function HowItWorksPage() {
  return (
    <div className="bg-purple-300 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-purple-800">
          How UniqueWin Works
        </h1>

        <div className="bg-purple-100 p-6 rounded-lg mb-8 shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            3 Ways to Win!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-bold mb-2 text-purple-600">
                1. Find a Unique Answer
              </h3>
              <p>
                Submit a unique answer to win the jackpot. If your answer is the
                only one of its kind, you win!
              </p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-bold mb-2 text-purple-600">
                2. Instant Prizes
              </h3>
              <p>
                Some answers have instant win prizes attached. Reveal your prize
                right after submitting!
              </p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-bold mb-2 text-purple-600">
                3. Live Raffle
              </h3>
              <p>
                All entries go into a raffle drawn during our live show. Another
                chance to win big!
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-100 p-6 rounded-lg mb-8 shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            How to Play
          </h2>
          <ol className="list-decimal list-inside space-y-4">
            <li>Choose an active game from our list</li>
            <li>Read the question carefully</li>
            <li>Submit your answer for £1, or use Lucky Dip for £5</li>
            <li>Wait for the game to end to see if your answer is unique</li>
            <li>Check the live results show for winners announcement</li>
          </ol>
        </div>

        <div className="bg-purple-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">What is a unique answer?</h3>
              <p>
                A unique answer is one that no other player has submitted for
                that game.
              </p>
            </div>
            <div>
              <h3 className="font-bold">How do I know if I've won?</h3>
              <p>
                Check your game history or tune into our live results show every
                Monday at 8PM on Facebook.
              </p>
            </div>
            <div>
              <h3 className="font-bold">What is Lucky Dip?</h3>
              <p>
                Lucky Dip automatically selects an answer for you from our list
                of valid answers. It costs £5 but guarantees a valid entry.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
