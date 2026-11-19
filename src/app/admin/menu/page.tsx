'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Plus,
  Search,
  Check,
  Flame,
  Clock,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
} from 'lucide-react';
import { MenuItem } from '@/lib/types';
import { formatINR } from '@/lib/utils';

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Add Item Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Main Course');
  const [newItemPrice, setNewItemPrice] = useState(250);
  const [newItemStation, setNewItemStation] = useState('Curry');
  const [newItemPrepTime, setNewItemPrepTime] = useState(15);
  const [newItemDesc, setNewItemDesc] = useState('');

  const fetchMenu = () => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setItems(data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleToggleAvailability = async (id: string) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'TOGGLE_AVAILABILITY' }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
          )
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const created: MenuItem = {
      id: `menu-${Date.now()}`,
      categoryId: `cat-${newItemCategory.toLowerCase()}`,
      categoryName: newItemCategory,
      name: newItemName.trim(),
      description: newItemDesc.trim() || 'Delicious royal recipe crafted with secret whole spices.',
      basePrice: Number(newItemPrice),
      foodType: 'VEGETARIAN',
      spiceLevel: 'MEDIUM',
      prepTimeMinutes: Number(newItemPrepTime),
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&fit=crop',
      isBestseller: false,
      isRecommended: true,
      isAvailable: true,
      stationName: newItemStation,
      allergens: ['Dairy'],
    };

    setItems((prev) => [created, ...prev]);
    setShowAddModal(false);
    setNewItemName('');
    setNewItemDesc('');
  };

  const categories = ['ALL', 'Starters', 'Main Course', 'Indian Breads', 'Rice & Biryani', 'Beverages', 'Desserts'];

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'ALL' && item.categoryName !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.stationName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#25364A]">Menu & Catalog Management</h1>
          <p className="text-xs text-gray-500">
            Control items, pricing snapshots, add-ons, spice levels & kitchen stations
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#E76F35] text-white text-xs font-bold rounded-xl hover:bg-[#D3551B] transition flex items-center space-x-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dish by name, station or description..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#E76F35]"
          />
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-[#25364A] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl p-4 border shadow-sm transition flex flex-col justify-between ${
              item.isAvailable ? 'border-gray-200' : 'border-red-200 bg-red-50/20'
            }`}
          >
            <div>
              <div className="flex gap-3 mb-3">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-gray-400">
                      {item.categoryName}
                    </span>
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {item.stationName}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#25364A] leading-snug mt-0.5">
                    {item.name}
                  </h3>
                  <span className="text-sm font-black text-[#E76F35] block mt-1">
                    {formatINR(item.basePrice)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              {/* Attributes */}
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-gray-400" /> ~{item.prepTimeMinutes} mins
                </span>
                <span>Spice: {item.spiceLevel}</span>
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">
                {item.isAvailable ? (
                  <span className="text-emerald-600 font-bold flex items-center">
                    <Check className="w-3.5 h-3.5 mr-1" /> In Stock
                  </span>
                ) : (
                  <span className="text-red-600 font-bold">Sold Out / 86ed</span>
                )}
              </span>

              <button
                onClick={() => handleToggleAvailability(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                  item.isAvailable
                    ? 'bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {item.isAvailable ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Mark Sold Out</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Restore Stock</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddItem}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-base font-bold text-[#25364A]">Add New Dish to Menu</h3>

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">
                Dish Name
              </label>
              <input
                type="text"
                required
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g. Malai Kofta Royal"
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">
                  Menu Category
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
                >
                  <option value="Main Course">Main Course</option>
                  <option value="Starters">Starters</option>
                  <option value="Indian Breads">Indian Breads</option>
                  <option value="Rice & Biryani">Rice & Biryani</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">
                  Kitchen Station
                </label>
                <select
                  value={newItemStation}
                  onChange={(e) => setNewItemStation(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
                >
                  <option value="Curry">Curry & Gravy</option>
                  <option value="Tandoor">Tandoor & Breads</option>
                  <option value="Chinese">Wok & Chinese</option>
                  <option value="Drinks">Bar & Beverages</option>
                  <option value="Dessert">Dessert Station</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">
                  Base Price (₹ INR)
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(Number(e.target.value))}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">
                  Target Prep Time (mins)
                </label>
                <input
                  type="number"
                  min={1}
                  value={newItemPrepTime}
                  onChange={(e) => setNewItemPrepTime(Number(e.target.value))}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">
                Dish Description
              </label>
              <textarea
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
                placeholder="Flavors, marination, and ingredients..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
              />
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
                Publish Dish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
