import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "zarp_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggle = useCallback((item) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === item.id);
      if (exists) return prev.filter(f => f.id !== item.id);
      return [...prev, { ...item, savedAt: Date.now() }];
    });
  }, []);

  const isFavorited = useCallback((id) => favorites.some(f => f.id === id), [favorites]);

  return { favorites, toggle, isFavorited };
}