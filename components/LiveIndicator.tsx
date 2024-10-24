import { Game } from "@/utils/dataHelpers";
import { ChevronRight, Circle } from "lucide-react";
import Link from "next/link";

type Props = {
  currentGame: Game | null;
};

function LiveIndicator({ currentGame }: Props) {
  return (
    <div className="absolute top-4 right-4 z-20 select-none">
      <div className="z-10 flex items-center justify-center">
        <Link
          href="/games"
          className="flex items-center bg-black/40 p-1 rounded-full"
        >
          <Circle
            className="mr-1 h-4 w-4"
            fill={currentGame?.status === "active" ? "#00ff00" : "#ff0000"}
          />
          <span>{currentGame?.status === "active" ? "LIVE" : " "}</span>
          <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

export default LiveIndicator;
