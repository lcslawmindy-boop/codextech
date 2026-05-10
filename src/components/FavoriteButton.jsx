import { useState } from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

/**
 * FavoriteButton — toggle heart to save an item to My Library
 * Optimistic: UI updates instantly on tap, localStorage synced immediately.
 * item: { id, title, type ("course"|"build"), color, icon, price, tagline }
 */
export default function FavoriteButton({ item, className = "" }) {
  const { toggle, isFavorited } = useFavorites();
  const favorited = isFavorited(item.id);
  const [popping, setPopping] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    // Toggle immediately (optimistic) — localStorage updated synchronously in hook
    toggle(item);
    // Trigger pop animation
    setPopping(true);
    setTimeout(() => setPopping(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      title={favorited ? "Remove from My Library" : "Save to My Library"}
      className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
        favorited
          ? "bg-pink-600 border-pink-500 text-white"
          : "bg-gray-800 border-gray-700 text-gray-500 hover:border-pink-500 hover:text-pink-400"
      } ${className}`}
      style={{
        minHeight: "unset",
        transform: popping ? "scale(1.35)" : "scale(1)",
        transition: "transform 0.15s ease, background-color 0.15s ease, border-color 0.15s ease",
      }}
    >
      <Heart size={14} fill={favorited ? "currentColor" : "none"} />
    </button>
  );
}