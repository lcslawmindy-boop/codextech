import { Calendar, Plus } from "lucide-react";

export default function ContentDropSchedule() {
  const nextDropDate = new Date();
  nextDropDate.setDate(nextDropDate.getDate() + (14 - nextDropDate.getDay()));

  return (
    <div className="bg-gradient-to-r from-purple-950/30 to-pink-950/30 border border-purple-700/50 rounded-2xl p-6 my-8">
      <div className="flex items-start gap-4">
        <div className="text-3xl">📅</div>
        <div>
          <h3 className="text-white font-black mb-2">New Content Every 2 Weeks</h3>
          <p className="text-gray-400 text-sm mb-4">
            Next new course + new build plan drops <strong>{nextDropDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</strong>. Members get instant access. À la carte buyers can grab individually.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-purple-300">
              <Plus size={12} /> Course added
            </div>
            <div className="flex items-center gap-1.5 text-pink-300">
              <Plus size={12} /> Build plan added
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}