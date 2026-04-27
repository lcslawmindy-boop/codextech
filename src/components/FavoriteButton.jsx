import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

/**
 * FavoriteButton — toggle heart to save an item to My Library
 * item: { id, title, type ("course"|"build"), color, icon, price, tagline }
 */
export default function FavoriteButton({ item, className = "" }) {
  const { toggle, isFavorited } = useFavorites();
  const favorited = isFavorited(item.id);

  return (
    <button
      onClick={(e) => { e.stopPropagation(); toggle(item); }}
      title={favorited ? "Remove from My Library" : "Save to My Library"}
      className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
        favorited
          ? "bg-pink-600 border-pink-500 text-white"
          : "bg-gray-800 border-gray-700 text-gray-500 hover:border-pink-500 hover:text-pink-400"
      } ${className}`}
      style={{ minHeight: "unset" }}
    >
      <Heart size={14} fill={favorited ? "currentColor" : "none"} />
    </button>
  );
}