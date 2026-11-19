'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CustomerHeader } from '@/components/CustomerHeader';
import { ItemCustomizerModal } from '@/components/ItemCustomizerModal';
import { MenuItem } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import {
  Search,
  Flame,
  ShoppingBag,
  Sparkles,
  Clock,
  ChevronRight,
  Plus,
  AlertCircle,
} from 'lucide-react';

interface CartItem {
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  modifiers: any;
  totalPrice: number;
  stationName: string;
}

export default function CustomerMenuPage({
  params,
}: {
  params: { restaurantSlug: string; branchSlug: string; tableId: string };
}) {
  const { restaurantSlug, branchSlug, tableId } = params;
  const tableNumber = tableId.toUpperCase();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedItemForCustomization, setSelectedItemForCustomization] = useState<MenuItem | null>(null);

  // Cart state persisted in sessionStorage
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<any>(null);

  useEffect(() => {
    // Load Menu
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setMenuItems(data.items);
      });

    // Check if table has an active order
    fetch(`/api/orders?table=${tableNumber}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) setActiveOrder(data.order);
      });

    // Restore cart from session
    try {
      const savedCart = sessionStorage.getItem(`cart_${tableNumber}`);
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {}
  }, [tableNumber]);

  const handleAddToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const updated = [...prev, newItem];
      try {
        sessionStorage.setItem(`cart_${tableNumber}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const categories = [
    { id: 'ALL', label: 'All Items' },
    { id: 'Starters', label: 'Starters' },
    { id: 'Main Course', label: 'Main Course' },
    { id: 'Indian Breads', label: 'Tandoori Breads' },
    { id: 'Rice & Biryani', label: 'Rice & Biryani' },
    { id: 'Beverages', label: 'Drinks & Lassi' },
    { id: 'Desserts', label: 'Desserts' },
  ];

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== 'ALL' && item.categoryName !== selectedCategory) {
      return false;
    }
    if (vegOnly && item.foodType !== 'VEGETARIAN') {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.categoryName.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const basePath = `/menu/${restaurantSlug}/${branchSlug}/${tableNumber}`;

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-28">
      {/* Customer Header */}
      <CustomerHeader
        restaurantName="Zaika Restaurant & Bar"
        tableNumber={tableNumber}
        restaurantSlug={restaurantSlug}
        branchSlug={branchSlug}
      />

      {/* Active Order Banner if order in progress */}
      {activeOrder && (
        <div className="bg-gradient-to-r from-[#25364A] to-[#1C2A3A] text-white p-3 shadow-sm">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <p className="text-xs font-bold leading-tight">
                  Active Order #{activeOrder.orderNumber}: {activeOrder.status}
                </p>
                <p className="text-[11px] text-gray-300">
                  {activeOrder.status === 'PREPARING'
                    ? `Estimated ~${activeOrder.estimatedMinutesRemaining} mins`
                    : 'Dishes served to your table'}
                </p>
              </div>
            </div>
            <Link
              href={`${basePath}/track/${activeOrder.orderNumber}`}
              className="text-xs bg-[#E76F35] hover:bg-[#D3551B] px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1 transition shadow"
            >
              <span>Track Live</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <div className="bg-gradient-to-br from-[#E76F35] to-[#EE8E47] rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-1 bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Table Ordering Activated</span>
            </div>
            <h2 className="text-xl font-black">Welcome to Zaika</h2>
            <p className="text-xs text-orange-100 mt-1 max-w-sm">
              Freshly cooked royal dishes delivered right to your table. Add dishes anytime!
            </p>
          </div>
        </div>

        {/* Search & Veg Filter */}
        <div className="mt-4 flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, breads, biryani, drinks..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#E76F35] shadow-sm"
            />
          </div>

          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition ${
              vegOnly
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
            <span>Veg Only</span>
          </button>
        </div>

        {/* Horizontal Category Scroller */}
        <div className="mt-3 overflow-x-auto no-scrollbar flex space-x-2 py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-[#25364A] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="mt-4 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">No dishes match your filter</p>
              <p className="text-xs text-gray-400 mt-1">Try resetting search or filters</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 border border-gray-200/80 shadow-sm hover:shadow-md transition flex gap-3.5"
              >
                {/* Food Image */}
                <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  {item.isBestseller && (
                    <span className="absolute top-1.5 left-1.5 bg-[#E76F35] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                      BESTSELLER
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          item.foodType === 'VEGETARIAN' ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                        title={item.foodType}
                      />
                      <span className="text-[10px] uppercase font-bold text-gray-400">
                        {item.categoryName}
                      </span>
                      {item.spiceLevel === 'HOT' && (
                        <Flame className="w-3.5 h-3.5 text-orange-500" />
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-[#25364A] mt-0.5 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-normal">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-sm font-black text-[#25364A]">
                        {formatINR(item.basePrice)}
                      </span>
                      <span className="text-[10px] text-gray-400 block flex items-center">
                        <Clock className="w-2.5 h-2.5 mr-0.5 inline" /> ~{item.prepTimeMinutes}m
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedItemForCustomization(item)}
                      className="px-3.5 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-[#E76F35] hover:bg-[#E76F35] hover:text-white text-xs font-bold flex items-center space-x-1 transition shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-3 inset-x-0 z-40 px-4 max-w-lg mx-auto">
          <Link
            href={`${basePath}/cart`}
            className="w-full bg-[#E76F35] hover:bg-[#D3551B] text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between transition animate-in slide-in-from-bottom-2"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">
                  {cartItemCount} {cartItemCount === 1 ? 'dish' : 'dishes'} selected
                </p>
                <p className="text-[11px] text-orange-100">
                  Total: {formatINR(cartTotal)} + taxes
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 font-bold text-xs bg-white text-[#E76F35] px-3.5 py-2 rounded-xl shadow-sm">
              <span>View Cart</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      )}

      {/* Item Customizer Modal */}
      <ItemCustomizerModal
        item={selectedItemForCustomization}
        isOpen={!!selectedItemForCustomization}
        onClose={() => setSelectedItemForCustomization(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
