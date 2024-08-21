export default function HowToPlay() {
  const steps = [
    "Choose an active game from our list",
    "Read the question carefully",
    "Submit your answer for £1, or use Lucky Dip for £5",
    "Wait for the game to end to see if your answer is unique",
    "Check the live results show for winners announcement",
  ];

  return (
    <ul className="list-decimal list-inside space-y-4">
      {steps.map((step, index) => (
        <li key={index}>{step}</li>
      ))}
    </ul>
  );
}
