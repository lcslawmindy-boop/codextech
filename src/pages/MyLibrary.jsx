import { Link } from "react-router-dom";
import { Heart, BookOpen, Wrench, ArrowLeft, Trash2 } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

export default function MyLibrary() {
  const { favorites, toggle } = useFavorites();

  const courses = favorites.filter(f => f.type === "course");
  const builds = favorites.filter(f => f.type === "build");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-5 py-4 flex items-center gap-4 sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <div className="flex items-center gap-2">
          <Heart size={16} className="text-pink-400 fill-pink-400" />
          <h1 className="text-white font-black text-lg">My Library</h1>
        </div>
        <span className="text-gray-600 text-xs ml-auto">{favorites.length} saved item{favorites.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-10">
        {favorites.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={48} className="mx-auto mb-4 text-gray-800" />
            <h2 className="text-white font-black text-2xl mb-2">No saved items yet</h2>
            <p className="text-gray-500 text-sm mb-8">Hit the ♥ button on any course or build plan to save it here for quick access.</p>
            <div className="flex justify-center gap-4">
              <Link to="/courses" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all">Browse Courses</Link>
              <Link to="/invention-plans" className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-all">Browse Build Plans</Link>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Courses */}
            {courses.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen size={16} className="text-blue-400" />
                  <h2 className="text-white font-black text-lg">Saved Courses</h2>
                  <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{courses.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courses.map(item => (
                    <FavoriteCard key={item.id} item={item} onRemove={() => toggle(item)} />
                  ))}
                </div>
              </section>
            )}

            {/* Builds */}
            {builds.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Wrench size={16} className="text-orange-400" />
                  <h2 className="text-white font-black text-lg">Saved Build Plans</h2>
                  <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{builds.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {builds.map(item => (
                    <FavoriteCard key={item.id} item={item} onRemove={() => toggle(item)} />
                  ))}
                </div>
              </section>
            )}

            <div className="pt-4 border-t border-gray-800 text-center">
              <p className="text-gray-600 text-xs">Items saved in browser storage · available for your 30-day access window</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FavoriteCard({ item, onRemove }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-600 transition-all">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}40` }}>
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-sm leading-snug truncate">{item.title}</p>
        {item.tagline && <p className="text-xs italic truncate mt-0.5" style={{ color: item.color }}>{item.tagline}</p>}
        {item.price && <p className="text-green-400 text-xs font-bold mt-0.5">{item.price}</p>}
      </div>
      <button onClick={onRemove} title="Remove from library"
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-950/30 transition-all"
        style={{ minHeight: "unset" }}>
        <Trash2 size={13} />
      </button>
    </div>
  );
}