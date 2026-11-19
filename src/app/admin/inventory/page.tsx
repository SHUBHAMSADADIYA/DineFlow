'use client';

import { useState, useEffect } from 'react';
import {
  Layers,
  AlertTriangle,
  Plus,
  Minus,
  RefreshCw,
  Search,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { InventoryItem } from '@/lib/types';
import { formatINR } from '@/lib/utils';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchInventory = () => {
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setInventory(data.inventory);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjustStock = async (id: string, delta: number) => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, amount: delta }),
      });
      const data = await res.json();
      if (data.success) {
        setInventory((prev) =>
          prev.map((item) => (item.id === id ? data.item : item))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = inventory.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockItems = inventory.filter((i) => i.currentStock <= i.lowStockThreshold);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#25364A]">Inventory & Recipe Control</h1>
          <p className="text-xs text-gray-500">
            Real-time raw ingredient tracking with automatic order recipe deductions
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="p-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Low Stock Warning Banner if applicable */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-500 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider">
                Low Stock Threshold Alert ({lowStockItems.length} items)
              </p>
              <p className="text-xs text-amber-100 mt-0.5">
                {lowStockItems.map((i) => `${i.name} (${i.currentStock} ${i.unit})`).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              lowStockItems.forEach((i) => handleAdjustStock(i.id, 10));
            }}
            className="px-3 py-1.5 bg-white text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-50 transition shadow"
          >
            Quick Restock +10
          </button>
        </div>
      )}

      {/* Recipe Auto-Deduct Demo Box */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#E76F35] flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[#25364A]">Automated Recipe Link Active</h3>
            <p className="text-gray-400">
              Paneer Makhani orders automatically deduct 200g Malai Paneer & 30g Butter per plate.
            </p>
          </div>
        </div>
        <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
          Sync Engine: Active
        </span>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ingredient..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#E76F35]"
            />
          </div>
          <span className="text-xs text-gray-400 font-semibold hidden sm:inline">
            {inventory.length} Tracked Ingredients
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#F7F8FA] text-gray-400 uppercase text-[10px] font-bold border-b border-gray-100">
              <tr>
                <th className="p-3.5 pl-5">Ingredient</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5">Alert Level</th>
                <th className="p-3.5">Cost / Unit</th>
                <th className="p-3.5 text-right pr-5">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => {
                const isLow = item.currentStock <= item.lowStockThreshold;
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-3.5 pl-5 font-bold text-[#25364A]">
                      {item.name}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`font-black ${
                          isLow ? 'text-red-600 font-bold' : 'text-gray-800'
                        }`}
                      >
                        {item.currentStock} {item.unit}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-400">
                      &le; {item.lowStockThreshold} {item.unit}
                    </td>
                    <td className="p-3.5 font-semibold text-gray-800">
                      {formatINR(item.costPerUnit)}
                    </td>
                    <td className="p-3.5 text-right pr-5">
                      <div className="inline-flex items-center space-x-1 border border-gray-200 rounded-lg p-0.5 bg-gray-50">
                        <button
                          onClick={() => handleAdjustStock(item.id, -1)}
                          className="w-6 h-6 rounded bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold"
                          title="Reduce 1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(item.id, 1)}
                          className="w-6 h-6 rounded bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold"
                          title="Add 1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(item.id, 5)}
                          className="px-1.5 h-6 rounded bg-[#E76F35] text-white hover:bg-[#D3551B] flex items-center justify-center text-[10px] font-bold"
                          title="Restock shipment +5"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
