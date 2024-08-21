"use client";

import { useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  balance: number;
}

const STORAGE_KEY = "currentUser";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const addCredits = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, balance: user.balance + amount };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  return { user, login, logout, addCredits };
}

// Emulate login function (for development purposes)
export function emulateLogin(
  userId: number,
  username: string,
  email: string,
  initialBalance: number
) {
  const userData: User = { id: userId, username, email, balance: initialBalance };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
}