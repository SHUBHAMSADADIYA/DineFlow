'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import { CustomerHeader } from '@/components/CustomerHeader';
import { formatINR } from '@/lib/utils';
import {
  Download,
  Star,
  CheckCircle2,
  Utensils,
  Receipt,
  Sparkles,
  ArrowRight,
  Share2,
} from 'lucide-react';

export default function CustomerReceiptPage({
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
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [submittedReview, setSubmittedReview] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrder(data.order);
      });
  }, [orderId]);

  const handleDownloadPDF = () => {
    if (!order) return;

    const doc = new jsPDF();
    doc.setFont('helvetica');

    // Header
    doc.setFontSize(18);
    doc.setTextColor(37, 54, 74);
    doc.text('ZAIKA RESTAURANT & BAR', 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Titanium City Center, Prahlad Nagar, Ahmedabad', 20, 26);
    doc.text('GSTIN: 24AAACZ1234F1Z5 | FSSAI: 10723001000452', 20, 31);
    doc.text('Phone: +91 95899 54890', 20, 36);

    doc.setDrawColor(230, 230, 230);
    doc.line(20, 42, 190, 42);

    // Invoice details
    doc.setFontSize(12);
    doc.setTextColor(37, 54, 74);
    doc.text(`TAX INVOICE: #${order.orderNumber}`, 20, 50);
    doc.text(`Table: ${tableNumber}`, 150, 50);

    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 20, 56);
    doc.text(`Payment: ${order.paymentMethod || 'UPI'} (PAID)`, 150, 56);

    // Items table header
    doc.line(20, 62, 190, 62);
    doc.setFontSize(10);
    doc.setTextColor(37, 54, 74);
    doc.text('Item Description', 20, 68);
    doc.text('Qty', 130, 68);
    doc.text('Amount (INR)', 160, 68);
    doc.line(20, 72, 190, 72);

    let y = 78;
    order.items.forEach((item: any) => {
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(`${item.name}`, 20, y);
      doc.text(`${item.quantity}`, 133, y);
      doc.text(`Rs. ${item.totalPrice}`, 160, y);
      y += 6;
    });

    doc.line(20, y + 2, 190, y + 2);
    y += 8;

    // Totals
    doc.setFontSize(9);
    doc.text('Subtotal:', 120, y);
    doc.text(`Rs. ${order.subtotal}`, 160, y);
    y += 5;

    if (order.discountAmount > 0) {
      doc.text('Discount:', 120, y);
      doc.text(`-Rs. ${order.discountAmount}`, 160, y);
      y += 5;
    }

    doc.text('CGST (2.5%):', 120, y);
    doc.text(`Rs. ${order.cgstAmount}`, 160, y);
    y += 5;

    doc.text('SGST (2.5%):', 120, y);
    doc.text(`Rs. ${order.sgstAmount}`, 160, y);
    y += 5;

    if (order.tipAmount > 0) {
      doc.text('Tip:', 120, y);
      doc.text(`Rs. ${order.tipAmount}`, 160, y);
      y += 5;
    }

    doc.setFontSize(11);
    doc.setTextColor(231, 111, 53);
    doc.text('Total Paid:', 120, y + 2);
    doc.text(`Rs. ${order.finalAmount}`, 160, y + 2);

    y += 20;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for dining with us! Powered by DineFlow Restaurant OS', 20, y);

    doc.save(`Zaika_Receipt_${order.orderNumber}.pdf`);
  };

  const handleSubmitReview = async () => {
    if (!order) return;
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          customerName: order.customerName || 'Verified Diner',
          rating,
          foodRating,
          serviceRating,
          ambianceRating: rating,
          comment,
        }),
      });
      setSubmittedReview(true);
    } catch (e) {
      console.error(e);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E76F35] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
        {/* Invoice Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md mb-5">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Official Receipt &bull; Paid
              </span>
              <h2 className="text-xl font-black text-[#25364A] mt-1">
                Zaika Restaurant & Bar
              </h2>
              <p className="text-[11px] text-gray-500">
                GSTIN: 24AAACZ1234F1Z5 &bull; FSSAI: 10723001000452
              </p>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="p-3 bg-orange-50 hover:bg-orange-100 text-[#E76F35] rounded-xl font-bold text-xs flex items-center space-x-1 transition shadow-sm"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF Receipt</span>
            </button>
          </div>

          <div className="py-4 border-b border-gray-100 grid grid-cols-2 text-xs text-gray-500">
            <div>
              <p>Invoice: <strong className="text-gray-800">#{order.orderNumber}</strong></p>
              <p>Table: <strong className="text-gray-800">{tableNumber}</strong></p>
            </div>
            <div className="text-right">
              <p>Date: <strong className="text-gray-800">{new Date().toLocaleDateString('en-IN')}</strong></p>
              <p>Method: <strong className="text-gray-800">{order.paymentMethod || 'UPI'}</strong></p>
            </div>
          </div>

          {/* Items */}
          <div className="py-4 border-b border-gray-100 text-xs space-y-2">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between">
                <span>{item.quantity}x {item.name}</span>
                <span className="font-bold text-gray-800">{formatINR(item.totalPrice)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-4 space-y-1.5 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatINR(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount</span>
                <span>-{formatINR(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>CGST (2.5%)</span>
              <span>{formatINR(order.cgstAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (2.5%)</span>
              <span>{formatINR(order.sgstAmount)}</span>
            </div>
            {order.tipAmount > 0 && (
              <div className="flex justify-between text-pink-600">
                <span>Tip</span>
                <span>{formatINR(order.tipAmount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-100 flex justify-between text-base font-black text-[#25364A]">
              <span>Amount Paid</span>
              <span className="text-[#E76F35]">{formatINR(order.finalAmount)}</span>
            </div>
          </div>
        </div>

        {/* 5-Star Feedback Form */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md">
          {submittedReview ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-[#25364A]">Thank You for Your Feedback!</h3>
              <p className="text-xs text-gray-500 mt-1">
                Your review has been shared directly with our head chef and management.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <span className="text-[10px] uppercase font-bold text-[#E76F35]">
                  How Was Your Experience?
                </span>
                <h3 className="text-base font-bold text-[#25364A]">Rate Your Meal at Zaika</h3>
              </div>

              {/* Star Rating */}
              <div className="flex items-center justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRating(s)}
                    className="p-1 transition hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        s <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Sub-ratings */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-500 block mb-1">Food Taste</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setFoodRating(s)}>
                        <Star className={`w-4 h-4 ${s <= foodRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-500 block mb-1">Service Speed</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setServiceRating(s)}>
                        <Star className={`w-4 h-4 ${s <= serviceRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment text */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you love most? (e.g. Paneer Makhani was super smooth!)"
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 mb-4 focus:outline-none focus:border-[#E76F35]"
              />

              <button
                onClick={handleSubmitReview}
                className="w-full py-3 bg-[#E76F35] hover:bg-[#D3551B] text-white text-xs font-bold rounded-xl shadow transition"
              >
                Submit Feedback
              </button>
            </>
          )}
        </div>

        {/* Back to Home Button */}
        <div className="mt-5 text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-[#25364A]"
          >
            <span>Return to DineFlow Home</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
