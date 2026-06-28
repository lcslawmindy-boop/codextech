import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

/**
 * ActionSheet — mobile-native bottom-sheet select replacement.
 * Props:
 *   open: boolean
 *   onClose: () => void
 *   title: string
 *   options: Array<{ value: string, label: string }>
 *   value: string (current value)
 *   onChange: (value: string) => void
 */
export default function ActionSheet({ open, onClose, title, options = [], value, onChange }) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSelect = (val) => {
    onChange(val);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 rounded-t-3xl overflow-hidden"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 16px)" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-600" />
            </div>

            {/* Title */}
            {title && (
              <div className="px-5 py-3 border-b border-gray-800">
                <p className="text-gray-400 text-sm font-semibold text-center">{title}</p>
              </div>
            )}

            {/* Options */}
            <div className="max-h-72 overflow-y-auto divide-y divide-gray-800/50">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-800/60 active:bg-gray-800 ${
                    value === opt.value ? "text-cyan-400" : "text-white"
                  }`}
                >
                  <span className="text-base font-medium">{opt.label}</span>
                  {value === opt.value && <Check size={18} className="text-cyan-400 flex-shrink-0" />}
                </button>
              ))}
            </div>

            {/* Cancel */}
            <div className="px-4 pt-2 pb-1">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-base transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}