import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * 5-email membership welcome drip sequence.
 * Call with: { email, name, trigger: "day0" | "day1" | "day3" | "day7" | "day14" }
 *
 * Automations should fire this on a schedule after Stripe webhook creates member record.
 * Day 0: Immediate welcome + "start here"
 * Day 1: MEG module deep-dive
 * Day 3: Build plans + physical kit nudge
 * Day 7: Patent tools + IP marketplace
 * Day 14: Re-engagement + upgrade to build kit
 */

const EMAIL_SEQUENCE = {
  day0: {
    subject: "Your Research Membership Is Active — Start Here",
    body: `Hi {name},

Your Zenith Apex Research Membership is now live.

Here's exactly where to start:

→ MEG Module (free to all members): /research-module?module=meg-system
   The Motionless Electromagnetic Generator. US Patent 6,362,718. COP>1 demonstrated in peer-reviewed literature. Start here — it's the most documented system in the database.

→ Research Database: /codextech-database
   40+ patents analyzed. 8 structured modules. Filter by category or build-readiness.

→ Source Documents: /source-documents
   Browse the primary sources directly. Every entry links to USPTO, journal archives, or official government repositories.

→ AI Patent Tool: /patent-tool
   Generate a USPTO-compliant provisional patent. Takes one session. No attorney required for a provisional.

One note on how to use this platform:
Don't try to read everything at once. Pick one system. Read the theoretical basis. Understand the patents. Then look at the build plan.

The MEG is the right first system.

— Zenith Apex Technology Research Team

---
Manage your membership: /account
Research disclaimer: /research-disclaimer`,
  },

  day1: {
    subject: "The MEG Device — What the Patent Actually Claims",
    body: `Hi {name},

Yesterday you got access to the database. Today I want to walk you through the MEG patent specifically, because it's the most misunderstood device in the collection.

US Patent 6,362,718 — Motionless Electromagnetic Generator
Inventors: Bearden, Hayes, Moore, Kenny, Patrick
Granted: March 26, 2002
Published in: Foundations of Physics Letters, Vol. 14 No. 1, 2001

What it claims:
The MEG uses a permanent magnet as a "source dipole" — a broken symmetry in the local vacuum that continuously absorbs and re-emits energy from the virtual photon flux. Two output coils are wound on a nanocrystalline toroidal core. The switching sequence creates asymmetric energy extraction — more output than input measured at the coil terminals.

This is not a free lunch claim. The claimed source is the magnetic vector potential of the vacuum around the permanent magnet. Bearden's theoretical framework (cited in the patent and the FPL paper) is based on Whittaker's 1904 decomposition of EM potentials — published in Philosophical Transactions of the Royal Society.

Whether or not you believe it works:
The patent is real. The peer-review is real. The Whittaker math is real. This platform exists to document the engineering record — not to tell you what to believe.

Open the MEG module to see the full theoretical framework, system architecture, and BOM:
→ /research-module?module=meg-system

— ZAT Research

---
Unsubscribe: reply STOP`,
  },

  day3: {
    subject: "The Build Plans Are Ready — What's Actually in Each One",
    body: `Hi {name},

Three days in. Time to talk about building something.

The platform has 6 complete engineering build systems:

1. MEG — Motionless Electromagnetic Generator ($287 parts kit available)
   Full BOM with Digikey/Mouser part numbers. Coil winding specs. Assembly procedure. Measurement protocol.

2. Prioré EM Resonance Chamber ($349 parts bundle)
   Based on French Patent FR 1,342,772. Plasma tube + rotating magnetic field. Documented in Comptes Rendus de l'Académie des Sciences.

3. G-Com Scalar Communicator ($243 parts kit)
   Phase-conjugate transmitter/receiver. Bifilar wound anti-phase coil pairs. Bearden's Gravitobiology architecture.

4. TRZ Scalar Potential Extractor ($389 components)
   Counter-wound Möbius pairs. Aharonov-Bohm effect. Regauging extraction framework.

5. TRD-1 Telomere Resonance Device ($194 kit)
   ELF/VLF structured EM. Helmholtz coil array. Based on Kaznacheyev cytopathic effect research.

6. Scalar EM Lab Starter ($167 kit)
   Beginner entry point. Under $60 in components total. Build a working scalar transmitter/receiver pair in a weekend.

Each build plan includes: complete BOM, assembly steps, measurement protocol, and source citations.

Physical kits (pre-sourced, pre-verified, delivered to your door):
→ /build-supplies-shop

Build plans (in-app, viewable):
→ /build-plans

— ZAT Research`,
  },

  day7: {
    subject: "Week 1 Check-In — Have You Opened the Patent Tool?",
    body: `Hi {name},

One week in. Quick check: have you used the AI Patent Tool yet?

Here's why it matters:

If you're building anything based on this research — even a variation, a new application, or a derivative design — you want a provisional patent on file BEFORE you show anyone. A provisional gives you 12 months of patent-pending status with a USPTO filing date for $320 (USPTO fee) + one session with our tool.

The tool generates:
→ Complete invention disclosure
→ Claim structure (independent + dependent claims)
→ Abstract and specification text
→ Prior art differentiation analysis

Takes one session. Exports a USPTO-formatted document.

→ Open the Patent Tool: /patent-tool

Also this week: the IP Marketplace.

If you have IP to list or capital to deploy, the anonymous marketplace lets you do both without revealing your identity until you choose to. Escrow-backed. 5% commission on closed deals only.

→ Browse the Marketplace: /ip-marketplace

— ZAT Research`,
  },

  day14: {
    subject: "Two Weeks In — What Have You Built?",
    body: `Hi {name},

Two weeks since you joined. I want to ask directly: what have you actually done with the platform?

If the answer is "I've been reading" — that's fine. Most people start that way.

If you're ready to move from reading to building, here's the path:

Step 1: Pick a system
   Start with the MEG or the Scalar EM Lab Starter (cheapest, fastest to build).

Step 2: Order the kit
   Physical components delivered. Pre-sourced. No supplier hunting.
   → /build-supplies-shop

Step 3: Open the build plan
   Follow the assembly steps. Use the measurement protocol to verify output.
   → /build-plans

Step 4: Document and protect
   Keep lab notes. If you observe anything novel, file a provisional.
   → /patent-tool

The research doesn't mean anything until someone builds something.

Your membership is active. Everything is unlocked. The only thing left is to start.

→ Open Your Dashboard: /member-dashboard

— ZAT Research

---
Questions: reply to this email
Manage membership: /account
Unsubscribe: reply STOP`,
  },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email, name, trigger } = await req.json();

    if (!email || !trigger) {
      return Response.json({ error: "email and trigger required" }, { status: 400 });
    }

    const sequence = EMAIL_SEQUENCE[trigger];
    if (!sequence) {
      return Response.json({ error: `Unknown trigger: ${trigger}. Valid: day0, day1, day3, day7, day14` }, { status: 400 });
    }

    const displayName = name || "Researcher";
    const body = sequence.body.replace(/{name}/g, displayName);

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      subject: sequence.subject,
      body,
      from_name: "Zenith Apex Technology",
    });

    console.log(`[membershipWelcomeEmail] Sent ${trigger} to ${email}`);

    return Response.json({ success: true, trigger, to: email });
  } catch (error) {
    console.error("[membershipWelcomeEmail] Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});