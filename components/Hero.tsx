import CustomSwitch from "./CustomSwitch";
import { Button } from "./ui/button";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

const placeholders = [
  {
    question: "Name a boys name beginning with 'T':",
    answers: ["Thomas", "Timothy", "Toby", "Tyler"],
  },
  {
    question: "Name a girls name beginning with 'A':",
    answers: ["Ava", "Amelia", "Aria", "Aurora"],
  },
  {
    question: "Name a country beginning with 'S':",
    answers: ["Spain", "Sweden", "Switzerland", "Sri Lanka"],
  },
  {
    question: "Name a city beginning with 'L':",
    answers: ["London", "Los Angeles", "Lisbon", "Lima"],
  },
  {
    question: "Name a fruit beginning with 'B':",
    answers: ["Banana", "Blueberry", "Blackberry", "Berry"],
  },
  {
    question: "Name a vegetable beginning with 'C':",
    answers: ["Carrot", "Cucumber", "Cabbage", "Celery"],
  },
  {
    question: "Name a color beginning with 'R':",
    answers: ["Red", "Rose", "Ruby", "Rust"],
  },
  {
    question: "Name a flower beginning with 'D':",
    answers: ["Daisy", "Daffodil", "Dahlia", "Dandelion"],
  },
  {
    question: "Name a bird beginning with 'E':",
    answers: ["Eagle", "Emu", "Eagle", "Eagle"],
  },
  {
    question: "Name a mammal beginning with 'F':",
    answers: ["Fox", "Frog", "Falcon", "Falcon"],
  },
  {
    question: "Name a reptile beginning with 'G':",
    answers: ["Gecko", "Gecko", "Gecko", "Gecko"],
  },
  {
    question: "Name a fish beginning with 'H':",
    answers: ["Herring", "Herring", "Herring", "Herring"],
  },
  {
    question: "Name a insect beginning with 'I':",
    answers: ["Iguana", "Iguana", "Iguana", "Iguana"],
  },
  {
    question: "Name a amphibian beginning with 'J':",
    answers: ["Jaguar", "Jaguar", "Jaguar", "Jaguar"],
  },
  {
    question: "Name a animal beginning with 'K':",
    answers: ["Kangaroo", "Kangaroo", "Kangaroo", "Kangaroo"],
  },
  {
    question: "Name a animal beginning with 'L':",
    answers: ["Lion", "Lion", "Lion", "Lion"],
  },
  {
    question: "Name a animal beginning with 'M':",
    answers: ["Monkey", "Monkey", "Monkey", "Monkey"],
  },
  {
    question: "Name a animal beginning with 'N':",
    answers: ["Narwhal", "Narwhal", "Narwhal", "Narwhal"],
  },
  {
    question: "Name a animal beginning with 'O':",
    answers: ["Owl", "Owl", "Owl", "Owl"],
  },
  {
    question: "Name a animal beginning with 'P':",
    answers: ["Penguin", "Penguin", "Penguin", "Penguin"],
  },
  {
    question: "Name a animal beginning with 'Q':",
    answers: ["Quokka", "Quokka", "Quokka", "Quokka"],
  },
  {
    question: "Name a animal beginning with 'R':",
    answers: ["Raccoon", "Raccoon", "Raccoon", "Raccoon"],
  },
  {
    question: "Name a animal beginning with 'S':",
    answers: ["Snake", "Snake", "Snake", "Snake"],
  },
  {
    question: "Name a animal beginning with 'T':",
    answers: ["Turtle", "Turtle", "Turtle", "Turtle"],
  },
  {
    question: "Name a animal beginning with 'U':",
    answers: ["Uakari", "Uakari", "Uakari", "Uakari"],
  },
  {
    question: "Name a animal beginning with 'V':",
    answers: ["Vulture", "Vulture", "Vulture", "Vulture"],
  },
  {
    question: "Name a animal beginning with 'W':",
    answers: ["Walrus", "Walrus", "Walrus", "Walrus"],
  },
  {
    question: "Name a animal beginning with 'X':",
    answers: ["Xenops", "Xenops", "Xenops", "Xenops"],
  },
  {
    question: "Name a animal beginning with 'Y':",
    answers: ["Yak", "Yak", "Yak", "Yak"],
  },
  {
    question: "Name a animal beginning with 'Z':",
    answers: ["Zebra", "Zebra", "Zebra", "Zebra"],
  },
];

const randomPlaceholder =
  placeholders[Math.floor(Math.random() * placeholders.length)];

type Props = {};

function Hero({}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="h-[60vh] sm:h-[60vh] md:h-[65vh] lg:h-[87vh] relative overflow-hidden">
      <div className="absolute inset-[-100%]">
        <div
          className="
          [--aurora:repeating-conic-gradient(from_0deg_at_50%_50%,#6b14cd_0deg_10deg,#8018e9_10deg_20deg)]
          [background-image:var(--aurora)]
          absolute inset-0
          animate-spin-slow
          filter blu
          
        "
        ></div>
      </div>
      <div className="h-100 absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,rgba(75,0,130,0.3)_50%,rgba(75,0,130,0.7)_100%)]"></div>
      <div className="relative z-10 h-full flex flex-col items-center justify-start md:justify-start mt-44 sm:mt-64 md:mt-80 lg:mt-[500px] xl:mt-[500px] 2xl:mt-[500px] px-4 overflow-y-auto">
        <div className="text-white mb-4 bg-black bg-opacity-20 p-4 px-4 md:px-10 rounded-[30px] border2 border-white border-opacity-40 w-full sm:max-w-md md:max-w-2xl z-20">
          <div className="flex gap-1 md:gap-2 mx-auto w-full justify-center items-center">
            {Array.from({ length: 30 }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500 blur-[1px] animate-flash`}
                style={{ animationDelay: `${index * 0.05}s` }} // Faster delay
              ></div>
            ))}
          </div>
          <div className="py-4 flex flex-col gap-2 items-center">
            <h2 className="text-xl md:text-3xl font-bold text-center">
              Name the boss name beginning with 'T':
            </h2>
            <CustomSwitch
              label="Lucky Dip"
              onChange={(checked) => console.log("Switch is now:", checked)}
            />
            <div className="flex flex-col sm:flex-row gap-2 w-full justify-center items-center">
              <PlaceholdersAndVanishInput
                placeholders={placeholders.map(
                  (placeholder) => placeholder.question
                )}
                onChange={handleChange}
                onSubmit={onSubmit}
                className="w-full sm:w-96 rounded-lg px-0"
              />
              <Button
                variant="secondary"
                size="lg"
                className="text-white font-semibold text-xl h-12 bg-gradient-to-t from-[#347158] to-[#58e364] from-30% to-100% w-full sm:w-28 mt-2 sm:mt-0"
              >
                Answer!
              </Button>
            </div>
          </div>
          <div className="flex gap-1 md:gap-2 mx-auto w-full justify-center items-center rotate-180">
            {Array.from({ length: 30 }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500 blur-[1px] animate-flash`}
                style={{ animationDelay: `${index * 0.05}s` }} // Faster delay
              ></div>
            ))}
          </div>
        </div>

        <p className="text-white text-sm md:text-base mt-2">
          Cost £1 to play £5 lucky dip
        </p>
      </div>
    </div>
  );
}

export default Hero;
