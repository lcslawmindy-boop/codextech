import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock, Package, Flame, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

const SALE_PRODUCTS = [
  {
    id: 'trz',
    name: 'TRZ Reactor Starter',
    original: 389,
    discount: 0.20,
    image: '⚛️',
    desc: 'Cold fusion reactor starter components',
    highlights: ['METGLAS cores', 'Assembly guide', 'Calibration tools']
  },
  {
    id: 'priore',
    name: 'Prioré Device Bundle',
    original: 349,
    discount: 0.20,
    image: '🔬',
    desc: 'EM treatment system components',
    highlights: ['ONR validated', 'Full schematics', 'Build guide']
  },
  {
    id: 'meg',
    name: 'MEG Replication Kit',
    original: 287,
    discount: 0.20,
    image: '🌀',
    desc: 'Motionless electromagnetic generator',
    highlights: ['US Patent 6,362,718', 'Copper coils', 'Flux detection']
  },
  {
    id: 'trd',
    name: 'TRD-1 Telomere Device',
    original: 194,
    discount: 0.15,
    image: '🧬',
    desc: 'Telomere regeneration build kit',
    highlights: ['MCCS protocol', 'Components included', 'Instructions']
  },
  {
    id: 'scalar-lab',
    name: 'Scalar EM Lab Starter',
    original: 167,
    discount: 0.15,
    image: '⚡',
    desc: 'Beginner electromagnetic lab kit',
    highlights: ['Safety equipment', 'Test instruments', 'Lab manual']
  },
  {
    id: 'anenergy',
    name: 'Anenergy Course',
    original: 197,
    discount: 0.25,
    image: '📚',
    desc: 'Free energy extraction engineering course',
    highlights: ['8 modules', 'Lifetime access', 'Certificates']
  }
];

const BUNDLE_DEALS = [
  {
    name: 'Reactor Master Bundle',
    products: ['trz', 'meg', 'anenergy'],
    bundleDiscount: 0.30,
    desc: 'Complete cold fusion & scalar EM system'
  },
  {
    name: 'Biotech Longevity Bundle',
    products: ['priore', 'trd', 'anenergy'],
    bundleDiscount: 0.28,
    desc: 'Healing & regeneration devices'
  }
];

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState('');
  const [selectedBundle, setSelectedBundle] = useState(null);

  // Countdown timer (72 hours from now)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const saleEnd = new Date(now.getTime() + 72 * 60 * 60 * 1000);
      const diff = saleEnd - now;

      if (diff <= 0) {
        setTimeLeft('Sale ended');
        clearInterval(interval);
      } else {
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${mins}m left`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calcBundleTotal = (productIds) => {
    return productIds.reduce((sum, id) => {
      const prod = SALE_PRODUCTS.find(p => p.id === id);
      return sum + (prod ? prod.original * (1 - prod.discount) : 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-orange-950/20 to-gray-950">
      {/* Hero banner */}
      <div className="relative overflow-hidden border-b-2 border-orange-700/50 bg-gradient-to-r from-orange-950 to-red-950">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 py-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame size={28} className="text-orange-400 animate-bounce" />
            <span className="text-orange-400 font-black text-sm uppercase tracking-widest">MEMBER EXCLUSIVE</span>
            <Flame size={28} className="text-orange-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-white mb-3 leading-tight">
            72-Hour Flash Sale
          </h1>

          <p className="text-xl text-orange-200 mb-4">
            Build Kits & Courses Up to 30% Off
          </p>

          <div className="flex items-center justify-center gap-3 bg-red-900/40 border-2 border-orange-700 rounded-2xl px-6 py-4 w-fit mx-auto backdrop-blur">
            <Clock size={20} className="text-orange-400" />
            <span className="text-white font-black text-2xl">{timeLeft}</span>
          </div>

          <p className="text-gray-400 text-sm mt-4">Member-only pricing · Limited quantities</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-12 space-y-12">
        {/* Bundle deals */}
        <div>
          <h2 className="text-white font-black text-2xl mb-4 flex items-center gap-2">
            <Package size={24} className="text-orange-400" />
            Bundle Deals (Biggest Savings)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BUNDLE_DEALS.map((bundle, i) => {
              const total = calcBundleTotal(bundle.products);
              const savings = bundle.products.reduce((sum, id) => {
                const prod = SALE_PRODUCTS.find(p => p.id === id);
                return sum + (prod ? prod.original * prod.discount : 0);
              }, 0);

              return (
                <div
                  key={i}
                  className="bg-gradient-to-br from-orange-950/40 to-red-950/40 border-2 border-orange-700 rounded-2xl p-5 hover:border-orange-600 transition-all cursor-pointer hover:shadow-xl hover:shadow-orange-900/20"
                  onClick={() => setSelectedBundle(selectedBundle === i ? null : i)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-black text-lg">{bundle.name}</h3>
                      <p className="text-gray-400 text-xs mt-1">{bundle.desc}</p>
                    </div>
                    <span className="px-3 py-1 bg-orange-700 text-white font-black text-xs rounded-full flex-shrink-0">
                      {Math.round(bundle.bundleDiscount * 100)}% OFF
                    </span>
                  </div>

                  <div className="border-t border-orange-700/30 pt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-xs">Total Value</p>
                        <p className="text-orange-300 font-black text-lg">
                          ${total.toFixed(2)}
                          <span className="text-gray-500 text-xs ml-2 line-through">
                            ${(total + savings).toFixed(2)}
                          </span>
                        </p>
                      </div>
                      <button className="px-4 py-2 rounded-lg bg-orange-700 hover:bg-orange-600 text-white font-black text-sm transition-all">
                        Add Bundle
                      </button>
                    </div>
                    <p className="text-green-400 font-bold text-xs mt-2">
                      💰 Save ${savings.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Individual products */}
        <div>
          <h2 className="text-white font-black text-2xl mb-4 flex items-center gap-2">
            <Zap size={24} className="text-yellow-400" />
            Individual Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SALE_PRODUCTS.map((product) => {
              const discountedPrice = product.original * (1 - product.discount);
              const savings = product.original * product.discount;

              return (
                <div
                  key={product.id}
                  className="bg-gray-900 border border-gray-800 hover:border-orange-700 rounded-2xl p-5 transition-all hover:shadow-lg hover:shadow-orange-900/20 hover:-translate-y-1"
                >
                  <div className="text-4xl mb-3">{product.image}</div>

                  <div className="mb-3">
                    <h3 className="text-white font-bold text-sm mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{product.desc}</p>
                  </div>

                  <div className="space-y-1 mb-4 pb-4 border-b border-gray-800">
                    {product.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                        <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-orange-400 font-black text-xl">${discountedPrice.toFixed(2)}</p>
                      <p className="text-gray-600 text-xs line-through">${product.original.toFixed(2)}</p>
                    </div>
                    <span className="px-2 py-1 bg-orange-700 text-white font-black text-xs rounded">
                      -{Math.round(product.discount * 100)}%
                    </span>
                  </div>

                  <button className="w-full py-2 rounded-lg bg-gradient-to-r from-orange-700 to-red-700 hover:from-orange-600 hover:to-red-600 text-white font-bold text-sm transition-all active:scale-95">
                    Add to Cart
                  </button>

                  <p className="text-green-400 font-bold text-xs mt-2 text-center">
                    Save ${savings.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guarantee banner */}
        <div className="bg-green-950/30 border border-green-800/50 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <CheckCircle2 size={20} className="text-green-400" />
            <span className="text-green-400 font-black text-sm uppercase tracking-wider">100% Satisfaction Guarantee</span>
          </div>
          <p className="text-gray-300 text-sm max-w-2xl mx-auto">
            All products come with detailed build instructions, component sourcing guides, and member-exclusive support. 30-day satisfaction guarantee on all orders.
          </p>
        </div>

        {/* CTA footer */}
        <div className="bg-gradient-to-r from-orange-950/40 to-red-950/40 border-2 border-orange-700 rounded-2xl p-8 text-center">
          <h2 className="text-white font-black text-2xl mb-2">Don't Miss Out</h2>
          <p className="text-gray-300 text-sm mb-6">Sale ends in {timeLeft}. Limited quantities available.</p>
          <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black text-base transition-all active:scale-95 shadow-lg shadow-orange-900/50">
            Start Shopping <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}