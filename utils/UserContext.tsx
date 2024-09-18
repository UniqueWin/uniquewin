"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { ExtendedUser } from "./userHelpers";
import { createClient } from "@/utils/supabase/client";

interface UserContextType {
  user: ExtendedUser | null;
  setUser: React.Dispatch<React.SetStateAction<ExtendedUser | null>>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const supabase = createClient();

  const refreshUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
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
        id: user.id,
        username: profileData.username || "",
        is_admin: profileData.is_admin || false,
        email: user.email || "",
        account_balance: profileData.account_balance || 0,
        credit_balance: profileData.credit_balance || 0,
      };
      setUser(extendedUser);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const 
useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
