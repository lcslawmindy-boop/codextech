import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      buyer_name = "Prospective Acquirer",
      buyer_org = "",
      asking_price = 2500000,
      ip_valuation = 2500000,
      deal_structure = "all_cash", // all_cash | cash_and_equity | earnout | license_buyout
      earnout_amount = 0,
      earnout_triggers = "",
      equity_rollover_pct = 0,
      closing_period_days = 60,
      exclusivity_days = 30,
      patent_count = 6,
      platform_arr = 0,
      assets_included = [],
      assets_excluded = [],
    } = body;

    const today = new Date().toISOString().split('T')[0];
    const exclusivity_end = new Date(Date.now() + exclusivity_days * 86400000).toISOString().split('T')[0];
    const closing_deadline = new Date(Date.now() + closing_period_days * 86400000).toISOString().split('T')[0];

    // Deal structure narrative
    const structureMap = {
      all_cash: `${asking_price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} all-cash at closing`,
      cash_and_equity: `${(asking_price * (1 - equity_rollover_pct / 100)).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} cash at closing + ${equity_rollover_pct}% equity rollover in acquiring entity`,
      earnout: `${(asking_price - earnout_amount).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} cash at closing + ${earnout_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} earnout upon: ${earnout_triggers}`,
      license_buyout: `${asking_price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} lump-sum perpetual license buyout (exclusive, worldwide, irrevocable)`,
    };

    const defaultAssetsIncluded = [
      `All issued and pending US patents (${patent_count} total) and international PCT applications`,
      "All patent applications, prosecution history, inventor assignments, and continuation rights",
      "Full source code and version history of the Aethon Apex IP SaaS platform",
      "40+ proprietary engineering build plan library (BOM, schematics, assembly documentation)",
      "200+ curated prior art research archive with inline citations",
      "All registered trademarks, trade names, domain names, and brand assets",
      "All customer data, subscriber lists, and CRM records (subject to privacy law compliance)",
      "Existing licensing agreements and royalty streams",
      "Proprietary AI patent drafting models, Invention Forge prompt libraries, and training data",
      "Virtual Data Room (VDR) infrastructure and investor relations materials",
      "All R&D documentation, lab notebooks, prototype schematics, and test data",
      "Social media accounts, newsletter subscriber lists, and community forum",
    ];

    const defaultAssetsExcluded = [
      "Seller's personal tax liabilities and obligations prior to closing date",
      "Any litigation claims or causes of action accrued prior to closing",
      "Seller's personal bank accounts and non-business assets",
    ];

    const termSheet = {
      meta: {
        title: "Non-Binding Acquisition Term Sheet",
        subtitle: "Aethon Apex IP — Full Portfolio Acquisition",
        date: today,
        prepared_for: buyer_name + (buyer_org ? `, ${buyer_org}` : ""),
        prepared_by: "Zenith Apex LLC (Seller)",
        contact: "zenithapexresearch@gmail.com",
        reference: `ZARP-ACQ-${Date.now().toString(36).toUpperCase()}`,
        confidentiality: "STRICTLY CONFIDENTIAL — SUBJECT TO NDA",
      },
      parties: {
        seller: {
          name: "Zenith Apex LLC",
          dba: "Aethon Apex IP",
          type: "Seller / IP Owner",
          jurisdiction: "United States",
        },
        buyer: {
          name: buyer_name,
          org: buyer_org,
          type: "Prospective Acquirer",
        },
      },
      transaction: {
        type: "Asset Purchase — Full IP Portfolio Acquisition",
        description: "Acquisition of 100% of the Aethon Apex IP portfolio including all patents, platform assets, brand, customer base, and proprietary research library.",
        asking_price_usd: asking_price,
        ip_valuation_basis_usd: ip_valuation,
        deal_structure: structureMap[deal_structure] || structureMap.all_cash,
        platform_arr_usd: platform_arr,
        revenue_multiple: platform_arr > 0 ? (asking_price / platform_arr).toFixed(1) + "x ARR" : "N/A (pre-revenue)",
      },
      assets_included: assets_included.length > 0 ? assets_included : defaultAssetsIncluded,
      assets_excluded: assets_excluded.length > 0 ? assets_excluded : defaultAssetsExcluded,
      ip_summary: {
        patents: `${patent_count} issued/pending US patents + PCT international applications`,
        valuation_floor: "$250,000 (3-patent minimum, $250K R&D basis)",
        valuation_ceiling: "$5,000,000+ (full portfolio + platform ARR multiple)",
        domains: ["Electromagnetic Systems", "Resonance Engineering", "Bioelectromagnetics", "Scalar EM", "RF / Signal Processing", "Free Energy Research"],
        commercialization_channels: ["Direct licensing to OEMs", "Government / SBIR contracts", "White-label SaaS", "Research institution licenses", "Defense & aerospace"],
      },
      timeline: {
        exclusivity_period: `${exclusivity_days} days from execution of this term sheet`,
        exclusivity_end_date: exclusivity_end,
        due_diligence_period: `${Math.round(closing_period_days * 0.5)} days`,
        target_closing_date: closing_deadline,
        key_milestones: [
          { event: "Execution of Term Sheet + Exclusivity", timing: "Day 0" },
          { event: "Full VDR access granted to Buyer", timing: "Day 1–3" },
          { event: "Buyer IP due diligence complete", timing: `Day ${Math.round(closing_period_days * 0.3)}` },
          { event: "Definitive Asset Purchase Agreement (APA) negotiation", timing: `Day ${Math.round(closing_period_days * 0.4)}–${Math.round(closing_period_days * 0.7)}` },
          { event: "APA execution + patent assignment filings", timing: `Day ${Math.round(closing_period_days * 0.8)}` },
          { event: "Wire transfer / closing payment", timing: `Day ${closing_period_days} (${closing_deadline})` },
        ],
      },
      conditions: {
        buyer_conditions: [
          "Satisfactory IP due diligence review of all patents, prosecution history, and FTO analysis",
          "Satisfactory technical review of platform source code and architecture",
          "Satisfactory review of customer and revenue data",
          "Execution of Definitive Asset Purchase Agreement (APA)",
          "All required regulatory filings and patent assignment recordations completed",
          "No material adverse change to the IP portfolio prior to closing",
        ],
        seller_conditions: [
          "Full purchase price received in immediately available funds at closing",
          "Buyer representations and warranties regarding authority and financial capacity confirmed",
          "Execution of Definitive Asset Purchase Agreement (APA)",
          "Mutual release of claims",
        ],
      },
      representations_warranties: {
        seller: [
          "Seller is the sole legal and beneficial owner of all included assets",
          "All patents are properly filed, maintained, and free of undisclosed liens or encumbrances",
          "No pending or threatened litigation relating to included IP",
          "Seller has full authority to execute this transaction without third-party consent",
          "All inventor assignments are properly executed and recorded",
          "Platform revenue and subscriber data provided are accurate to the best of Seller's knowledge",
        ],
        buyer: [
          "Buyer has the financial capacity to complete the transaction",
          "Buyer has authority to enter into this agreement",
          "Buyer will maintain confidentiality of all disclosed information under existing NDA",
        ],
      },
      post_closing: {
        transition_support: "Seller will provide up to 90 days of transition support (remote) at no additional cost",
        non_compete: "Seller agrees to a 24-month non-compete in the acquired technology domains",
        non_solicitation: "Seller agrees to a 24-month non-solicitation of customers and employees",
        indemnification: "Seller indemnifies Buyer for pre-closing IP ownership breaches for 36 months post-closing",
        escrow: deal_structure === "all_cash" ? "10% of purchase price held in escrow for 12 months post-closing for indemnification claims" : "N/A",
      },
      governing_law: {
        jurisdiction: "State of [Buyer's Choice — Delaware or California preferred]",
        dispute_resolution: "Binding arbitration (AAA Commercial Rules)",
        prevailing_party_fees: "Each party bears its own legal fees unless arbitrator awards otherwise",
      },
      exclusivity: {
        period_days: exclusivity_days,
        end_date: exclusivity_end,
        terms: `During the exclusivity period, Seller agrees not to solicit, negotiate, or enter into any agreement with any third party regarding the sale, license, or transfer of the included assets. Buyer agrees to proceed in good faith toward closing.`,
        break_fee: "If Buyer withdraws without cause after exclusivity execution, Buyer forfeits any due diligence fees paid. No break fee owed by Seller.",
      },
      disclaimer: "This term sheet is a non-binding expression of intent and does not constitute a legally binding agreement. The transaction is subject to execution of a mutually acceptable Definitive Asset Purchase Agreement. This document is confidential and subject to the NDA previously executed between the parties.",
    };

    return Response.json({ success: true, term_sheet: termSheet });
  } catch (error) {
    console.error('Acquisition term sheet error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});