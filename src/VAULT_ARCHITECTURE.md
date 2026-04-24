# Scalar Venture Vault — Monetization Funnel Architecture

## Overview
A complete B2B SaaS platform for selling premium engineering build systems. Core funnel: **Traffic → Landing → Free Preview → Paywall → Membership → Upsells**

---

## Pages & Routes

### 1. **Homepage** (`/venture`)
- **File**: `pages/ScalarVentureHome.jsx`
- **Purpose**: Convert first-time visitors into vault explorers
- **Components**:
  - Hero section with main CTA "Unlock the Vault"
  - 4 preview cards (blurred, locked)
  - Value stack (6 tiles: builds, BOMs, courses, etc.)
  - Feature highlights (complete, source-documented, execution-ready)
  - Pricing tiers preview (3 cards, Pro highlighted)
  - Social proof (3 testimonials)
  - Final CTA section
  - Lead magnet popup (email capture, 40s delay or 50% scroll)

### 2. **Vault Browser** (`/vault`)
- **File**: `pages/VaultBrowser.jsx`
- **Purpose**: Show all 40+ builds in a searchable, filterable grid
- **Features**:
  - Search by title/description
  - Filter by category (Energy, Communications, Bio-Signal, Instrumentation, Bio-Tech)
  - Grid layout (responsive: 1 col mobile → 4 cols desktop)
  - Each card shows: emoji, title, short desc, cost, lock icon
  - Locked builds show overlay on hover
  - Navigation back to home
  - Final CTA: "Ready to access the vault?" → /pricing

### 3. **Build Detail** (`/build/:id`)
- **File**: `pages/BuildDetail.jsx`
- **Purpose**: Sell access to a specific build
- **Sections**:
  - Header: category, title, cost
  - 2-column layout: visual (left) + sidebar (right)
  - Locked info box with CTA: "Unlock Full Build"
  - Kit upsell: "Buy the Kit" (physical product)
  - Overview: what it is, market context, estimated cost
  - "What You Get" list (7 items)
  - BOM Preview (collapsible, 4-row table sample)
  - Assembly Steps Preview (collapsible, 3-step sample)
  - Final CTA: "View Membership Plans"

### 4. **Paywall Gate** (`/paywall`)
- **File**: `pages/PaywallGate.jsx`
- **Purpose**: Hard gate for locked content (trigger: 2+ views or clicking locked sections)
- **Components**:
  - Icon: lock
  - Headline: "You're Seeing the Preview"
  - Value list (6 benefits)
  - Email capture form
  - Secondary CTA: "View All Plans"
  - Trust signals: 🔒 Stripe, 30-day guarantee, cancel anytime

### 5. **Pricing Page** (`/pricing-vault`)
- **File**: `pages/VaultPricing.jsx`
- **Purpose**: Convert paywalled users to paying members
- **Tiers**:
  - **Starter** ($49/mo): 15 builds, BOM previews
  - **Pro** ($99/mo): 40+ builds, full access, 40+ courses, patent suite ← highlighted with scale-up
  - **Elite** ($199/mo): everything + early access, 1-on-1 calls, investor network
- **Per tier**: features list with ✓ checks, not-included items with ○
- **FAQ**: 5 common questions (trial, discounts, proration, updates, team pricing)
- **Final CTA**: "Browse Builds First" → /vault

### 6. **Member Dashboard** (`/my-vault`)
- **File**: `pages/MemberVault.jsx`
- **Purpose**: Post-purchase home for members
- **Tabs**:
  - **Saved Builds**: Bookmarked builds with progress bar
  - **Recent**: History of viewed, downloaded, started builds
  - **Recommended**: AI-suggested builds (87–92% match)
- **Controls**: Settings, Logout

---

## Core Conversions & Gates

### Content Gating Strategy
1. **Free Access**: Homepage hero + preview cards (blurred)
2. **First Gate**: Vault browser (searchable, all 40 builds visible but locked)
3. **Second Gate**: Build detail page (BOM/steps preview only)
4. **Hard Gate**: After 2 views OR clicking "Unlock" → `/paywall`
5. **Conversion**: Email capture → redirect to `/pricing-vault`

### Upsells
- **Primary**: Membership tiers (recurring revenue)
- **Secondary**: Kit sales on each build page (one-time, physical products)
- **Tertiary**: Advanced builds in Elite tier (upgrade incentive)

---

## User Journeys

### Journey 1: Visitor → Free Trial Member
```
/venture (hero) 
  → email capture (lead magnet)
  → /vault (browse all)
  → /build/1 (preview)
  → /paywall (hard gate)
  → email capture
  → /pricing-vault
  → [checkout]
  → /my-vault (dashboard)
```

### Journey 2: Direct to Pricing
```
/venture → /pricing-vault → [checkout] → /my-vault
```

### Journey 3: Browse First, Later Upgrade
```
/vault → /build/1 (preview) → /paywall → [exit & return later] → /pricing-vault
```

---

## Design System

### Colors
- **Primary**: Cyan (#06b6d4) / Blue (#3b82f6)
- **Accent**: Green (#22c55e) for success, Orange (#f97316) for kits
- **Background**: Gray-950 (dark base) / Gray-900 (cards)
- **Text**: White (primary), Gray-400 (secondary), Gray-600 (tertiary)

### Typography
- **Headings**: Font-black, text-4xl–7xl
- **Body**: Font-normal, text-sm–base
- **Labels**: Font-bold, text-xs, uppercase tracking-wider

### Components
- Cards: `bg-gray-900 border border-gray-800 rounded-2xl`
- Buttons: `px-8 py-3 rounded-xl font-black transition-all`
- Inputs: `bg-gray-800 border border-gray-700 rounded-xl`
- Locked state: Lock icon + overlay on hover

### Responsive
- Mobile-first
- Breakpoints: sm (640px), lg (1024px)
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

---

## Analytics & Tracking

### Key Events to Track
```
- page_view (landing, vault, build, paywall, pricing)
- lead_magnet_view (triggered)
- lead_magnet_submit (email captured)
- paywall_view (trigger: 2nd view or locked click)
- paywall_conversion (email → pricing redirect)
- checkout_start (clicked pricing CTA)
- checkout_complete (subscription activated)
- member_action (viewed build, saved, downloaded)
```

### Revenue Tracking
- Subscription MRR by tier
- One-time kit sales by build
- LTV by acquisition channel
- Paywall → Pricing conversion rate

---

## Monetization Breakdown

### Revenue Streams
1. **Subscriptions** (70%): Starter ($49), Pro ($99), Elite ($199)
2. **Digital Products** (20%): Individual build guides ($500–$2,000 one-time)
3. **Kit Sales** (10%): Physical components ($167–$389 per kit)

### Unit Economics (Pro tier @ $99/mo)
- LTV (12-month): $1,188
- CAC target: $150 (12-month payback)
- Churn target: <5% monthly
- ARPU expansion: Kit upsells, Elite upgrades

---

## Technical Stack

### Frontend
- React 18 + React Router
- Tailwind CSS (dark theme)
- Lucide React (icons)
- Framer Motion (optional: animations)

### Backend Integration (Stripe)
- `createCheckoutSession()` function
- Webhook: `stripeWebhook.js`
- Email capture: `NewsletterSubscriber` entity

### Data
- Entities: `User`, `NewsletterSubscriber`, `ShopOrder` (for kits)
- Mock data: `BUILDS` array (upgrade to database)

---

## Next Steps

### Phase 1 (MVP)
- ✅ Pages built (landing, vault, build, paywall, pricing, dashboard)
- ⚠️ Stripe checkout integration (exists but needs wiring)
- ⚠️ Email capture automation
- ⚠️ Analytics event tracking

### Phase 2
- Build detail page → actual database lookup (not mock)
- Kit checkout flow (separate Stripe product)
- Email drip sequence (post-signup)
- A/B testing on headlines/CTAs
- Admin dashboard (view conversions, refunds)

### Phase 3
- Member comments/reviews on builds
- Community forum
- Expert AMA sessions (Elite perk)
- Advanced builds (restricted to Elite)
- Affiliate program (members refer members)

---

## URL Structure
```
/venture              → Homepage
/vault                → All builds browser
/build/:id            → Build detail (id: 1–40)
/paywall              → Hard paywall gate
/pricing-vault        → Pricing & plans
/my-vault             → Member dashboard
```

---

## CTA Copy

### Homepage
- Main: "Unlock the Vault"
- Secondary: "See Free Preview"

### Vault
- Card: "View Details"
- Bottom: "Browse all 40+ builds →"

### Build Detail
- Sidebar: "Unlock Full Build"
- Kit: "Shop Kit"
- Bottom: "View Membership Plans"

### Paywall
- Primary: "Join & View Plans"
- Secondary: "View All Plans →"

### Pricing
- Per tier: "Start Free Trial"
- Bottom: "Browse Builds First →"

### Dashboard
- Tabs: Saved Builds, Recent, Recommended
- Navigation: Settings, Logout

---

## Key Metrics to Monitor

1. **Traffic**: Visitors to homepage, vault, builds
2. **Engagement**: Build views, time on page, saves
3. **Gate Performance**: Paywall trigger rate, view-to-gate ratio
4. **Conversion**: Paywall view → email capture rate (target: 15%)
5. **Monetization**: Pricing page → checkout completion (target: 8%)
6. **Retention**: 30-day active users, churn rate
7. **Expansion**: Tier upgrades, kit purchases per member
8. **LTV**: Customer lifetime value by acquisition source

---

## Success Criteria

- **Week 1**: 500+ landing page views, 50+ email signups
- **Week 4**: 20+ paid subscriptions, $2K MRR
- **Month 3**: 100+ active members, $8K MRR, <5% churn
- **Month 6**: 300+ active members, $30K MRR, tier upgrade rate >10%