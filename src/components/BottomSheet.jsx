import { useEffect, useRef } from "react";
import { X, Check } from "lucide-react";

/**
 * Native-style bottom sheet for select/picker interactions.
 * Usage:
 *   <BottomSheet
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     title="Choose Option"
 *     options={[{ value: "a", label: "Option A" }]}
 *     value={selected}
 *     onChange={(val) => setSelected(val)}
 *   />
 */
export default function BottomSheet({ open, onClose, title, options = [], value, onChange }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handleSelect = (val) => {
    onChange(val);
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-end"
      style={{ overscrollBehavior: "none" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div
        className="relative w-full bg-gray-900 rounded-t-3xl border-t border-gray-700 z-10"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-gray-600" />
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-800">
          <h3 className="text-white font-bold text-base">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Options */}
        <div className="overflow-y-auto max-h-72 py-2">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-gray-800/60 active:bg-gray-700/60"
                style={{ minHeight: 44 }}
              >
                <span className={`text-sm ${isSelected ? "text-yellow-400 font-bold" : "text-gray-200"}`}>
                  {opt.label}
                </span>
                {isSelected && <Check size={16} className="text-yellow-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}