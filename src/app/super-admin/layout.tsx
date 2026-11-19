'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
  CreditCard,
  Activity,
  ArrowLeft,
  LogOut,
  UtensilsCrossed,
} from 'lucide-react';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex">
      {/* Super Admin Sidebar */}
      <aside className="w-64 bg-[#141F2B] text-white flex flex-col justify-between hidden md:flex flex-shrink-0">
        <div>
          {/* Logo */}
          <div className="h-16 px-6 flex items-center space-x-2.5 border-b border-gray-800">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-sm shadow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-white">
                DineFlow <span className="text-purple-400">HQ</span>
              </span>
              <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                Super Admin Console
              </span>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            <Link
              href="/super-admin"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                pathname === '/super-admin'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>SaaS Platform Overview</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            href="/admin"
            className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-gray-200 transition"
          >
            <UtensilsCrossed className="w-4 h-4 text-orange-400" />
            <span>Switch to Zaika Tenant</span>
          </Link>
          <Link
            href="/"
            className="flex items-center space-x-2 p-2 text-xs text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <span className="bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
              Platform Master
            </span>
            <h2 className="text-sm font-black text-[#25364A]">
              Multi-Tenant Cloud Operations
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
              SA
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
