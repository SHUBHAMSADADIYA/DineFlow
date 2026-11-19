'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CustomerHeader } from '@/components/CustomerHeader';
import { formatINR } from '@/lib/utils';
import {
  ArrowLeft,
  Receipt,
  Users,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function CustomerBillPage({
  params,
}: {
  params: { restaurantSlug: string; branchSlug: string; tableId: string };
}) {
  const router = useRouter();
  const { restaurantSlug, branchSlug, tableId } = params;
  const tableNumber = tableId.toUpperCase();
  const basePath = `/menu/${restaurantSlug}/${branchSlug}/${tableNumber}`;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [splitMode, setSplitMode] = useState<'FULL' | 'EQUAL' | 'CUSTOM'>('FULL');
  const [splitCount, setSplitCount] = useState(2);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'UPI' | 'CARD' | 'CASH'>('UPI');
  const [paying, setPaying] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/orders?table=${tableNumber}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        }
      })
      .finally(() => setLoading(false));
  }, [tableNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E76F35] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] p-6 text-center">
        <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-gray-700">No active bill for Table {tableNumber}</h3>
        <p className="text-xs text-gray-400 mt-1">Place an order first to generate a bill.</p>
        <Link href={basePath} className="mt-4 inline-block text-xs font-bold text-[#E76F35]">
          Browse Menu
        </Link>
      </div>
    );
  }

  const totalAmount = order.finalAmount;
  const splitAmount = splitMode === 'EQUAL' ? Math.round((totalAmount / splitCount) * 100) / 100 : totalAmount;

  const handlePay = async () => {
    setPaying(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PAY_BILL',
          paymentMethod: selectedPaymentMethod,
          amountPaid: splitAmount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPaidSuccess(true);
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        setTimeout(() => {
          router.push(`${basePath}/receipt/${order.orderNumber}`);
        }, 2200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPaying(false);
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
          href={`${basePath}/track/${order.orderNumber}`}
          className="inline-flex items-center space-x-1 text-xs font-bold text-gray-500 hover:text-[#E76F35] mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Tracking</span>
        </Link>

        {paidSuccess ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 shadow-xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black text-[#25364A]">Payment Verified!</h2>
            <p className="text-xs text-gray-500 mt-1 mb-2">
              Transaction of {formatINR(splitAmount)} completed via {selectedPaymentMethod}.
            </p>
            <p className="text-xs font-bold text-[#E76F35]">
              ⭐ You earned {Math.floor((splitAmount / 100) * 5)} Zaika Loyalty Points!
            </p>
            <p className="text-[11px] text-gray-400 mt-4">Generating official tax invoice...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bill Title & Details */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Tax Invoice</span>
                  <h2 className="text-base font-black text-[#25364A]">Table #{tableNumber} Bill</h2>
                  <p className="text-[11px] text-gray-500">Order #{order.orderNumber}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-400">Total Payable</span>
                  <p className="text-xl font-black text-[#E76F35]">{formatINR(totalAmount)}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100 text-xs text-gray-700">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#25364A] mr-2">{item.quantity}x</span>
                      <span>{item.name}</span>
                    </div>
                    <span className="font-bold">{formatINR(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              {/* Tax & GST Breakdown */}
              <div className="pt-3 mt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatINR(order.subtotal)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount Applied</span>
                    <span>-{formatINR(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Central GST (CGST 2.5%)</span>
                  <span>{formatINR(order.cgstAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>State GST (SGST 2.5%)</span>
                  <span>{formatINR(order.sgstAmount)}</span>
                </div>
                {order.tipAmount > 0 && (
                  <div className="flex justify-between text-pink-600 font-semibold">
                    <span>Waiter Tip</span>
                    <span>{formatINR(order.tipAmount)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Split Bill Feature (Section 7.2) */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2 flex items-center">
                <Users className="w-3.5 h-3.5 mr-1 text-[#25364A]" />
                <span>Split Bill Options</span>
              </label>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => setSplitMode('FULL')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                    splitMode === 'FULL'
                      ? 'border-[#E76F35] bg-orange-50 text-[#E76F35]'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  Pay Full Bill ({formatINR(totalAmount)})
                </button>
                <button
                  onClick={() => setSplitMode('EQUAL')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                    splitMode === 'EQUAL'
                      ? 'border-[#E76F35] bg-orange-50 text-[#E76F35]'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  Split Equally
                </button>
              </div>

              {splitMode === 'EQUAL' && (
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-gray-600">Guests Splitting:</span>
                    <div className="flex items-center space-x-1">
                      {[2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() => setSplitCount(num)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold border transition ${
                            splitCount === num
                              ? 'bg-[#E76F35] border-[#E76F35] text-white'
                              : 'bg-white border-gray-200 text-gray-600'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block font-semibold">Your Share</span>
                    <span className="text-sm font-black text-[#E76F35]">
                      {formatINR(splitAmount)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selector (Section 7.3) */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-3">
                Select Indian Payment Method
              </label>

              <div className="space-y-2">
                {/* Instant UPI */}
                <button
                  onClick={() => setSelectedPaymentMethod('UPI')}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between transition ${
                    selectedPaymentMethod === 'UPI'
                      ? 'border-[#E76F35] bg-orange-50/40 text-[#25364A]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#E76F35] flex items-center justify-center">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold">Instant UPI (Zero Fee)</p>
                      <p className="text-[10px] text-gray-400">GPay &bull; PhonePe &bull; Paytm &bull; BHIM</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Fastest
                  </span>
                </button>

                {/* Credit / Debit Card */}
                <button
                  onClick={() => setSelectedPaymentMethod('CARD')}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between transition ${
                    selectedPaymentMethod === 'CARD'
                      ? 'border-[#E76F35] bg-orange-50/40 text-[#25364A]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#25364A] flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold">Credit / Debit Card</p>
                      <p className="text-[10px] text-gray-400">Visa, Mastercard, RuPay</p>
                    </div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-gray-400" />
                </button>

                {/* Cash to Waiter */}
                <button
                  onClick={() => setSelectedPaymentMethod('CASH')}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between transition ${
                    selectedPaymentMethod === 'CASH'
                      ? 'border-[#E76F35] bg-orange-50/40 text-[#25364A]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 text-[#1D9B68] flex items-center justify-center">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold">Pay Cash to Floor Steward</p>
                      <p className="text-[10px] text-gray-400">Cashier collects bill at table</p>
                    </div>
                  </div>
                </button>
              </div>

              {selectedPaymentMethod === 'UPI' && (
                <div className="mt-4 p-4 rounded-xl bg-orange-50/60 border border-orange-200 text-center">
                  <div className="w-32 h-32 bg-white rounded-xl mx-auto p-2 border border-orange-200 flex items-center justify-center shadow-sm">
                    {/* Simulated UPI QR Graphic */}
                    <div className="text-center">
                      <QrCode className="w-20 h-20 text-[#25364A] mx-auto" />
                      <span className="text-[9px] font-bold text-gray-500">Scan via Any UPI App</span>
                    </div>
                  </div>
                  <p className="text-[11px] font-mono font-bold text-[#25364A] mt-2">
                    UPI ID: zaika.restaurant@icici
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Click &apos;Complete Payment&apos; to simulate successful instant webhook callback.
                  </p>
                </div>
              )}
            </div>

            {/* Pay Now Button */}
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full py-4 bg-[#E76F35] hover:bg-[#D3551B] disabled:opacity-50 text-white rounded-2xl font-black text-sm shadow-xl flex items-center justify-between px-5 transition"
            >
              <span>{paying ? 'Verifying with Gateway...' : `Complete Payment (${selectedPaymentMethod})`}</span>
              <span>{formatINR(splitAmount)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
