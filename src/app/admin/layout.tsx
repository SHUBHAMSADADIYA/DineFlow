'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  QrCode,
  Layers,
  Users,
  Store,
  Receipt,
  Settings,
  ShoppingBag,
  Bell,
  LogOut,
  ChevronDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [selectedBranch, setSelectedBranch] = useState('Ahmedabad (Prahlad Nagar)');

  const navItems = [
    { label: 'Overview Analytics', href: '/admin', icon: LayoutDashboard },
    { label: 'Live Orders Feed', href: '/admin/live-orders', icon: ShoppingBag },
    { label: 'Floor & Tables', href: '/admin/floor', icon: UtensilsCrossed },
    { label: 'Table QR Standees', href: '/admin/qr-codes', icon: QrCode },
    { label: 'Digital Menu & Dishes', href: '/admin/menu', icon: Sparkles },
    { label: 'Inventory & Recipes', href: '/admin/inventory', icon: Layers },
    { label: 'Staff Management', href: '/admin/staff', icon: Users },
    { label: 'Customer CRM & Loyalty', href: '/admin/crm', icon: Users },
    { label: 'Billing & GST Invoices', href: '/admin/billing', icon: Receipt },
    { label: 'Branches (Outlets)', href: '/admin/branches', icon: Store },
    { label: 'Restaurant Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#25364A] text-white flex flex-col justify-between hidden md:flex flex-shrink-0">
        <div>
          {/* Logo & Brand */}
          <div className="h-16 px-6 flex items-center space-x-2.5 border-b border-gray-700/80">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E76F35] to-[#EE8E47] flex items-center justify-center text-white font-black text-sm shadow">
              DF
            </div>
            <div>
              <span className="font-black text-lg tracking-tight">
                Dine<span className="text-[#E76F35]">Flow</span>
              </span>
              <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                Owner Portal
              </span>
            </div>
          </div>

          {/* Restaurant & Branch Switcher */}
          <div className="p-4 border-b border-gray-700/60">
            <div className="bg-[#1C2A3A] p-2.5 rounded-xl border border-gray-700">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                Active Tenant Outlet
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-bold text-white truncate">
                  Zaika &bull; {selectedBranch}
                </span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-[#E76F35] text-white shadow-md'
                      : 'text-gray-300 hover:bg-[#1C2A3A] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700/60 space-y-2">
          <Link
            href="/kitchen"
            target="_blank"
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#1C2A3A] hover:bg-slate-700 text-xs font-bold text-gray-300 transition"
          >
            <div className="flex items-center space-x-2">
              <ChefHat className="w-4 h-4 text-[#E76F35]" />
              <span>Launch KDS Screen</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </Link>

          <Link
            href="/staff"
            target="_blank"
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#1C2A3A] hover:bg-slate-700 text-xs font-bold text-gray-300 transition"
          >
            <div className="flex items-center space-x-2">
              <UtensilsCrossed className="w-4 h-4 text-blue-400" />
              <span>Open Waiter POS</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </Link>

          <Link
            href="/"
            className="flex items-center space-x-2 p-2 text-xs text-gray-400 hover:text-white transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-black text-[#25364A] hidden sm:block">
              Zaika Restaurant & Bar &bull; Management Console
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/menu/zaika/ahmedabad/T05"
              target="_blank"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-[#E76F35] text-xs font-bold hover:bg-[#E76F35] hover:text-white transition"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Preview Customer Menu (T05)</span>
            </Link>

            <Link
              href="/super-admin"
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 transition"
            >
              Super Admin View
            </Link>

            <div className="w-8 h-8 rounded-full bg-[#25364A] text-white flex items-center justify-center font-bold text-xs">
              SO
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
