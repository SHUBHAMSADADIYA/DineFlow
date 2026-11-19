# DineFlow 🍽️
### One Platform. Complete Restaurant Control.
**Complete Cloud-Based Restaurant Management SaaS Operating System**

Inspired by premier restaurant hospitality software and engineered for modern dine-in restaurants, cafes, and multi-branch franchise chains.

---

## 🌟 The 5 Unified Interfaces

DineFlow links 5 distinct operational touchpoints through a single real-time backend:

1. **📱 Customer QR Ordering Website (`/menu/zaika/ahmedabad/T05`)**
   - Instant app-less ordering by scanning table standees.
   - Rich digital menu with photos, spice level selection, portion sizes (Half/Full), add-ons & cooking instructions.
   - Real-time order progress bar: Placed → Accepted → Preparing → Ready → Served.
   - Instant Steward Calls: Need Water, Need Napkins, Request Bill, Assistance.
   - **Spice Quiz Gamification**: Diners play Indian cuisine trivia while waiting for their food and win reward points!
   - Compliant Indian GST Tax Invoice & Split Billing (Equal split, by items, custom share).
   - Seamless payment methods: Instant UPI QR (GPay, PhonePe, Paytm, BHIM), Cards & Cash.
   - 1-Click PDF Receipt Download & 5-Star feedback rating.

2. **👔 Waiter & Floor Staff POS Dashboard (`/staff`)**
   - Visual floor map showing all tables with live status colors.
   - Table statuses: Available, Occupied, Ordering, Preparing, Eating, Bill Requested, Payment Pending, Cleaning, Reserved, Assistance Required.
   - Steward call queue: acknowledge and resolve water/napkin/bill calls in real-time.
   - Waiter-assisted ordering for elderly guests or phone-less diners.
   - Mark food served and record cash/UPI collections.

3. **👨‍🍳 Kitchen Display System - KDS (`/kitchen`)**
   - High-contrast, large-display interface for kitchen tablets and monitors.
   - Dedicated station filters: **Tandoor**, **Curry & Gravy**, **Wok & Chinese**, **Bar & Beverages**, **Desserts**, or **All Stations**.
   - Dynamic tickets showing table number, item modifiers, elapsed time, and urgency alerts.
   - Audio chime notifications when tickets or items are updated.
   - Automatic sync: when all station items are marked ready, customer order tracker flips to "Ready"!

4. **📊 Restaurant Owner & Manager Dashboard (`/admin`)**
   - Executive KPIs: Gross sales, order counts, average order value (AOV), occupancy rate.
   - Interactive charts: Hourly sales trends, category shares, top-selling signature dishes.
   - Visual Floor & Table layout manager with seating capacity controls.
   - **QR Code Standee Studio (`/admin/qr-codes`)**: 1-click printable acrylic standee designer and PNG/SVG export.
   - Digital Menu & Dish catalog manager with instant "Sold Out / 86" toggles.
   - **Recipe & Inventory Auto-Deductions (`/admin/inventory`)**: Paneer, butter, and cream are deducted automatically upon plate dispatch with low-stock alerts.
   - Customer CRM & Loyalty point management.
   - GST Sales register & CSV reports export.
   - Multi-branch outlet manager (Ahmedabad, Surat, Mumbai).

5. **🛡️ Super Admin SaaS Headquarters (`/super-admin`)**
   - Platform health metrics: ARR, MRR, Active restaurants, order volume.
   - Multi-tenant isolation and tenant directory: onboarding, suspension, trial extensions.
   - SaaS Subscription tiers: Basic (₹999/mo), Professional (₹2,499/mo), Enterprise (₹4,999/mo).

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database ORM**: Prisma ORM with normalized PostgreSQL schema
- **State & Data Store**: Intelligent dual-layer architecture (Prisma PostgreSQL client + In-Memory Reactive Seed Store for zero-setup deployments)
- **Charts & Visualization**: Recharts
- **Icons**: Lucide React
- **Document Generation**: jsPDF (Vector PDF invoices)
- **QR Code Engine**: node-qrcode (High-res SVG/PNG standees)
- **Gamification**: Canvas Confetti

---

## 🚀 Quick Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/SHUBHAMSADADIYA/DineFlow.git
cd DineFlow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables (Optional for demo)
```bash
cp .env.example .env.local
```
*(Note: DineFlow runs with rich demonstration data for "Zaika Restaurant" out of the box even before configuring a live database!)*

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 Route Directory

| Interface | URL Path | Description |
|---|---|---|
| Public Landing Page | `/` | Features, pricing, demo launchpad |
| Customer Menu (T05) | `/menu/zaika/ahmedabad/T05` | Table T05 ordering experience |
| Customer Cart | `/menu/zaika/ahmedabad/T05/cart` | Cart, coupons & tax breakdown |
| Live Order Tracker | `/menu/zaika/ahmedabad/T05/track/ORD-1042` | Live KDS progress bar |
| Settle Bill & UPI | `/menu/zaika/ahmedabad/T05/bill` | Split bill, UPI payment & tip |
| Tax Invoice & PDF | `/menu/zaika/ahmedabad/T05/receipt/ORD-1042` | Official invoice download & rating |
| Spice Quiz | `/menu/zaika/ahmedabad/T05/quiz` | Interactive game to win points |
| Loyalty Wallet | `/menu/zaika/ahmedabad/T05/loyalty` | Customer points balance |
| Waiter POS | `/staff` | Floor map & call waiter queue |
| Kitchen KDS | `/kitchen` | Station tickets & chef dispatch |
| Owner Dashboard | `/admin` | Sales analytics & KPIs |
| QR Standees | `/admin/qr-codes` | Standee printable export |
| Menu Manager | `/admin/menu` | Dish editing & in-stock switch |
| Inventory | `/admin/inventory` | Ingredients & recipe deduction |
| Super Admin HQ | `/super-admin` | Multi-tenant SaaS platform |

---

## 📦 1-Click Vercel Deployment

Deploy directly to your Vercel team account (`shubham-sadadiyas-projects`):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSHUBHAMSADADIYA%2FDineFlow&project-name=dineflow)

### Or Deploy from Vercel Web Console:
1. Visit [https://vercel.com/shubham-sadadiyas-projects](https://vercel.com/shubham-sadadiyas-projects)
2. Click **"Add New..."** ➔ **"Project"**
3. Select `SHUBHAMSADADIYA/DineFlow`
4. Keep default framework preset (`Next.js`)
5. Click **Deploy**!

---

## 📄 License
MIT &copy; Shubham Sadadiya - DineFlow SaaS
