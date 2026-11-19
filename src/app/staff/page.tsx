'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Bell,
  UtensilsCrossed,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  RefreshCw,
  Search,
  Check,
  ChevronRight,
  Receipt,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { RestaurantTable, AssistanceRequest, TableStatus } from '@/lib/types';

export default function StaffDashboardPage() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [assistanceReqs, setAssistanceReqs] = useState<AssistanceRequest[]>([]);
  const [filterSection, setFilterSection] = useState<string>('ALL');
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [loading, setLoading] = useState(true);

  // Quick order modal state
  const [showQuickOrderModal, setShowQuickOrderModal] = useState(false);
  const [quickOrderGuestName, setQuickOrderGuestName] = useState('');
  const [quickOrderNotes, setQuickOrderNotes] = useState('');

  const loadData = () => {
    Promise.all([
      fetch('/api/tables').then((r) => r.json()),
      fetch('/api/assistance').then((r) => r.json()),
    ])
      .then(([tablesData, assistanceData]) => {
        if (tablesData.success) setTables(tablesData.tables);
        if (assistanceData.success) setAssistanceReqs(assistanceData.requests);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000); // Live sync
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (tableId: string, newStatus: TableStatus) => {
    try {
      const res = await fetch('/api/tables', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setTables((prev) =>
          prev.map((t) => (t.id === tableId ? { ...t, status: newStatus } : t))
        );
        if (selectedTable?.id === tableId) {
          setSelectedTable((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveAssistance = async (id: string) => {
    try {
      await fetch('/api/assistance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: 'COMPLETED',
          handledByName: 'Ramesh (Floor Steward)',
        }),
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const pendingAssistance = assistanceReqs.filter((r) => r.status !== 'COMPLETED');

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'OCCUPIED':
      case 'ORDERING':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PREPARING':
        return 'bg-orange-50 text-[#E76F35] border-orange-200';
      case 'EATING':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'BILL_REQUESTED':
        return 'bg-amber-50 text-amber-700 border-amber-300 animate-soft-pulse';
      case 'ASSISTANCE_REQUIRED':
        return 'bg-red-50 text-red-700 border-red-300 animate-soft-pulse';
      case 'CLEANING':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-16">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#25364A] text-white flex items-center justify-center font-black text-sm">
                DF
              </div>
              <span className="font-black text-[#25364A] text-base">
                DineFlow <span className="text-[#E76F35]">POS</span>
              </span>
            </Link>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold hidden sm:inline">
              Zaika Ahmedabad &bull; Waiter Station
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Assistance Badge Pill */}
            {pendingAssistance.length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1.5 animate-bounce">
                <Bell className="w-3.5 h-3.5 text-red-500" />
                <span>{pendingAssistance.length} Steward Call{pendingAssistance.length > 1 ? 's' : ''}</span>
              </div>
            )}

            <button
              onClick={loadData}
              className="p-2 text-gray-500 hover:text-gray-800 rounded-lg transition"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              href="/kitchen"
              className="text-xs font-bold px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition"
            >
              Switch to KDS
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-5">
        {/* Urgent Customer Calls Alert Strip */}
        {pendingAssistance.length > 0 && (
          <div className="mb-6 bg-red-500 text-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <Bell className="w-4 h-4" />
                <span>Active Table Calls ({pendingAssistance.length})</span>
              </div>
              <span className="text-xs text-red-100">Live Queue</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {pendingAssistance.map((req) => (
                <div
                  key={req.id}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-black text-yellow-300">
                      Table {req.tableNumber}
                    </span>
                    <p className="font-semibold">{req.type.replace('_', ' ')}</p>
                    {req.customNote && (
                      <p className="text-[11px] text-gray-200 italic">&ldquo;{req.customNote}&rdquo;</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleResolveAssistance(req.id)}
                    className="px-2.5 py-1.5 bg-white text-red-600 rounded-lg font-bold text-xs hover:bg-gray-100 transition shadow"
                  >
                    Done
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Header & KPI Counters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-black text-[#25364A]">Dining Floor & Tables</h1>
            <p className="text-xs text-gray-500">
              {tables.filter((t) => t.status !== 'AVAILABLE').length} of {tables.length} tables active
            </p>
          </div>

          {/* Status Quick Legend */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              Available ({tables.filter((t) => t.status === 'AVAILABLE').length})
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-[#E76F35] font-semibold border border-orange-200">
              Cooking ({tables.filter((t) => t.status === 'PREPARING').length})
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-semibold border border-amber-200">
              Bill Requested ({tables.filter((t) => t.status === 'BILL_REQUESTED').length})
            </span>
          </div>
        </div>

        {/* Tables Floor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {tables.map((table) => {
            const isSelected = selectedTable?.id === table.id;
            return (
              <div
                key={table.id}
                onClick={() => setSelectedTable(table)}
                className={`bg-white rounded-2xl p-5 border cursor-pointer transition shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'border-[#E76F35] ring-2 ring-orange-200'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-[#25364A] text-white flex items-center justify-center font-black text-sm">
                      {table.tableNumber}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#25364A]">Table {table.tableNumber}</h3>
                      <p className="text-[11px] text-gray-400">{table.section} &bull; {table.capacity} Seats</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border ${getStatusColor(
                      table.status
                    )}`}
                  >
                    {table.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Table Details */}
                <div className="text-xs text-gray-600 space-y-1.5 pt-2 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Order:</span>
                    <span className="font-bold text-[#25364A]">
                      {table.currentOrderId || 'No active order'}
                    </span>
                  </div>
                  {table.activeCustomerName && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Guest:</span>
                      <span className="font-medium text-gray-700">{table.activeCustomerName}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons for Table */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/menu/zaika/ahmedabad/${table.tableNumber}`}
                    target="_blank"
                    className="text-xs text-[#E76F35] hover:underline font-semibold flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Open QR Menu</span>
                    <ChevronRight className="w-3 h-3 ml-0.5" />
                  </Link>

                  <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                    {table.status !== 'AVAILABLE' ? (
                      <button
                        onClick={() => handleUpdateStatus(table.id, 'AVAILABLE')}
                        className="px-2.5 py-1 text-[11px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                      >
                        Free Table
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(table.id, 'OCCUPIED')}
                        className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg"
                      >
                        Seat Guest
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Table Detail Drawer */}
        {selectedTable && (
          <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow-2xl p-4 max-w-4xl mx-auto rounded-t-3xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-black text-[#25364A]">
                  Table {selectedTable.tableNumber} Management
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${getStatusColor(
                    selectedTable.status
                  )}`}
                >
                  {selectedTable.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedTable(null)}
                className="text-xs font-bold text-gray-400 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-gray-500">
                Change table state instantly:
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(
                  ['AVAILABLE', 'OCCUPIED', 'PREPARING', 'EATING', 'BILL_REQUESTED', 'CLEANING'] as TableStatus[]
                ).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedTable.id, st)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
                      selectedTable.status === st
                        ? 'bg-[#25364A] text-white border-[#25364A]'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {selectedTable.currentOrderId && (
                <Link
                  href={`/menu/zaika/ahmedabad/${selectedTable.tableNumber}/bill`}
                  className="px-4 py-2 bg-[#E76F35] text-white text-xs font-bold rounded-xl hover:bg-[#D3551B] transition flex items-center space-x-1"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Settle Bill</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
