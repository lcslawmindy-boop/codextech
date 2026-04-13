import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Clock, Mail } from "lucide-react";

const LAST_UPDATED = "April 13, 2026";

export default function RefundPolicy() {
  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white">
      <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <h1 className="text-white font-bold text-base flex items-center gap-2">
          <RefreshCw size={15} className="text-green-400" /> Refund Policy
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-8">
        <div>
          <h2 className="text-white font-black text-2xl mb-1">Refund Policy</h2>
          <p className="text-gray-500 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-4">
            <XCircle size={20} className="text-red-400 mb-2" />
            <p className="text-red-300 font-bold text-sm mb-1">Digital Products</p>
            <p className="text-gray-400 text-xs leading-relaxed">No refunds after access granted — courses, build plans, AI tools</p>
          </div>
          <div className="bg-green-950/30 border border-green-800/50 rounded-xl p-4">
            <CheckCircle size={20} className="text-green-400 mb-2" />
            <p className="text-green-300 font-bold text-sm mb-1">Physical Kits</p>
            <p className="text-gray-400 text-xs leading-relaxed">30-day return if unopened and in original condition</p>
          </div>
          <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-xl p-4">
            <Clock size={20} className="text-yellow-400 mb-2" />
            <p className="text-yellow-300 font-bold text-sm mb-1">Subscriptions</p>
            <p className="text-gray-400 text-xs leading-relaxed">Cancel anytime — access continues until end of billing period</p>
          </div>
        </div>

        {/* Detailed policy */}
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
              <XCircle size={16} className="text-red-400" /> Digital Products — No Refund Policy
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              The following are digital products where access is granted immediately upon purchase. Due to the instant nature of digital delivery, all sales are final and no refunds will be issued once access has been granted:
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                "Research Membership (monthly or annual)",
                "Individual course purchases",
                "Device build plan PDFs",
                "AI patent drafting tool credits",
                "Investor package documents",
                "Download center access",
                "Any other digital content",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-red-500 flex-shrink-0">✗</span> {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 bg-red-950/20 border border-red-900/40 rounded-xl px-4 py-3">
              <p className="text-red-300 text-xs leading-relaxed">
                <strong>Why no refunds on digital products?</strong> Once a PDF, course, or tool is accessed, it cannot be "returned" — the information has been received. This is standard practice for all digital media platforms. Please review the product description and free preview content carefully before purchasing.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" /> Physical Build Supply Kits — 30-Day Return
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Component kits purchased from the Build Supplies Shop may be returned within 30 days of delivery under the following conditions:
            </p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-semibold">Eligible for return:</p>
                  <p className="text-gray-400 text-xs mt-0.5">Unopened, in original packaging, with all components present. Kit must be in resaleable condition.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-semibold">Not eligible for return:</p>
                  <p className="text-gray-400 text-xs mt-0.5">Opened kits, kits with missing components, kits damaged through use, kits returned after 30 days.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-semibold">Return process:</p>
                  <p className="text-gray-400 text-xs mt-0.5">Email support@zenithapex.com with your order number. We will provide a return shipping address. Customer is responsible for return shipping costs. Refund is processed within 5–10 business days of receiving the returned item.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
              <RefreshCw size={16} className="text-blue-400" /> Subscriptions — Cancel Anytime
            </h3>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
              <p><strong className="text-white">Monthly memberships:</strong> Cancel at any time through your Account Settings page. Your access continues until the end of the current billing period. No partial-month refunds are issued.</p>
              <p><strong className="text-white">Annual memberships:</strong> Cancel within 7 days of initial purchase for a full refund (minus processing fees). After 7 days, no refunds on annual memberships — access continues until the annual period ends.</p>
              <p><strong className="text-white">How to cancel:</strong> Go to Account Settings → Manage Subscription, or email support@zenithapex.com with your account email and "Cancel Subscription" in the subject line.</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-bold text-base mb-3">Exceptions and Special Circumstances</h3>
            <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
              <p><strong className="text-white">Duplicate charges:</strong> If you were charged more than once for the same product, contact us immediately. We will refund duplicate charges in full.</p>
              <p><strong className="text-white">Technical failure:</strong> If a technical failure on our end prevented you from accessing content you purchased, and we are unable to resolve it within 72 hours, we will issue a full refund.</p>
              <p><strong className="text-white">Unauthorized charges:</strong> If you did not authorize a charge, contact us at support@zenithapex.com before initiating a chargeback. We resolve unauthorized charge claims within 24–48 hours.</p>
              <p><strong className="text-white">We want you to be satisfied:</strong> If you believe you have a legitimate refund case not covered above, email us. We review every case individually and try to find a fair resolution.</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
              <Mail size={16} className="text-purple-400" /> Contact Us
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              For any refund requests or billing questions, contact our support team:
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">📧 Email: <a href="mailto:support@zenithapex.com" className="text-blue-400 hover:underline">support@zenithapex.com</a></p>
              <p className="text-gray-300">⏰ Response time: Within 48 hours on weekdays (Mon–Fri, Pacific Time)</p>
              <p className="text-gray-300">📋 Include in your email: Order number, account email, description of the issue</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex gap-4 flex-wrap">
          <Link to="/terms" className="text-blue-400 text-sm hover:underline">Terms of Service →</Link>
          <Link to="/account" className="text-blue-400 text-sm hover:underline">Account Settings →</Link>
        </div>
      </div>
    </div>
  );
}