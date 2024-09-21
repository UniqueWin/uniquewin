import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="bg-purple-500 text-white rounded-lg p-8 my-8">
      <h1 className="text-4xl font-bold mb-4">Find a Unique Answer and WIN!</h1>
      <div className="bg-white rounded-lg p-4 mb-4">
        <h2 className="text-purple-700 text-xl font-semibold mb-2">
          Name the boss name beginning with &apos;T&apos;:
        </h2>
        <div className="flex">
          <Input
            type="text"
            placeholder="Type your answer here..."
            className="flex-grow mr-2"
          />
          <Button>Answer!</Button>
        </div>
      </div>
      <div className="text-right">
        <span className="bg-yellow-400 text-purple-700 font-bold px-4 py-2 rounded-full">
          £1,500.99
        </span>
      </div>
    </section>
  );
}
