'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  UtensilsCrossed,
  ChefHat,
  Receipt,
  Users,
  Clock,
  ArrowUpRight,
  Sparkles,
  Download,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('TODAY');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E76F35] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { stats, hourlySales, categoryBreakdown, topSellingItems } = data;

  return (
    <div className="space-y-6">
      {/* Top Banner & Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#25364A]">Performance Dashboard</h1>
          <p className="text-xs text-gray-500">
            Real-time operations, revenue metrics & station dispatch for Zaika Restaurant.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          {['TODAY', 'YESTERDAY', 'LAST_7_DAYS', 'THIS_MONTH'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
                timeRange === range
                  ? 'bg-[#25364A] text-white border-[#25364A]'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {range.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stat Cards (Section 10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Sales */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-bold uppercase tracking-wider">Today&apos;s Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#E76F35] flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#25364A]">₹48,600</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +18.4%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Net revenue after GST & discounts</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#25364A] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#25364A]">46 orders</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Avg 14.2 mins ticket turnaround</p>
        </div>

        {/* Active Tables */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-bold uppercase tracking-wider">Floor Occupancy</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#1D9B68] flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#25364A]">
              6 / 6 Active
            </span>
            <span className="text-xs font-bold text-emerald-600">100% full</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Tables T01-T06 currently occupied</p>
        </div>

        {/* Avg Order Value */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-bold uppercase tracking-wider">Average Order (AOV)</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#25364A]">₹1,056</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +8.5%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Driven by family combo specials</p>
        </div>
      </div>

      {/* Hourly Sales Trend & Category Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Trend Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#25364A]">Today&apos;s Hourly Sales Trend</h3>
              <p className="text-[11px] text-gray-400">Peak dining rush occurs between 13:00 - 14:00 & 20:00 - 21:00</p>
            </div>
            <span className="text-xs font-bold text-[#E76F35] bg-orange-50 px-2 py-1 rounded-lg">
              Live Feed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E76F35" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E76F35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`₹${value}`, 'Sales']}
                  contentStyle={{ backgroundColor: '#25364A', borderRadius: '8px', color: '#fff', border: 'none' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#E76F35" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#25364A]">Revenue by Category</h3>
            <p className="text-[11px] text-gray-400 mb-2">Main course and tandoor drive 66%</p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-gray-100 text-xs">
            {categoryBreakdown.map((item: any) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-bold text-[#25364A]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Selling Items & Operations Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Dishes */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#25364A]">Top Performing Signature Dishes</h3>
              <p className="text-[11px] text-gray-400">Ranked by volume ordered today</p>
            </div>
            <Link
              href="/admin/menu"
              className="text-xs font-bold text-[#E76F35] hover:underline"
            >
              Manage Menu &rarr;
            </Link>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {topSellingItems.map((dish: any, idx: number) => (
              <div key={dish.name} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-gray-100 text-gray-600 font-black flex items-center justify-center text-[10px]">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-[#25364A]">{dish.name}</span>
                    <span className="text-[10px] text-gray-400 block">{dish.count} orders today</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-[#25364A]">{formatINR(dish.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Station Health */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#25364A]">Kitchen Dispatch Health</h3>
            <p className="text-[11px] text-gray-400 mb-4">All stations connected to KDS</p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#25364A]">Tandoor Station</p>
                  <p className="text-[10px] text-gray-400">Head: Chef Gurpreet</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Avg 8m
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#25364A]">Curry & Gravy Station</p>
                  <p className="text-[10px] text-gray-400">Head: Chef Rajesh</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Avg 14m
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#25364A]">Bar & Beverages</p>
                  <p className="text-[10px] text-gray-400">Head: Steward Vikas</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Avg 4m
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/kitchen"
            target="_blank"
            className="mt-4 block text-center py-2.5 bg-[#25364A] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            Open Live Kitchen Screens
          </Link>
        </div>
      </div>
    </div>
  );
}
