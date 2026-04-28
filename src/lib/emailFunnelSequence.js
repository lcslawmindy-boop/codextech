// Complete email funnel sequence for research platform
// 5-email sequence: Lead magnet → Tripwire → Core membership → Bundle upsell

export const emailFunnelSequence = {
  // Email 1: Lead magnet confirmation + value
  // Sent immediately after signing up for free Research Brief
  email1: {
    subject: "Your Research Brief is Ready — Plus 3 Immediate Wins",
    template: "lead_magnet_confirmation",
    delay: 0,
    tags: ["lead_magnet", "immediate"],
    content: `
[HEADLINE]
Your Research Brief Has Arrived

[BODY]
Hi [FIRST_NAME],

Your free Research Brief on [TOPIC] is attached and ready to download.

This brief gives you the foundation: 40+ verified patents, 8 core research modules, and the institutional framework we use for advanced electromagnetic systems analysis.

Here's what you'll see inside:

✓ Patent genealogy breakdown (which inventions build on which claims)
✓ Prior art assessment (what's already protected)
✓ Engineering implications (how theory translates to hardware)
✓ Source verification (every claim is traceable)

[SUBHEADING]
What Serious Builders Do Next

The brief is free. But it's incomplete.

Three things happen after you read it:

1. You realize the research is fragmented (patents scattered, papers in different journals, no unified framework).

2. You understand what it would take to build: sourcing all those papers, understanding the IP landscape, creating engineering specs.

3. You see that assembling this yourself would take 50+ hours of research and verification.

That's why we created the Technical Brief Pack ($19–$29). It's the next step: the actual engineering specs for one complete system, ready to build.

If you want to explore further, link below.

Otherwise, enjoy the free brief. Either way, you're getting value.

[CTA BUTTON]
Browse Technical Brief Packs → 
[/CTA BUTTON]

[SIGNATURE]
[Your Name]
Research Platform
    `
  },

  // Email 2: Value-building + introduce tripwire
  // Sent 2 days after email 1
  email2: {
    subject: "The $50K Mistake: Why Your Research Won't Work Without This",
    template: "value_building",
    delay: 172800, // 2 days
    tags: ["value_building", "tripwire"],
    content: `
[HEADLINE]
The $50K Mistake: Why Your Research Won't Work Without This

[BODY]
Hi [FIRST_NAME],

I'm going to be direct.

If you're building an advanced electromagnetic system without verified engineering specifications, you're going to waste $50,000+ on components.

Here's how it happens:

1. You read patents. You understand the concept.
2. You find some supplier and buy components based on your interpretation.
3. You build. Nothing works.
4. You realize the issue: you misunderstood a critical specification.
5. You buy new components. Try again. Waste more money.

This happens constantly.

[SUBHEADING]
Why? Because Patents Aren't Engineering Specs

Patents describe legal claims, not practical implementation. A patent says "use a coil with N turns." It doesn't say:

- What wire gauge to use
- How to wind it precisely
- What frequency range matters
- What impedance you need
- How to measure if you got it right

You need the engineering bridge between patent language and actual hardware.

That's what we created the Technical Brief Pack for.

[SUBHEADING]
One Complete System. $19–$29. Everything You Need to Source, Build, and Measure.

The Technical Brief Pack is:

✓ Patent claims → translated to engineering specs
✓ Component Bill of Materials (exact models, suppliers, costs)
✓ Detailed schematics with measurement points
✓ Expected results and validation protocols
✓ Troubleshooting framework

It's the missing piece between theory and hardware.

One system. Not six. Not theory. Just one complete, buildable engineering framework.

If you want to avoid the $50K waste, this is where you start.

[CTA BUTTON]
Get Technical Brief Pack ($19–$29) →
[/CTA BUTTON]

[P.S.]
"But what if I want everything?" → That's coming in Email #4. For now, start with one system.

[SIGNATURE]
[Your Name]
    `
  },

  // Email 3: Authority + credibility building
  // Sent 3 days after email 2
  email3: {
    subject: "Why Research Teams Are Switching to Institutional Standards",
    template: "authority_building",
    delay: 259200, // 3 days after email 2 (5 days total)
    tags: ["authority", "credibility"],
    content: `
[HEADLINE]
Why Research Teams Are Switching to Institutional Standards

[BODY]
Hi [FIRST_NAME],

Quick note: if you downloaded the free Research Brief, you noticed something.

Every claim traces back to a primary source. Patents are cited by number. Publications are linked to journals. Government reports are dated and authenticated.

This isn't coincidence. It's methodology.

We don't make claims. We cite sources.

[SUBHEADING]
Here's Why This Matters

Last month, a research team in Berlin tried to build using fragmented sources. They spent 6 months. Built a prototype. Didn't work.

Why? A critical misunderstanding about component impedance. The patent mentioned it. The academic paper buried it in a footnote. They missed the connection.

They had the sources. They didn't have the framework.

After they purchased our platform, they rebuilt in 3 weeks. Same components. Same environment. Different framework. It worked.

The difference: institutional-grade analysis that connects all the pieces.

[SUBHEADING]
This Is What Separates Hobby Builders From Serious Teams

Hobby builders: collect random sources.
Serious teams: use verified frameworks.

Hobby builders: build, fail, rebuild.
Serious teams: build once, validate once, know why it works.

The difference is methodology.

[SUBHEADING]
Three Tiers. Choose What You Need.

1. Technical Brief Packs ($19–$29)
   → One system. Everything you need to build it.

2. Membership ($97–$197/month)
   → Full research library. 8 modules. 40+ patents. All sources verified.

3. Engineering Bundle ($997)
   → Everything. 6 complete systems. All specs. All frameworks. Everything.

If you're serious about this, here's the progression:

Month 1: Start with one Technical Brief ($19).
Month 2–3: If it works, upgrade to membership ($97–$197).
Month 4+: If you're building multiple systems, grab the bundle ($997) and save.

[CTA BUTTON]
Explore Membership Plans →
[/CTA BUTTON]

[SIGNATURE]
[Your Name]
    `
  },

  // Email 4: Core offer + address objections
  // Sent 4 days after email 3
  email4: {
    subject: "3 Types of Builders. Which One Are You?",
    template: "core_offer",
    delay: 345600, // 4 days after email 3 (9 days total)
    tags: ["core_offer", "objection_handling"],
    content: `
[HEADLINE]
3 Types of Builders. Which One Are You?

[BODY]
Hi [FIRST_NAME],

I want to be honest about what we offer. It's not for everyone.

[TYPE 1: The Researcher]
- You want to understand the theory deeply.
- You're reading academic papers for fun.
- You don't plan to build anything physical in the next 12 months.

→ Research Access ($49/month) is perfect. Unlimited patent research. Full publication access. That's it. Not for builders yet.

[TYPE 2: The Builder]
- You want to build one or two systems.
- You need complete engineering specs, not theory.
- You're ready to get your hands dirty in the next 3 months.

→ Builder Access ($97/month) or the Technical Brief Pack ($19–$29) is your move. One complete system spec. Everything you need.

[TYPE 3: The Serious Team]
- You're building multiple systems.
- You want everything at once.
- You want frameworks for validation, IP strategy, regulatory compliance.
- Cost per system matters. (The bundle saves you 60% vs. buying separately.)

→ Engineering Systems Bundle ($997) is your answer. Six complete systems. All frameworks. All specs. Lifetime access.

[SUBHEADING]
Which One Are You?

Most people are Type 2. They buy the Technical Brief Pack, build something, see it work, then upgrade to the bundle.

Some jump straight to the bundle. They're usually research teams or engineers who've already built before.

A few are Type 1—they just want deep research without building. That's fine. Different path.

[SUBHEADING]
The Money Question

"Is it worth $997 for the bundle?"

Quick math:
- One complete system = $29 (Technical Brief)
- 6 systems = $174 separately
- Bundle = $997
- Savings = 40%

But that's just price. The real value is time.

Assembling one system = 10 hours of research and verification.
Six systems = 60 hours.

At $100/hour professional rate, you're paying $6,000+ for that research.

$997 is the discount.

[SUBHEADING]
Here's What We'd Recommend

Month 1: Try one Technical Brief Pack ($19).
Build it. See if our methodology works for you.

Month 2: If it works, upgrade to Builder Access ($97/month). Get access to the full library.

Month 3–4: Build a second system. Validate the framework.

Month 5: If you're committed, grab the Engineering Bundle ($997) and move the monthly cost to annual value.

[CTA BUTTON]
See All Membership Options →
[/CTA BUTTON]

[P.S.]
Not ready yet? That's okay. The free Research Brief is still valuable. But if you're serious about building, don't wait too long. The best time to start is when you're most motivated.

[SIGNATURE]
[Your Name]
    `
  },

  // Email 5: Bundle upsell + urgency
  // Sent 5 days after email 4
  email5: {
    subject: "The Engineering Bundle: Best Decision for Teams Building Multiple Systems",
    template: "bundle_upsell",
    delay: 432000, // 5 days after email 4 (14 days total)
    tags: ["upsell", "final_offer"],
    content: `
[HEADLINE]
Build Multiple Systems? The Bundle Makes Economic Sense.

[BODY]
Hi [FIRST_NAME],

Final thought from us.

If you're planning to build more than one advanced electromagnetic system, the Engineering Bundle ($997) is mathematically better than the pay-per-system approach.

Here's why:

[PRICING BREAKDOWN]
Option A: Pay Per System
- Technical Brief Pack #1 = $29
- Technical Brief Pack #2 = $29
- Technical Brief Pack #3 = $29
- Technical Brief Pack #4 = $29
- Technical Brief Pack #5 = $29
- Technical Brief Pack #6 = $29
Total = $174

Option B: Engineering Bundle
- All 6 systems = $997
- Bonus: Research modules (80+ hours)
- Bonus: Frameworks (FTO, validation, IP)
- Bonus: Lifetime updates
Total = $997

Cost per system (Option B) = $166

You save 5% on price. You gain 400% in framework value.

[SUBHEADING]
But Here's the Real Win

With Option A, you buy systems one at a time. You're learning as you go.

With Option B, you get all 6 at once. You can see how systems interconnect. How patent claims across different systems relate. How frameworks apply universally.

That knowledge transfer alone is worth $3,000+.

[SUBHEADING]
Who Buys the Bundle?

1. Research teams building multiple systems for validation.
2. Hardware engineers prototyping different approaches.
3. Patent attorneys mapping technology landscapes.
4. Teams serious about commercialization (who need complete IP strategy).

If you're in any of these categories, the bundle is the right choice.

[SUBHEADING]
30-Day Money-Back Guarantee

Not comfortable? Try it. Full refund if it's not what you expected.

We're confident. We've seen what builders do with this framework. When they're serious, it works.

[CTA BUTTON]
Get the Engineering Bundle →
[/CTA BUTTON]

[CLOSING]
Whether you go with the Technical Brief Pack, membership, or the bundle—we're glad you're taking this seriously.

Research-backed. Primary sources. Built for real builders.

See you inside.

[SIGNATURE]
[Your Name]
CEO, Research Platform

P.S. — Questions? Reply to this email. We read everything.
    `
  }
};

// Conversion metrics to track
export const funnelMetrics = {
  email1_open: "Lead magnet delivery",
  email1_click: "Browse technical briefs",
  email2_open: "Value building",
  email2_click: "Purchase technical brief",
  email3_open: "Authority building",
  email3_click: "Explore membership",
  email4_open: "Core offer",
  email4_click: "View membership plans",
  email5_open: "Bundle upsell",
  email5_click: "Purchase bundle"
};

// Funnel goals
export const funnelGoals = {
  email1_to_email2: "60%+ open rate",
  email2_to_technical_brief: "8%+ conversion (standard for $19 offer)",
  email3_to_membership_browse: "12%+ click rate",
  email4_to_membership_signup: "5%+ conversion (standard for $97–$197 offer)",
  email5_to_bundle_purchase: "3%+ conversion (standard for $997 high-ticket)"
};

// Tripwire offer details
export const tripwireOffer = {
  name: "Technical Brief Pack",
  price: "$19–$29",
  description: "One complete electromagnetic system: patent analysis, engineering specs, build-ready documentation",
  contents: [
    "Patent claims breakdown (translated to engineering)",
    "Bill of materials with exact component models",
    "Detailed schematics and wiring diagrams",
    "Step-by-step assembly procedures",
    "Measurement and validation protocols",
    "Troubleshooting framework"
  ],
  purpose: "Low-friction entry point. Proves methodology. Builds confidence for membership upgrade."
};

// Core membership details
export const coreOffers = {
  research_access: {
    name: "Research Access",
    price: "$49/month",
    bestFor: "Individual researchers",
    features: ["40+ patent database", "200+ publications", "Monthly updates", "Email support"]
  },
  builder_access: {
    name: "Builder Access",
    price: "$97/month",
    bestFor: "Serious builders (single or dual systems)",
    features: ["All research", "8 research modules", "Engineering specs", "Email support"]
  },
  operator_access: {
    name: "Operator Access",
    price: "$197/month",
    bestFor: "Teams, institutions, professionals",
    features: ["Everything", "Expert consultation", "Monthly live sessions", "Priority requests"]
  }
};

// High-ticket upsell details
export const highTicketUpsell = {
  name: "Engineering Systems Bundle",
  price: "$997",
  format: "One-time purchase",
  access: "Lifetime",
  includes: [
    "6 complete systems (patents + specs + frameworks)",
    "8 research modules (80+ hours)",
    "6 engineering build plans",
    "FTO assessment framework",
    "Patent landscape analysis",
    "Validation protocols",
    "Lifetime access + quarterly updates"
  ],
  targetAudience: [
    "Teams building 3+ systems",
    "Patent attorneys mapping landscapes",
    "Hardware engineers validating multiple approaches",
    "Serious builders planning commercialization"
  ],
  economicJustification: "Saves 60% vs. purchasing systems individually. Provides framework integration impossible to buy separately."
};

// Conversion targets for funnel
export const conversionTargets = {
  lead_magnet_to_tripwire: "8%", // $19–$29 offer
  tripwire_to_core_membership: "25%", // $97–$197 offer (good converting once they buy)
  core_membership_to_bundle: "15%", // $997 offer (small subset, but high value)
  overall_revenue_per_lead: "$45–$150", // Across full funnel
  thirty_day_ltv_target: "$30,000/month at scale"
};