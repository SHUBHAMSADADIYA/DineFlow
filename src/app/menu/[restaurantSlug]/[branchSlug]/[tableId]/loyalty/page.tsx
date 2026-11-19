'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CustomerHeader } from '@/components/CustomerHeader';
import { formatINR } from '@/lib/utils';
import {
  Award,
  Search,
  Sparkles,
  ArrowLeft,
  Gift,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default function CustomerLoyaltyPage({
  params,
}: {
  params: { restaurantSlug: string; branchSlug: string; tableId: string };
}) {
  const { restaurantSlug, branchSlug, tableId } = params;
  const tableNumber = tableId.toUpperCase();
  const basePath = `/menu/${restaurantSlug}/${branchSlug}/${tableNumber}`;

  const [phone, setPhone] = useState('9876543210');
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/loyalty?phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomer(data.customer);
      } else {
        setCustomer(null);
      }
      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* Customer Header */}
      <CustomerHeader
        restaurantName="Zaika Restaurant & Bar"
        tableNumber={tableNumber}
        restaurantSlug={restaurantSlug}
        branchSlug={branchSlug}
      />

      <div className="max-w-xl mx-auto px-4 pt-4">
        {/* Back Link */}
        <Link
          href={basePath}
          className="inline-flex items-center space-x-1 text-xs font-bold text-gray-500 hover:text-[#E76F35] mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>

        {/* Title */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#25364A]">Zaika Rewards Club</h2>
            <p className="text-xs text-gray-500">Earn 5 points for every ₹100 spent</p>
          </div>
        </div>

        {/* Search Phone Box */}
        <form onSubmit={handleLookup} className="bg-white rounded-2xl p-4 border border-gray-200 mb-4 shadow-sm">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
            Check Your Points Balance
          </label>
          <div className="flex space-x-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              className="flex-1 text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-3 bg-[#E76F35] text-white text-xs font-bold rounded-xl hover:bg-[#D3551B] transition shadow"
            >
              {loading ? 'Checking...' : 'Check'}
            </button>
          </div>
        </form>

        {customer ? (
          <div className="space-y-4">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-[#25364A] to-[#1C2A3A] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] uppercase font-bold tracking-widest text-orange-400">
                  Zaika Club Member
                </span>
                <h3 className="text-xl font-black mt-1">{customer.name}</h3>
                <p className="text-xs text-gray-400">{customer.phone}</p>

                <div className="mt-6 pt-4 border-t border-gray-700/80 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block">Available Balance</span>
                    <span className="text-3xl font-black text-amber-400">
                      {customer.loyaltyPoints} <span className="text-sm">pts</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">Redemption Value</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {formatINR(customer.loyaltyPoints)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Member Stats */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <span className="text-xs text-gray-400 block font-semibold">Total Visits</span>
                <span className="text-lg font-black text-[#25364A]">{customer.totalVisits}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <span className="text-xs text-gray-400 block font-semibold">Lifetime Spend</span>
                <span className="text-lg font-black text-[#E76F35]">
                  {formatINR(customer.totalSpent)}
                </span>
              </div>
            </div>

            {/* Available Perks */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center">
                <Gift className="w-3.5 h-3.5 mr-1 text-[#E76F35]" />
                <span>Available Member Coupons</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#25364A]">WELCOME100</p>
                    <p className="text-[11px] text-gray-500">Flat ₹100 off on orders above ₹300</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#E76F35] bg-white px-2 py-1 rounded">
                    Active
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#25364A]">ZAIKA50</p>
                    <p className="text-[11px] text-gray-500">Flat ₹50 off on all tandoor & curry mains</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-1 rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : searched ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
            <Sparkles className="w-10 h-10 text-orange-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-700">No previous orders found for this number</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              Place an order today to automatically open your loyalty wallet and receive welcome bonus points!
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
