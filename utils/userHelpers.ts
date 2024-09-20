"use client";

import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

export interface ExtendedUser extends SupabaseUser {
  username: string;
  is_admin: boolean;
  credit_balance: number;
  account_balance: number;
  full_name?: string;
  date_of_birth?: string;
  address?: string;
}

export function useUser() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const supabase = createClient();

  const refreshUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      const extendedUser: ExtendedUser = {
        ...user,
        username: profileData.username || "",
        is_admin: profileData.is_admin || false,
        credit_balance: profileData.credit_balance || 0,
        account_balance: profileData.account_balance || 0,
      };
      setUser(extendedUser);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        refreshUser();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const addCredits = async (amount: number) => {
    if (user) {
      const { data, error } = await supabase
        .from("profiles")
        .update({ credit_balance: user.credit_balance + amount })
        .eq("id", user.id);

      if (error) {
        console.error("Error adding credits:", error);
      } else {
        refreshUser();
      }
    }
  };

  const updateUser = async (updatedUserData: Partial<ExtendedUser>) => {
    if (user) {
      const { data, error } = await supabase
        .from("profiles")
        .update(updatedUserData)
        .eq("id", user.id);

      if (error) {
        console.error("Error updating user:", error);
      } else {
        refreshUser();
      }
    }
  };

  const getUserWinnings = async (userId: string) => {
    const { data, error } = await supabase
      .from("winners")
      .select("prize_amount")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user winnings:", error);
      return 0;
    }

    return data.reduce((total, winner) => total + Number(winner.prize_amount), 0);
  };

  return { user, refreshUser, addCredits, updateUser, getUserWinnings };
}
