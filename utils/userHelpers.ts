"use client";

import { useEffect, useState } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
  balance: number;
}

const STORAGE_KEY = "currentUser";

export function useUser<T extends User>() {
  const [user, setUser] = useState<T | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser) as T);
    }
  }, []);

  const login = (userData: T) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const addCredits = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, balance: user.balance + amount } as T;
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  const updateUser = (updatedUserData: Partial<T>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedUserData } as T;
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  return { user, login, logout, addCredits, updateUser };
}

// Emulate login function (for development purposes)
export function emulateLogin(
  userId: number,
  username: string,
  email: string,
  initialBalance: number
) {
  const userData: User = {
    id: userId,
    username,
    email,
    balance: initialBalance,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
}
