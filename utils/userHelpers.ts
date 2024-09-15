"use client";

import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";

export interface LocalUser {
  id: string;
  username: string;
  email: string;
  credit_balance: number;
}

export interface ExtendedUser extends SupabaseUser {
  id: string;
  username: string;
  is_admin: boolean;
  email: string;
  credit_balance: number;
  gameHistory?: GameHistoryItem[]; // Add this line
}

// Add this interface for the game history items
export interface GameHistoryItem {
  gameId: string;
  gameName: string;
  playedAt: string;
  result: string;
  answers: Answer[]; // Add this line
}

// Add this interface for the answers
export interface Answer {
  answer: string;
  status: string;
}

const STORAGE_KEY = "currentUser";

export function useUser() {
  const [user, setUser] = useState<ExtendedUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as LocalUser;
      // Convert LocalUser to ExtendedUser
      const extendedUser: ExtendedUser = {
        ...parsedUser,
        is_admin: false, // Set a default value
        app_metadata: {},
        user_metadata: {},
        aud: '',
        created_at: '',
        // Add any other required properties with default values
      };
      setUser(extendedUser);
    }
  }, []);

  const login = (userData: LocalUser) => {
    const extendedUser: ExtendedUser = {
      ...userData,
      is_admin: false,
      app_metadata: {},
      user_metadata: {},
      aud: '',
      created_at: '',
      // Add any other required properties with default values
    };
    setUser(extendedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const addCredits = (amount: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        credit_balance: user.credit_balance + amount,
      } as ExtendedUser;
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  const updateUser = (updatedUserData: Partial<ExtendedUser>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedUserData } as ExtendedUser;
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  return { user, login, logout, addCredits, updateUser };
}

export function emulateLogin(
  userId: string,
  username: string,
  email: string,
  initialBalance: number
) {
  const userData: LocalUser = {
    id: userId,
    username,
    email,
    credit_balance: initialBalance,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
}

export type User = ExtendedUser; // Add this line to export the User type
