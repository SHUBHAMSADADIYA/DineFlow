'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UtensilsCrossed,
  Plus,
  RefreshCw,
  QrCode,
  Users,
  Check,
  Edit2,
  Trash2,
} from 'lucide-react';
import { RestaurantTable, TableStatus } from '@/lib/types';

export default function AdminFloorPage() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('ALL');

  // New table modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTableNum, setNewTableNum] = useState('');
  const [newCapacity, setNewCapacity] = useState(4);
  const [newSection, setNewSection] = useState('Main Dining');

  const fetchTables = () => {
    fetch('/api/tables')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTables(data.tables);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleStatusChange = async (tableId: string, status: TableStatus) => {
    try {
      await fetch('/api/tables', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, status }),
      });
      fetchTables();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNum.trim()) return;

    const newT: RestaurantTable = {
      id: `table-${newTableNum.toLowerCase()}`,
      branchId: 'branch-ahmedabad-01',
      tableNumber: newTableNum.trim().toUpperCase(),
      capacity: Number(newCapacity),
      section: newSection,
      status: 'AVAILABLE',
    };

    setTables((prev) => [...prev, newT]);
    setShowAddModal(false);
    setNewTableNum('');
  };

  const sections = ['ALL', 'Main Dining', 'Window AC Hall', 'Family Cabana', 'Garden Courtyard', 'Royal VIP Lounge'];

  const filteredTables = tables.filter((t) => {
    if (selectedSection !== 'ALL' && t.section !== selectedSection) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#25364A]">Dining Floor & Table Setup</h1>
          <p className="text-xs text-gray-500">
            Interactive visual floor map, capacity configuration & QR token binding
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/admin/qr-codes"
            className="px-3.5 py-2 bg-orange-50 border border-orange-200 text-[#E76F35] text-xs font-bold rounded-xl hover:bg-[#E76F35] hover:text-white transition flex items-center space-x-1"
          >
            <QrCode className="w-4 h-4" />
            <span>Generate Standees</span>
          </Link>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-[#25364A] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition flex items-center space-x-1 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Table</span>
          </button>
        </div>
      </div>

      {/* Section Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSection(sec)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedSection === sec
                ? 'bg-[#25364A] text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTables.map((table) => (
          <div
            key={table.id}
            className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#25364A] text-white flex items-center justify-center font-black text-lg shadow">
                    {table.tableNumber}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#25364A]">Table {table.tableNumber}</h3>
                    <p className="text-xs text-gray-400">{table.section}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-gray-500 flex items-center justify-end">
                    <Users className="w-3.5 h-3.5 mr-1" /> {table.capacity} Pax
                  </span>
                  <span className="text-[10px] font-bold text-[#E76F35] block mt-0.5">
                    {table.status}
                  </span>
                </div>
              </div>

              {table.activeCustomerName && (
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs mb-3">
                  <span className="text-gray-400 block text-[10px]">Active Customer:</span>
                  <span className="font-bold text-gray-800">{table.activeCustomerName}</span>
                  {table.currentOrderId && (
                    <span className="text-gray-500 ml-2">({table.currentOrderId})</span>
                  )}
                </div>
              )}
            </div>

            {/* Change Status Fast Buttons */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                Quick Status Switch:
              </span>
              <div className="grid grid-cols-3 gap-1 text-[11px] font-bold">
                <button
                  onClick={() => handleStatusChange(table.id, 'AVAILABLE')}
                  className={`py-1 rounded-lg border ${
                    table.status === 'AVAILABLE'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Free
                </button>
                <button
                  onClick={() => handleStatusChange(table.id, 'OCCUPIED')}
                  className={`py-1 rounded-lg border ${
                    table.status === 'OCCUPIED'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Occupied
                </button>
                <button
                  onClick={() => handleStatusChange(table.id, 'CLEANING')}
                  className={`py-1 rounded-lg border ${
                    table.status === 'CLEANING'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Cleaning
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddTable}
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4"
          >
            <h3 className="text-base font-bold text-[#25364A]">Add Table to Floor</h3>

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">
                Table Identifier (e.g. T07, B01, R01)
              </label>
              <input
                type="text"
                required
                value={newTableNum}
                onChange={(e) => setNewTableNum(e.target.value)}
                placeholder="T07"
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">
                Seating Capacity
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={newCapacity}
                onChange={(e) => setNewCapacity(Number(e.target.value))}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">
                Floor Section
              </label>
              <select
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
              >
                <option value="Main Dining">Main Dining</option>
                <option value="Window AC Hall">Window AC Hall</option>
                <option value="Family Cabana">Family Cabana</option>
                <option value="Garden Courtyard">Garden Courtyard</option>
                <option value="Royal VIP Lounge">Royal VIP Lounge</option>
              </select>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-[#E76F35] text-white text-xs font-bold hover:bg-[#D3551B] transition shadow"
              >
                Add Table
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
