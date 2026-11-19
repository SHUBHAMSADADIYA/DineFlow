'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CustomerHeader } from '@/components/CustomerHeader';
import { formatINR } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Receipt,
  Utensils,
  ChevronRight,
  Flame,
  ChefHat,
  Bell,
  RefreshCw,
} from 'lucide-react';

export default function OrderTrackingPage({
  params,
}: {
  params: {
    restaurantSlug: string;
    branchSlug: string;
    tableId: string;
    orderId: string;
  };
}) {
  const { restaurantSlug, branchSlug, tableId, orderId } = params;
  const tableNumber = tableId.toUpperCase();
  const basePath = `/menu/${restaurantSlug}/${branchSlug}/${tableNumber}`;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = () => {
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.order);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 4000); // Polling for live kitchen status
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E76F35] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-bold text-gray-500">Loading order status...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] p-6 text-center">
        <p className="text-sm font-bold text-gray-700">Order not found</p>
        <Link href={basePath} className="text-xs text-[#E76F35] font-bold mt-2 inline-block">
          Return to Menu
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'PLACED', label: 'Order Placed', desc: 'Saved to system' },
    { key: 'ACCEPTED', label: 'Accepted', desc: 'Order acknowledged' },
    { key: 'PREPARING', label: 'Preparing', desc: 'In tandoor & wok' },
    { key: 'READY', label: 'Ready', desc: 'Plated by chefs' },
    { key: 'SERVED', label: 'Served', desc: 'Enjoy your meal!' },
  ];

  const statusOrder = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED'];
  const currentStepIdx = statusOrder.indexOf(order.status);

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* Customer Header */}
      <CustomerHeader
        restaurantName="Zaika Restaurant & Bar"
        tableNumber={tableNumber}
        restaurantSlug={restaurantSlug}
        branchSlug={branchSlug}
      />

      <div className="max-w-2xl mx-auto px-4 pt-4">
        {/* Order Header Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400">
                Live Kitchen Tracking
              </span>
              <h2 className="text-lg font-black text-[#25364A]">
                Order #{order.orderNumber}
              </h2>
            </div>
            <button
              onClick={fetchOrder}
              className="p-2 text-gray-400 hover:text-[#E76F35] rounded-lg transition"
              title="Refresh status"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Status Progress Bar */}
          <div className="relative pt-2 pb-4">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-orange-100">
              <div
                style={{
                  width: `${Math.min(100, Math.max(15, (currentStepIdx + 1) * 20))}%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#E76F35] transition-all duration-500"
              ></div>
            </div>

            <div className="grid grid-cols-5 gap-1 text-center">
              {steps.map((st, i) => {
                const isPassed = currentStepIdx >= i;
                const isCurrent = currentStepIdx === i;
                return (
                  <div key={st.key} className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 ${
                        isPassed
                          ? 'bg-[#E76F35] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-orange-200' : ''}`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span
                      className={`text-[10px] font-bold ${
                        isCurrent ? 'text-[#E76F35]' : isPassed ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Remaining Callout */}
          {order.status !== 'SERVED' && order.status !== 'COMPLETED' ? (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#E76F35]" />
                <span className="text-xs font-bold text-orange-950">
                  Estimated Preparation Time
                </span>
              </div>
              <span className="text-xs font-black text-[#E76F35] bg-white px-2 py-0.5 rounded shadow-sm">
                ~{order.estimatedMinutesRemaining} mins remaining
              </span>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs font-bold text-emerald-800 text-center mt-2">
              🎉 Dishes have been served at your table! Enjoy your royal meal.
            </div>
          )}
        </div>

        {/* Spice Quiz Gamification Banner While Waiting */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 text-white shadow-md mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Play the Zaika Spice Quiz!</h3>
              <p className="text-[11px] text-amber-100">
                Win up to 50 reward points while waiting for your order
              </p>
            </div>
          </div>
          <Link
            href={`${basePath}/quiz`}
            className="px-3.5 py-2 bg-white text-orange-600 rounded-xl text-xs font-extrabold shadow hover:bg-orange-50 transition"
          >
            Play Now
          </Link>
        </div>

        {/* Ordered Dishes List with Station Badges */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center">
            <Utensils className="w-3.5 h-3.5 mr-1 text-[#25364A]" />
            <span>Items Ordered ({order.items.length})</span>
          </h3>

          <div className="divide-y divide-gray-100">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#25364A]">{item.quantity}x</span>
                    <span className="font-semibold text-gray-800">{item.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 ml-5 block">
                    Station: {item.stationName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#25364A]">{formatINR(item.totalPrice)}</span>
                  <span className="text-[10px] block font-bold text-orange-600">
                    {item.itemStatus || order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 mt-2 border-t border-gray-100 flex justify-between text-xs font-bold">
            <span className="text-gray-500">Total Bill Amount</span>
            <span className="text-sm font-black text-[#E76F35]">{formatINR(order.finalAmount)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href={basePath}
            className="py-3 px-4 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-bold rounded-xl text-center shadow-sm transition"
          >
            Order More Dishes
          </Link>
          <Link
            href={`${basePath}/bill`}
            className="py-3 px-4 bg-[#25364A] hover:bg-slate-800 text-white text-xs font-bold rounded-xl text-center shadow transition flex items-center justify-center space-x-1"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>View & Settle Bill</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
