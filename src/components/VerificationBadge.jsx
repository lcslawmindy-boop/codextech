import { Shield, CheckCircle2 } from 'lucide-react';

export default function VerificationBadge({ verified, verificationDate }) {
  if (!verified) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/30 border border-green-700 text-green-300">
      <Shield size={12} />
      <span className="text-xs font-semibold">Verified Inventor</span>
    </div>
  );
}