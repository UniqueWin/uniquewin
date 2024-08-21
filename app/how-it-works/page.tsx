import Image from "next/image";

export default function HowItWorksPage() {
  return (
    <div className="bg-purple-300 min-h-screen">
      <main className="container mx-auto p-4">
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
              <p>Find a unique answer & win the jackpot.</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-bold mb-2 text-purple-600">
                2. Instant Prizes
              </h3>
              <p>
                Find one of our hidden answers & win an instant cash prize or
                game credit.
              </p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-bold mb-2 text-purple-600">
                3. Live Raffle
              </h3>
              <p>All entries go into a raffle for another chance to win.</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-100 p-6 rounded-lg mb-8 shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            How to Play
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Choose a game from our list of active games.</li>
            <li>
              Submit your answer for £1, or use the Lucky Dip option for £5.
            </li>
            <li>Wait for the game to end to see if your answer is unique!</li>
          </ol>
        </div>

        <div className="bg-purple-100 p-6 rounded-lg shadow-md">
          <Image
            src="/mockup.jpg"
            alt="How it works diagram"
            width={800}
            height={600}
            className="w-full h-auto"
          />
        </div>
      </main>
    </div>
  );
}
