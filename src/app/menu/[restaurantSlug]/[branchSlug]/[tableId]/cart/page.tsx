'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CustomerHeader } from '@/components/CustomerHeader';
import { formatINR, calculateOrderBreakdown } from '@/lib/utils';
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Tag,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';

export default function CustomerCartPage({
  params,
}: {
  params: { restaurantSlug: string; branchSlug: string; tableId: string };
}) {
  const router = useRouter();
  const { restaurantSlug, branchSlug, tableId } = params;
  const tableNumber = tableId.toUpperCase();

  const [cart, setCart] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [tipAmount, setTipAmount] = useState(0);
  const [specialNotes, setSpecialNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const basePath = `/menu/${restaurantSlug}/${branchSlug}/${tableNumber}`;

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(`cart_${tableNumber}`);
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {}
  }, [tableNumber]);

  const updateCartState = (newCart: any[]) => {
    setCart(newCart);
    try {
      sessionStorage.setItem(`cart_${tableNumber}`, JSON.stringify(newCart));
    } catch (e) {}
  };

  const updateItemQty = (index: number, delta: number) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
      updated[index].totalPrice = updated[index].unitPrice * newQty;
    }
    updateCartState(updated);
  };

  const removeItem = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    updateCartState(updated);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME100') {
      if (subtotal < 300) {
        setErrorMsg('Minimum order ₹300 required for WELCOME100');
        return;
      }
      setDiscountAmount(100);
      setAppliedCoupon('WELCOME100');
      setErrorMsg('');
    } else if (code === 'ZAIKA50') {
      setDiscountAmount(50);
      setAppliedCoupon('ZAIKA50');
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid promo code. Try WELCOME100 or ZAIKA50');
    }
  };

  const removeCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const { cgst, sgst, total } = calculateOrderBreakdown(
    subtotal,
    discountAmount,
    tipAmount,
    2.5,
    2.5
  );

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber,
          customerName: customerName.trim() || 'Valued Guest',
          customerPhone: customerPhone.trim() || '',
          items: cart,
          subtotal,
          discountAmount,
          couponCode: appliedCoupon || undefined,
          tipAmount,
          specialNotes: specialNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        // Clear cart
        sessionStorage.removeItem(`cart_${tableNumber}`);
        // Navigate to track order
        router.push(`${basePath}/track/${data.order.orderNumber}`);
      } else {
        setErrorMsg(data.error || 'Failed to place order. Please try again.');
        setSubmitting(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while placing order');
      setSubmitting(false);
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

      <div className="max-w-2xl mx-auto px-4 pt-4">
        {/* Back Link */}
        <Link
          href={basePath}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-[#E76F35] mb-3 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-[#25364A]">Your Table Order</h2>
            <p className="text-xs text-gray-500">Table {tableNumber} &bull; Dine-in</p>
          </div>
          <span className="text-xs font-bold bg-orange-100 text-[#E76F35] px-2.5 py-1 rounded-lg">
            {cart.length} {cart.length === 1 ? 'Dish' : 'Dishes'}
          </span>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-200">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#E76F35] flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#25364A]">Your cart is empty</h3>
            <p className="text-xs text-gray-400 mt-1 mb-5">
              Explore our chef&apos;s specials and add delicious delicacies.
            </p>
            <Link
              href={basePath}
              className="inline-block px-5 py-2.5 bg-[#E76F35] text-white text-xs font-bold rounded-xl shadow hover:bg-[#D3551B] transition"
            >
              Browse Digital Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart Items List */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 divide-y divide-gray-100">
              {cart.map((item, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#25364A]">{item.name}</span>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase bg-gray-50 px-1.5 py-0.5 rounded">
                        {item.stationName}
                      </span>
                    </div>

                    {/* Modifiers info */}
                    <div className="text-[11px] text-gray-500 mt-1 space-y-0.5">
                      {item.modifiers?.spiceLevel && (
                        <p>Spice: {item.modifiers.spiceLevel}</p>
                      )}
                      {item.modifiers?.addons && item.modifiers.addons.length > 0 && (
                        <p>Addons: {item.modifiers.addons.map((a: any) => a.name).join(', ')}</p>
                      )}
                      {item.modifiers?.specialInstructions && (
                        <p className="italic text-orange-600 font-medium">
                          &ldquo;{item.modifiers.specialInstructions}&rdquo;
                        </p>
                      )}
                    </div>

                    <p className="text-xs font-extrabold text-[#E76F35] mt-1.5">
                      {formatINR(item.totalPrice)}
                    </p>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center space-x-1.5 border border-gray-200 rounded-xl p-1 bg-gray-50">
                    <button
                      onClick={() => updateItemQty(idx, -1)}
                      className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                      {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3" />}
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-[#25364A]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItemQty(idx, 1)}
                      className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Guest Details for Rewards */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                Diner Details (Earn Loyalty Points)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
                />
                <input
                  type="tel"
                  placeholder="Phone No (e.g. 9876543210)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Enter mobile number to automatically collect 5 points for every ₹100 spent!
              </p>
            </div>

            {/* Promo Code / Coupon */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2 flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1 text-[#E76F35]" />
                <span>Apply Offer Coupon</span>
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs">
                  <span className="font-bold text-emerald-800">
                    &apos;{appliedCoupon}&apos; Applied (-{formatINR(discountAmount)})
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter WELCOME100 or ZAIKA50"
                    className="flex-1 text-xs p-2.5 rounded-xl border border-gray-200 uppercase focus:outline-none focus:border-[#E76F35]"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2.5 bg-[#25364A] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Tip Option */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2 flex items-center">
                <HeartHandshake className="w-3.5 h-3.5 mr-1 text-pink-500" />
                <span>Tip the Waiter & Kitchen Crew</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 30, 50, 100].map((tip) => (
                  <button
                    key={tip}
                    onClick={() => setTipAmount(tip)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      tipAmount === tip
                        ? 'bg-pink-50 border-pink-500 text-pink-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tip === 0 ? 'Skip' : `₹${tip}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Instructions for Order */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                Order Notes for Kitchen
              </label>
              <textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Any dietary restrictions, serve drinks first, etc..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
              />
            </div>

            {/* Order Price Breakdown */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#25364A]">{formatINR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Central GST (CGST 2.5%)</span>
                <span>{formatINR(cgst)}</span>
              </div>
              <div className="flex justify-between">
                <span>State GST (SGST 2.5%)</span>
                <span>{formatINR(sgst)}</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between text-pink-600">
                  <span>Crew Tip</span>
                  <span>{formatINR(tipAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-black text-[#25364A]">
                <span>Total Payable</span>
                <span className="text-[#E76F35]">{formatINR(total)}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="w-full py-3.5 bg-[#E76F35] hover:bg-[#D3551B] disabled:opacity-50 text-white rounded-2xl font-black text-sm shadow-lg flex items-center justify-between px-5 transition"
            >
              <span>{submitting ? 'Routing to Kitchen...' : 'Send Order to Kitchen'}</span>
              <span>{formatINR(total)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
