import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const now = new Date().toISOString();

      // Update all active games that have passed their end time
      const { data, error } = await supabase
        .from("games")
        .update({ status: "ended" })
        .eq("status", "active")
        .lt("end_time", now)
        .select();

      if (error) throw error;

      res
        .status(200)
        .json({ message: `Closed ${data?.length || 0} expired games` });
    } catch (error) {
      console.error("Error closing expired games:", error);
      res.status(500).json({ error: "Failed to close expired games" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
