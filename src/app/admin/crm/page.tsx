'use client';

import { useState } from 'react';
import {
  Users,
  Search,
  Award,
  Sparkles,
  Phone,
  Mail,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { INITIAL_CUSTOMERS } from '@/lib/seed-data';
import { formatINR } from '@/lib/utils';

export default function AdminCRMPage() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.favoriteDish.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#25364A]">Customer CRM & Loyalty Program</h1>
          <p className="text-xs text-gray-500">
            Diner profiles, lifetime visit value, reward points ledger & favorite dishes
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200 text-[#E76F35] text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1">
          <Award className="w-4 h-4" />
          <span>Reward Rule: 5 pts / ₹100 spent</span>
        </div>
      </div>

      {/* Customer CRM Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by diner name, phone or favorite curry..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#E76F35]"
            />
          </div>
          <span className="text-xs text-gray-400 font-semibold hidden sm:inline">
            {customers.length} Registered Diners
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#F7F8FA] text-gray-400 uppercase text-[10px] font-bold border-b border-gray-100">
              <tr>
                <th className="p-3.5 pl-5">Diner Name & Phone</th>
                <th className="p-3.5">Total Visits</th>
                <th className="p-3.5">Lifetime Spend</th>
                <th className="p-3.5">Reward Points</th>
                <th className="p-3.5">Signature Favorite</th>
                <th className="p-3.5 text-right pr-5">Last Dining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-3.5 pl-5">
                    <p className="font-bold text-[#25364A]">{c.name}</p>
                    <p className="text-[11px] text-gray-400">{c.phone}</p>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                      {c.totalVisits} visits
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-[#E76F35]">
                    {formatINR(c.totalSpent)}
                  </td>
                  <td className="p-3.5">
                    <span className="font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      ⭐ {c.loyaltyPoints} pts
                    </span>
                  </td>
                  <td className="p-3.5 text-gray-700 font-medium">
                    {c.favoriteDish}
                  </td>
                  <td className="p-3.5 text-right pr-5 text-gray-400">
                    {c.lastVisit}
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
