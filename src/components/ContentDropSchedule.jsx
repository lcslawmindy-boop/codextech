import { Calendar, Plus } from "lucide-react";

export default function ContentDropSchedule() {
  return (
    <div className="bg-gradient-to-r from-purple-950/30 to-pink-950/30 border border-purple-700/50 rounded-2xl p-6 my-8">
      <div className="flex items-start gap-4">
        <div className="text-3xl">📅</div>
        <div>
          <h3 className="text-white font-black mb-2">New Content Every Month</h3>
          <p className="text-gray-400 text-sm mb-4">
            <strong>Every 100 members</strong>, 1 new course + 1 new build plan drops. Members get instant access automatically. À la carte buyers can purchase individually.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-purple-300">
              <Plus size={12} /> 1 Course monthly
            </div>
            <div className="flex items-center gap-1.5 text-pink-300">
              <Plus size={12} /> 1 Build plan monthly
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}