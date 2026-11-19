import Link from 'next/link';
import {
  UtensilsCrossed,
  QrCode,
  ChefHat,
  LayoutDashboard,
  ShieldCheck,
  Smartphone,
  Flame,
  CreditCard,
  Layers,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  Users,
  Store,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA]">
      {/* Top Notice Bar */}
      <div className="bg-[#25364A] text-white text-xs sm:text-sm py-2 px-4 text-center font-medium">
        <span className="bg-[#E76F35] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mr-2">
          Live Interactive Demo
        </span>
        Experience DineFlow preloaded with authentic restaurant data for &quot;Zaika - Ahmedabad&quot;
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E76F35] to-[#EE8E47] flex items-center justify-center text-white shadow-md">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-[#25364A]">
                Dine<span className="text-[#E76F35]">Flow</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded">
                Restaurant OS
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="#portals" className="hover:text-[#E76F35] transition">5 Portals</a>
            <a href="#features" className="hover:text-[#E76F35] transition">Features</a>
            <a href="#pricing" className="hover:text-[#E76F35] transition">SaaS Plans</a>
            <Link href="/menu/zaika/ahmedabad/T05" className="hover:text-[#E76F35] transition">
              QR Menu Demo
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-[#25364A] hover:bg-gray-100 rounded-lg transition"
            >
              Sign In
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 text-sm font-semibold text-white bg-[#E76F35] hover:bg-[#D3551B] rounded-lg shadow-sm hover:shadow transition"
            >
              Launch Platform
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#E76F35] text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Next-Generation Cloud Restaurant Operating System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-[#25364A] tracking-tight max-w-4xl mx-auto leading-tight">
          One Platform. <br className="hidden sm:inline" />
          <span className="text-[#E76F35]">Complete Restaurant Control.</span>
        </h1>

        <p className="mt-5 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Seamlessly connect your customers, waiters, kitchen chefs, store managers, and franchise owners through one unified real-time database.
        </p>

        {/* 5 Portals Direct Launch Bar */}
        <div id="portals" className="mt-12 max-w-5xl mx-auto">
          <h2 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-4">
            Directly Test All 5 Roles in Real-Time:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Customer QR Portal */}
            <Link
              href="/menu/zaika/ahmedabad/T05"
              className="group bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#E76F35] hover:shadow-md transition text-left flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-orange-100 text-[#E76F35] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#25364A]">1. Customer QR</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Table T05 ordering, Spice Quiz & UPI bill
                </p>
              </div>
              <span className="inline-flex items-center text-xs font-semibold text-[#E76F35] mt-3 group-hover:translate-x-1 transition">
                Open Menu <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>

            {/* Waiter Staff Dashboard */}
            <Link
              href="/staff"
              className="group bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#25364A] hover:shadow-md transition text-left flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-[#25364A] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#25364A]">2. Waiter POS</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Floor map, assistance calls & quick order
                </p>
              </div>
              <span className="inline-flex items-center text-xs font-semibold text-[#25364A] mt-3 group-hover:translate-x-1 transition">
                Staff POS <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>

            {/* Kitchen KDS */}
            <Link
              href="/kitchen"
              className="group bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-red-500 hover:shadow-md transition text-left flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-red-100 text-[#D94B4B] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <ChefHat className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#25364A]">3. Kitchen KDS</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Tandoor, Curry & station routing
                </p>
              </div>
              <span className="inline-flex items-center text-xs font-semibold text-[#D94B4B] mt-3 group-hover:translate-x-1 transition">
                Cook View <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>

            {/* Restaurant Owner Dashboard */}
            <Link
              href="/admin"
              className="group bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition text-left flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#1D9B68] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#25364A]">4. Manager Admin</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Sales, inventory, menu, QR & reports
                </p>
              </div>
              <span className="inline-flex items-center text-xs font-semibold text-[#1D9B68] mt-3 group-hover:translate-x-1 transition">
                Admin Panel <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>

            {/* Super Admin */}
            <Link
              href="/super-admin"
              className="group bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-purple-500 hover:shadow-md transition text-left flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#25364A]">5. Super Admin</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Multi-tenant SaaS, billing & subscriptions
                </p>
              </div>
              <span className="inline-flex items-center text-xs font-semibold text-purple-700 mt-3 group-hover:translate-x-1 transition">
                Super Admin <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-[#E76F35] tracking-widest mb-2">
              End-to-End Restaurant Architecture
            </h2>
            <h3 className="text-3xl font-bold text-[#25364A]">
              Engineered for busy Indian & global restaurants
            </h3>
            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              Eliminate order errors, speed up kitchen turnaround by 40%, and delight diners with instant QR convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-gray-100 hover:border-gray-200 transition">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#E76F35] flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#25364A] mb-2">App-less Table QR Ordering</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Customers scan table QR standees to instantly view categorized menus with photos, customize half/full sizes, choose spice levels, and order directly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-gray-100 hover:border-gray-200 transition">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#25364A] flex items-center justify-center mb-4">
                <ChefHat className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#25364A] mb-2">Smart Kitchen Routing (KDS)</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Orders split automatically to designated station screens: Tandoor naans to the tandoori chef, curries to the gravy station, and drinks to the bar.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-gray-100 hover:border-gray-200 transition">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-[#1D9B68] flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#25364A] mb-2">Split Bills & UPI Payments</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Supports equal split or custom split payments, tip calculations, GST (CGST/SGST) compliance, and direct Razorpay / UPI QR payment verification.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-gray-100 hover:border-gray-200 transition">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 text-[#E9A23B] flex items-center justify-center mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#25364A] mb-2">Spice Quiz & Gamification</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Keep guests entertained while their food cooks with interactive Indian cuisine trivia. Guests win reward points directly credited to their loyalty wallet.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-gray-100 hover:border-gray-200 transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#25364A] mb-2">Recipe & Inventory Auto-Deduct</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Paneer, butter, and cream are deducted automatically from stock when orders are completed. Real-time low-stock alerts prevent 86ing dishes late.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-gray-100 hover:border-gray-200 transition">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Store className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#25364A] mb-2">Multi-Branch SaaS Isolation</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Manage Ahmedabad, Surat, and Mumbai outlets from one dashboard. Server-enforced tenant isolation guarantees complete data confidentiality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs uppercase font-bold text-[#E76F35] tracking-widest mb-2">
            Subscription Plans
          </h2>
          <h3 className="text-3xl font-bold text-[#25364A]">
            Transparent SaaS pricing for restaurants
          </h3>
          <p className="text-gray-500 mt-2 text-sm">
            Start with our 14-day free trial. No credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Basic</span>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-[#25364A]">₹999</span>
                <span className="ml-1 text-gray-500 text-sm">/month</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">Perfect for small cafes and quick-service diners.</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Digital QR Menu & Table Standees</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Table Floor Management (up to 15 tables)</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Waiter Staff POS Dashboard</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Basic Cash & UPI payment tracking</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 block text-center py-2.5 px-4 rounded-xl border border-[#25364A] text-[#25364A] font-semibold text-sm hover:bg-gray-50 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Professional (Featured) */}
          <div className="bg-white rounded-2xl p-8 border-2 border-[#E76F35] shadow-lg relative flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E76F35] text-white text-[11px] font-bold uppercase tracking-wider py-0.5 px-3 rounded-full">
              Most Popular
            </div>
            <div>
              <span className="text-xs font-bold text-[#E76F35] uppercase tracking-wider">Professional</span>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-[#25364A]">₹2,499</span>
                <span className="ml-1 text-gray-500 text-sm">/month</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">For full-service dine-in restaurants and bistros.</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#E76F35] mr-2" /> Everything in Basic</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#E76F35] mr-2" /> Multi-station Kitchen Display (KDS)</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#E76F35] mr-2" /> Customer Loyalty Points & Spice Quiz</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#E76F35] mr-2" /> Razorpay Integration & Split Billing</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#E76F35] mr-2" /> Live Analytics & GST Sales Invoices</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 block text-center py-2.5 px-4 rounded-xl bg-[#E76F35] text-white font-semibold text-sm hover:bg-[#D3551B] shadow transition"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Enterprise</span>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-[#25364A]">₹4,999</span>
                <span className="ml-1 text-gray-500 text-sm">/month</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">For multi-chain restaurants and hospitality groups.</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Everything in Professional</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Multi-branch central management</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Real-time Recipe & Inventory Auto-deduct</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Custom branding, domain & VIP support</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 block text-center py-2.5 px-4 rounded-xl border border-[#25364A] text-[#25364A] font-semibold text-sm hover:bg-gray-50 transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#25364A] text-white border-t border-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-white">
              Dine<span className="text-[#E76F35]">Flow</span>
            </span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/menu/zaika/ahmedabad/T05" className="hover:text-white transition">Customer Menu</Link>
            <Link href="/staff" className="hover:text-white transition">Waiter POS</Link>
            <Link href="/kitchen" className="hover:text-white transition">Kitchen KDS</Link>
            <Link href="/admin" className="hover:text-white transition">Admin Dashboard</Link>
            <Link href="/super-admin" className="hover:text-white transition">Super Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
