import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

const LAST_UPDATED = "April 13, 2026";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the Zenith Apex Research Platform ("Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Platform.

These Terms constitute a legally binding agreement between you and Zenith Apex LLC ("Company," "we," "us," or "our"). We reserve the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the modified Terms.`,
  },
  {
    title: "2. Platform Purpose and Nature",
    content: `Zenith Apex is an independent research curation and software platform. The Platform provides:

(a) A curated database of publicly available physics and biology research, including works by Thomas E. Bearden and related primary source documents;
(b) Original software tools for patent drafting, research organization, and invention analysis;
(c) Educational courses and materials created by the Company;
(d) Device build plans based on published research;
(e) A commercial marketplace for electronic components and build supply kits.

THIRD-PARTY CONTENT: All third-party works referenced on this Platform (including works by Thomas E. Bearden, U.S. Office of Naval Research reports, peer-reviewed journal articles, and other published materials) remain the copyright of their respective authors and institutions. These materials are referenced for educational and research purposes only. The Company does not claim ownership of any third-party content.

ORIGINAL CONTENT: The Platform's original software, AI tools, course content, compiled research indexes, curation framework, and proprietary databases are the intellectual property of Zenith Apex LLC.`,
  },
  {
    title: "3. Research and Educational Purpose Disclaimer",
    content: `IMPORTANT: All content on this Platform is provided for EDUCATIONAL AND RESEARCH PURPOSES ONLY.

(a) EXPERIMENTAL RESEARCH: The devices described in build plans are experimental research projects based on published scientific literature. They are not commercial products, certified devices, or consumer electronics. They are intended for use by trained researchers and electronics professionals in laboratory settings.

(b) NO MEDICAL CLAIMS: Nothing on this Platform constitutes medical advice, diagnosis, or treatment. The Platform contains references to published research describing experimental results from animal studies (including the Prioré device documentation). These references are historical and educational only. Do not attempt to use any device described on this Platform for medical purposes. Consult a qualified healthcare professional for medical needs.

(c) NO ENERGY PRODUCTION CLAIMS: Device descriptions referencing Coefficient of Performance (COP) values describe theoretical and experimental results published in peer-reviewed scientific literature. The Company makes no guarantee that any described device will produce any particular result when built by a user.

(d) EXPERIMENTAL RESULTS MAY VARY: Physics experiments are sensitive to materials quality, assembly precision, environmental conditions, and operator skill. Results described in source documents are from specific laboratory conditions and cannot be guaranteed to be reproducible in all settings.`,
  },
  {
    title: "4. Safety Acknowledgment",
    content: `By accessing device build plans, you expressly acknowledge and agree that:

(a) You are a competent adult with sufficient electronics knowledge to safely construct the devices described;
(b) Some devices described operate at potentially hazardous voltages (including mains voltage 120V/240V AC);
(c) Improper construction or operation of electrical devices can cause injury, death, property damage, or fire;
(d) You accept full responsibility for your safety and the safety of others during construction and operation;
(e) You will comply with all applicable local, state, and federal laws and regulations regarding electrical devices;
(f) You will use appropriate personal protective equipment including, but not limited to, safety glasses, insulated tools, and where applicable, laser safety goggles;
(g) You will not allow untrained or minors to operate or have access to devices under construction or testing.

The Company expressly disclaims any liability for injury, death, property damage, or any other harm resulting from the construction, operation, or experimentation with any device described on this Platform.`,
  },
  {
    title: "5. Intellectual Property",
    content: `(a) COMPANY IP: The Platform's original software, interface, AI tools, course content, compiled databases, research curation framework, and all original written materials are owned by Zenith Apex LLC and protected by copyright law.

(b) THIRD-PARTY IP: Third-party works referenced on this Platform remain the property of their respective copyright holders. The Company's use of these materials is for educational and research purposes.

(c) USER RESTRICTIONS: You may not reproduce, distribute, publicly display, or create derivative works from the Company's original Platform content without express written permission. You may not share your login credentials or allow third parties to access your account.

(d) PATENT TOOLS OUTPUT: Content generated using the Platform's AI patent drafting tools is provided for research and drafting assistance only. The Company does not guarantee patentability of any generated content. Consult a registered patent attorney for professional patent advice.`,
  },
  {
    title: "6. Membership, Payments, and Refund Policy",
    content: `(a) DIGITAL PRODUCTS: All courses, build plans, digital documents, and AI tool access are digital products. All sales are final. No refunds will be issued for digital products after access has been granted.

(b) PHYSICAL PRODUCTS (Build Supply Kits): Physical component kits may be returned within 30 days of delivery if unopened and in original condition. Customer is responsible for return shipping. Refunds for physical products are processed within 5–10 business days of receipt.

(c) SUBSCRIPTIONS: Monthly subscription memberships may be cancelled at any time. Cancellation takes effect at the end of the current billing period. No partial month refunds are issued.

(d) DISPUTED CHARGES: If you believe a charge was made in error, contact support@zenithapex.com within 30 days of the charge. Do not initiate a chargeback without first contacting us — we will work to resolve any billing issues promptly.

(e) PRICE CHANGES: The Company reserves the right to change pricing at any time. Existing subscribers will be notified 30 days in advance of any price changes.`,
  },
  {
    title: "7. Prohibited Uses",
    content: `You agree not to use the Platform to:

(a) Violate any applicable local, state, national, or international law or regulation;
(b) Transmit any material that is unlawful, harmful, threatening, abusive, defamatory, or otherwise objectionable;
(c) Attempt to gain unauthorized access to any portion of the Platform or any other systems connected to it;
(d) Use any automated means (bots, scrapers) to access, collect, or extract data from the Platform;
(e) Share, sublicense, or resell access to the Platform or any content obtained from it;
(f) Represent that any device built from Platform content is a certified, commercially approved product;
(g) Make unsubstantiated medical claims based on Platform content;
(h) Use Platform content to make false or misleading representations to third parties.`,
  },
  {
    title: "8. Disclaimer of Warranties",
    content: `THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

The Company does not warrant that:
(a) The Platform will be uninterrupted, timely, secure, or error-free;
(b) The results obtained from use of the Platform will be accurate or reliable;
(c) Any device built according to Platform content will function as described in source research;
(d) Any AI-generated content (patent drafts, invention concepts, market research) is accurate, complete, or legally sufficient for any purpose.`,
  },
  {
    title: "9. Limitation of Liability",
    content: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE COMPANY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:

(a) Your access to or use of (or inability to access or use) the Platform;
(b) Any conduct or content of any third party on the Platform;
(c) Any content obtained from the Platform;
(d) Unauthorized access, use, or alteration of your transmissions or content;
(e) Personal injury or property damage resulting from construction or operation of any device described on the Platform.

IN NO EVENT SHALL THE COMPANY'S TOTAL LIABILITY EXCEED THE AMOUNT PAID BY YOU TO THE COMPANY IN THE THREE MONTHS PRECEDING THE CLAIM.`,
  },
  {
    title: "10. Indemnification",
    content: `You agree to defend, indemnify, and hold harmless Zenith Apex LLC, its officers, directors, employees, contractors, and agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to: (a) your violation of these Terms; (b) your use of the Platform; (c) your construction or operation of any device described on the Platform; (d) your violation of any third-party rights.`,
  },
  {
    title: "11. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of the State of Wyoming, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved in the state or federal courts located in Wyoming. You consent to personal jurisdiction in such courts.`,
  },
  {
    title: "12. Contact",
    content: `Questions about these Terms of Service should be sent to:\n\nZenith Apex LLC\nEmail: support@zenithapex.com\n\nFor legal notices: legal@zenithapex.com`,
  },
];

export default function TermsOfService() {
  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white">
      <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <h1 className="text-white font-bold text-base flex items-center gap-2">
          <Shield size={15} className="text-blue-400" /> Terms of Service
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-8">
        <div className="mb-8">
          <h2 className="text-white font-black text-2xl mb-2">Terms of Service</h2>
          <p className="text-gray-500 text-sm">Last Updated: {LAST_UPDATED}</p>
          <div className="mt-4 bg-blue-950/30 border border-blue-800/50 rounded-xl px-4 py-3">
            <p className="text-blue-300 text-sm leading-relaxed">Please read these Terms carefully before using the Zenith Apex Research Platform. By using the Platform, you agree to be bound by these Terms.</p>
          </div>
        </div>

        <div className="space-y-8">
          {SECTIONS.map((section, i) => (
            <div key={i} className="border-b border-gray-800 pb-8 last:border-0">
              <h3 className="text-white font-bold text-base mb-3">{section.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6 flex gap-4 flex-wrap">
          <Link to="/refund-policy" className="text-blue-400 text-sm hover:underline">Refund Policy →</Link>
          <Link to="/glossary" className="text-blue-400 text-sm hover:underline">Research Glossary →</Link>
        </div>
      </div>
    </div>
  );
}