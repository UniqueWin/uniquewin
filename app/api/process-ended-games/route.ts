import { NextResponse } from "next/server";
import { processEndedGames } from "@/utils/gameLogic";

export async function GET() {
  try {
    await processEndedGames();
    return NextResponse.json({ message: "Ended games processed successfully" });
  } catch (error) {
    console.error("Error processing ended games:", error);
    return NextResponse.json({ error: "Failed to process ended games" }, { status: 500 });
  }
}