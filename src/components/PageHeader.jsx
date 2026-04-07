import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * Standardized mobile-friendly header for sub-pages.
 * Usage: <PageHeader title="Page Title" subtitle="optional" backTo="/path" />
 * If backTo is omitted, uses browser back.
 */
export default function PageHeader({ title, subtitle, backTo, right }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <div
      className="flex-shrink-0 bg-gray-900/90 border-b border-gray-800 backdrop-blur-md px-4"
      style={{ paddingTop: "max(env(safe-area-inset-top), 0px)" }}
    >
      <div className="flex items-center gap-3 h-14">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex-shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold text-[15px] leading-tight truncate">{title}</h1>
          {subtitle && (
            <p className="text-gray-500 text-xs truncate mt-0.5">{subtitle}</p>
          )}
        </div>

        {right && (
          <div className="flex-shrink-0">{right}</div>
        )}
      </div>
    </div>
  );
}