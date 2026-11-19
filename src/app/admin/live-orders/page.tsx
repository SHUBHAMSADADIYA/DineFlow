'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  RefreshCw,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Receipt,
  ExternalLink,
} from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { formatINR, formatDate } from '@/lib/utils';

export default function AdminLiveOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrders(data.orders);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'ALL' && o.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.tableNumber.toLowerCase().includes(q) ||
        (o.customerName && o.customerName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#25364A]">Live Orders Stream</h1>
          <p className="text-xs text-gray-500">
            Real-time multi-station orders across all dine-in tables
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition"
          title="Refresh Feed"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, table (e.g. T05), or diner name..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#E76F35]"
          />
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                filterStatus === st
                  ? 'bg-[#25364A] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-200">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-700">No matching orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col lg:flex-row justify-between gap-5"
            >
              {/* Order Info */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-[#25364A] text-white flex items-center justify-center font-black text-xs">
                    {order.tableNumber}
                  </span>
                  <div>
                    <h3 className="font-black text-sm text-[#25364A]">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Guest: {order.customerName || 'Walk-in Diner'} &bull; {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`ml-auto sm:ml-2 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
                      order.status === 'PREPARING'
                        ? 'bg-orange-50 text-[#E76F35] border-orange-200'
                        : order.status === 'READY'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : order.status === 'SERVED'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items preview */}
                <div className="bg-[#F7F8FA] p-3 rounded-xl border border-gray-100 divide-y divide-gray-200/60 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-1.5 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#25364A]">{item.quantity}x</span>
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <span className="text-[10px] bg-white border border-gray-200 px-1.5 rounded text-gray-500">
                          {item.stationName}
                        </span>
                      </div>
                      <span className="font-bold text-gray-800">{formatINR(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>

                {order.specialNotes && (
                  <p className="text-xs text-orange-700 bg-orange-50 p-2 rounded-lg font-medium">
                    Note: &ldquo;{order.specialNotes}&rdquo;
                  </p>
                )}
              </div>

              {/* Price & Action Strip */}
              <div className="lg:w-64 flex flex-col justify-between pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-5 space-y-4">
                <div>
                  <span className="text-xs text-gray-400 block font-semibold">Total Amount</span>
                  <span className="text-2xl font-black text-[#E76F35]">
                    {formatINR(order.finalAmount)}
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    {order.isPaid ? 'Payment Received' : 'Payment Pending'}
                  </span>
                </div>

                {/* Status Advancement Buttons */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Advance State:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {order.status === 'PLACED' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'ACCEPTED')}
                        className="py-1.5 px-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                      >
                        Accept
                      </button>
                    )}
                    {order.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'PREPARING')}
                        className="py-1.5 px-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition"
                      >
                        Cook
                      </button>
                    )}
                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'READY')}
                        className="py-1.5 px-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition"
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'READY' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'SERVED')}
                        className="py-1.5 px-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
                      >
                        Food Served
                      </button>
                    )}
                    {order.status === 'SERVED' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}
                        className="py-1.5 px-2 bg-[#25364A] text-white font-bold rounded-lg hover:bg-slate-800 transition"
                      >
                        Complete Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
