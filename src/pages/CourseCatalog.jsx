import { useState } from "react";
import { itemImages } from "../lib/itemImages";
import { courseSlugMap } from "../lib/coursePlans";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Play, ChevronDown, ChevronUp, Star, Users, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useTier } from "../hooks/useTier";
import { tierCanAccessCourse } from "../lib/tiers";
import TierGate from "../components/TierGate";
import { businessItems } from "../lib/businessItems";
import { base44 } from "@/api/base44Client";

const courses = businessItems.filter(i => i.category === "Course");
const pdfs = businessItems.filter(i => i.category === "Book/PDF");

// Parse first dollar amount from a price string like "$147" or "$39 PDF / $69 print"
function parsePriceCents(priceStr) {
  const match = priceStr.match(/\$(\d+)/);
  return match ? parseInt(match[1]) * 100 : null;
}

function isInIframe() {
  try { return window.self !== window.top; } catch { return true; }
}

function CheckoutButton({ item, label }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setError(null);

    if (isInIframe()) {
      setError("Checkout is only available on the published app, not the preview.");
      return;
    }

    const priceInCents = parsePriceCents(item.price);
    if (!priceInCents) {
      setError("Could not determine product price.");
      return;
    }

    setLoading(true);
    const origin = window.location.origin;
    const successUrl = `${origin}/courses?success=1&product=${encodeURIComponent(item.title)}`;
    const cancelUrl = `${origin}/courses`;

    const res = await base44.functions.invoke("createCheckoutSession", {
      title: item.title,
      priceInCents,
      description: item.tagline,
      category: item.category,
      successUrl,
      cancelUrl,
    });

    setLoading(false);

    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      setError(res.data?.error || "Checkout failed. Please try again.");
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ backgroundColor: item.color }}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : null}
        {loading ? "Redirecting…" : label}
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-400 flex items-start gap-1">
          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

function CourseCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const image = itemImages[item.title];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all flex flex-col">
      {image ? (
        <div className="w-full h-44 overflow-hidden relative">
          <img src={image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="h-1.5 w-full" style={{ backgroundColor: item.color }} />
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-3xl">{item.icon}</span>
          <span className="text-green-400 font-bold text-lg whitespace-nowrap">{item.price}</span>
        </div>

        <h3 className="text-white font-bold text-xl leading-snug mb-1">{item.title}</h3>
        <p className="text-sm italic mb-3" style={{ color: item.color }}>"{item.tagline}"</p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1"><Users size={11} /> {item.audience.split(",")[0]}</span>
          {item.modules.length > 0 && (
            <span className="flex items-center gap-1"><Play size={11} /> {item.modules.length} modules</span>
          )}
          <span className="flex items-center gap-1"><Star size={11} className="text-yellow-500" /> Instant access</span>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-4">{item.description}</p>

        {item.modules.length > 0 && (
          <>
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors mb-3"
            >
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {expanded ? "Hide" : "View"} curriculum ({item.modules.length} modules)
            </button>
            {expanded && (
              <ol className="list-decimal list-inside space-y-1.5 mb-4 border-l-2 border-gray-700 ml-2 pl-4">
                {item.modules.map((m, i) => (
                  <li key={i} className="text-gray-400 text-xs leading-snug">{m}</li>
                ))}
              </ol>
            )}
          </>
        )}

        <div className="mt-auto pt-4 border-t border-gray-800">
          <CheckoutButton item={item} label={`Enroll Now — ${item.price}`} />
          <div className="flex items-center justify-between mt-3">
            <p className="text-gray-700 text-xs">
              <span className="text-gray-600">Source: </span>{item.source}
            </p>
            <Link to="/pricing" className="text-xs text-gray-500 hover:text-cyan-400 transition-colors whitespace-nowrap ml-3">
              View with Pro →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function PdfCard({ item }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-all flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ backgroundColor: item.color + "20" }}>
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-white font-bold text-base leading-snug">{item.title}</h3>
          <span className="text-green-400 font-bold text-sm whitespace-nowrap">{item.price}</span>
        </div>
        <p className="text-xs italic mb-2" style={{ color: item.color }}>"{item.tagline}"</p>
        <p className="text-gray-400 text-sm leading-relaxed mb-3">{item.description}</p>
        <p className="text-gray-600 text-xs mb-3">
          <span className="text-gray-500 font-semibold">Source: </span>{item.source}
        </p>
        <CheckoutButton item={item} label={`Get PDF — ${item.price}`} />
      </div>
    </div>
  );
}

function SuccessBanner({ productName }) {
  return (
    <div className="mx-6 mt-6 bg-green-950 border border-green-700 rounded-2xl p-6 flex items-start gap-4">
      <CheckCircle2 size={32} className="text-green-400 flex-shrink-0 mt-0.5" />
      <div>
        <h2 className="text-green-300 font-bold text-xl mb-1">Payment Successful!</h2>
        <p className="text-green-200 text-sm leading-relaxed">
          Thank you for your purchase{productName ? ` of "${productName}"` : ""}. You will receive access details by email shortly.
        </p>
        <p className="text-green-600 text-xs mt-2">A receipt has been sent to your registered email address.</p>
      </div>
    </div>
  );
}

export default function CourseCatalog() {
  const { tier } = useTier();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isSuccess = params.get("success") === "1";
  const purchasedProduct = params.get("product");

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex-shrink-0">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png" alt="C.O.D.E.X.T.E.C.H." className="h-9 w-9 object-contain" />
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">Courses & Research Documents</h1>
            <p className="text-gray-500 text-xs">Primary-source curriculum from the Bearden archive · {courses.length} courses · {pdfs.length} PDF books</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <Link to="/prior-art" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-800 text-purple-300 hover:bg-purple-800/40 transition-colors font-semibold">
            🗄️ Research Archive
          </Link>
          <Link to="/my-learning" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-700 text-purple-300 hover:bg-purple-800/40 transition-colors font-semibold">
            🎓 My Learning
          </Link>
        </div>
      </div>

      {isSuccess && <SuccessBanner productName={purchasedProduct} />}

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-7xl mx-auto w-full">
        {!isSuccess && (
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-3">Master Bearden's Scalar EM Framework</h2>
            <p className="text-gray-400 leading-relaxed">
              Every course and document is built directly from primary source material — original Bearden papers (1982–2002),
              Soviet research declassified citations, and the full annotated archive. No speculation. All source-documented.
            </p>
          </div>
        )}

        {/* Courses */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <Play size={16} className="text-blue-400" />
            <h2 className="text-white font-bold text-xl">Video Courses</h2>
            <span className="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-gray-800">{courses.length} available</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((item, i) => (
              <TierGate key={i} locked={!tierCanAccessCourse(tier, i)} requiredTier={i < 4 ? "starter" : "researcher"}>
                <CourseCard item={item} />
              </TierGate>
            ))}
          </div>
        </section>

        {/* PDFs */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={16} className="text-yellow-400" />
            <h2 className="text-white font-bold text-xl">Books & PDF Documents</h2>
            <span className="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-gray-800">{pdfs.length} available</span>
          </div>
          <div className="flex flex-col gap-4">
            {pdfs.map((item, i) => <PdfCard key={i} item={item} />)}
          </div>
        </section>

        <div className="mt-12 text-center text-gray-600 text-xs">
          All products are digital. Instant access upon purchase. NDA applies. Payments secured by Stripe.
        </div>
      </div>
    </div>
  );
}