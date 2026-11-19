'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Users,
  Search,
  Sparkles,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function SuperAdminPage() {
  const [restaurants, setRestaurants] = useState([
    {
      id: 'rest-1',
      name: 'Zaika Restaurant & Bar',
      owner: 'Shubham Sadadiya',
      email: 'owner@zaika.com',
      city: 'Ahmedabad, Gujarat',
      plan: 'ENTERPRISE',
      branches: 3,
      tables: 36,
      status: 'ACTIVE',
      joinedAt: '12 Jan 2024',
      mrr: 4999,
    },
    {
      id: 'rest-2',
      name: 'Haveli Royal Fine Dine',
      owner: 'Vikramaditya Rathore',
      email: 'contact@havelidining.in',
      city: 'Jaipur, Rajasthan',
      plan: 'PROFESSIONAL',
      branches: 2,
      tables: 24,
      status: 'ACTIVE',
      joinedAt: '04 Mar 2024',
      mrr: 2499,
    },
    {
      id: 'rest-3',
      name: 'Punjab Grill & Tadka',
      owner: 'Harpreet Singh',
      email: 'grill@punjabtadka.com',
      city: 'Chandigarh, Punjab',
      plan: 'PROFESSIONAL',
      branches: 1,
      tables: 16,
      status: 'ACTIVE',
      joinedAt: '18 Apr 2024',
      mrr: 2499,
    },
    {
      id: 'rest-4',
      name: 'Spice Route Coastal Bistro',
      owner: 'Ananya Menon',
      email: 'info@spiceroutebistro.com',
      city: 'Kochi, Kerala',
      plan: 'BASIC',
      branches: 1,
      tables: 10,
      status: 'ACTIVE',
      joinedAt: '22 Jun 2024',
      mrr: 999,
    },
    {
      id: 'rest-5',
      name: 'Udupi Sagar Pure Veg',
      owner: 'Narayana Bhat',
      email: 'manager@udupisagar.in',
      city: 'Bengaluru, Karnataka',
      plan: 'ENTERPRISE',
      branches: 5,
      tables: 60,
      status: 'ACTIVE',
      joinedAt: '01 Jul 2024',
      mrr: 4999,
    },
  ]);

  const [search, setSearch] = useState('');

  const toggleStatus = (id: string) => {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
          : r
      )
    );
  };

  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.city.toLowerCase().includes(search.toLowerCase()) ||
      r.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl font-black text-[#25364A]">SaaS Platform Health & Multi-Tenancy</h1>
        <p className="text-xs text-gray-500">
          Global platform overview, tenant isolation guards & subscription revenue
        </p>
      </div>

      {/* SaaS KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">
            Active Restaurant Tenants
          </span>
          <span className="text-2xl font-black text-[#25364A] block mt-2">
            128 Restaurants
          </span>
          <span className="text-xs font-bold text-emerald-600 mt-1 block">
            +14 new this month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">
            Monthly Recurring Revenue (MRR)
          </span>
          <span className="text-2xl font-black text-purple-700 block mt-2">
            ₹3,19,872
          </span>
          <span className="text-xs font-bold text-emerald-600 mt-1 block">
            +22.4% MoM growth
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">
            Annual Run Rate (ARR)
          </span>
          <span className="text-2xl font-black text-[#25364A] block mt-2">
            ₹38.38 Lakhs
          </span>
          <span className="text-xs font-bold text-purple-600 mt-1 block">
            100% cloud automated
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">
            Total Orders Processed
          </span>
          <span className="text-2xl font-black text-emerald-600 block mt-2">
            184,210 orders
          </span>
          <span className="text-xs font-bold text-gray-400 mt-1 block">
            Zero downtime (99.98%)
          </span>
        </div>
      </div>

      {/* Tenant Accounts Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter restaurants by name, city or owner..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-purple-600"
            />
          </div>

          <span className="text-xs font-bold text-gray-400">
            {restaurants.length} Tenants Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#F7F8FA] text-gray-400 uppercase text-[10px] font-bold border-b border-gray-100">
              <tr>
                <th className="p-3.5 pl-5">Restaurant Name & City</th>
                <th className="p-3.5">Owner / Contact</th>
                <th className="p-3.5">Plan Tier</th>
                <th className="p-3.5">Branches / Tables</th>
                <th className="p-3.5">Monthly Fee</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right pr-5">Tenant Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-3.5 pl-5">
                    <p className="font-bold text-[#25364A]">{r.name}</p>
                    <p className="text-[11px] text-gray-400">{r.city}</p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-semibold text-gray-800">{r.owner}</p>
                    <p className="text-[10px] text-gray-400">{r.email}</p>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`font-black text-[10px] px-2 py-0.5 rounded-lg border ${
                        r.plan === 'ENTERPRISE'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : r.plan === 'PROFESSIONAL'
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {r.plan}
                    </span>
                  </td>
                  <td className="p-3.5 font-medium text-gray-700">
                    {r.branches} Outlets &bull; {r.tables} Tables
                  </td>
                  <td className="p-3.5 font-black text-gray-800">
                    {formatINR(r.mrr)}/mo
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        r.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right pr-5">
                    <div className="inline-flex items-center space-x-1">
                      {r.name.includes('Zaika') && (
                        <Link
                          href="/admin"
                          className="px-2.5 py-1 text-[11px] font-bold bg-[#E76F35] text-white rounded-lg hover:bg-[#D3551B] transition shadow-sm"
                        >
                          Access Panel
                        </Link>
                      )}
                      <button
                        onClick={() => toggleStatus(r.id)}
                        className="px-2.5 py-1 text-[11px] font-bold border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                      >
                        {r.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
