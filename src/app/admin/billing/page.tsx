'use client';

import { useState } from 'react';
import {
  Receipt,
  Download,
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { INITIAL_ORDERS } from '@/lib/seed-data';

export default function AdminBillingPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const totalGross = orders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDiscounts = orders.reduce((sum, o) => sum + o.discountAmount, 0);
  const totalCGST = orders.reduce((sum, o) => sum + o.cgstAmount, 0);
  const totalSGST = orders.reduce((sum, o) => sum + o.sgstAmount, 0);
  const totalTips = orders.reduce((sum, o) => sum + o.tipAmount, 0);
  const totalNet = orders.reduce((sum, o) => sum + o.finalAmount, 0);

  const handleExportCSV = () => {
    const headers = ['OrderNumber', 'Table', 'Customer', 'Subtotal', 'Discount', 'CGST', 'SGST', 'Tip', 'Total', 'PaymentStatus'];
    const rows = orders.map((o) => [
      o.orderNumber,
      o.tableNumber,
      o.customerName || 'Guest',
      o.subtotal,
      o.discountAmount,
      o.cgstAmount,
      o.sgstAmount,
      o.tipAmount,
      o.finalAmount,
      o.paymentStatus,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Zaika_GST_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#25364A]">Billing & Tax Reports</h1>
          <p className="text-xs text-gray-500">
            GST compliant sales registers, CGST/SGST tax liabilities & settlement records
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition flex items-center space-x-1.5 shadow"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export GST Register (CSV)</span>
        </button>
      </div>

      {/* Tax Breakdown Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Gross Items</span>
          <span className="text-base font-black text-[#25364A]">{formatINR(totalGross)}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Discounts</span>
          <span className="text-base font-black text-emerald-600">-{formatINR(totalDiscounts)}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">CGST (2.5%)</span>
          <span className="text-base font-black text-gray-700">{formatINR(totalCGST)}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">SGST (2.5%)</span>
          <span className="text-base font-black text-gray-700">{formatINR(totalSGST)}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Waiter Tips</span>
          <span className="text-base font-black text-pink-600">{formatINR(totalTips)}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border-2 border-orange-200 bg-orange-50/20">
          <span className="text-[10px] uppercase font-bold text-[#E76F35] block">Net Collected</span>
          <span className="text-base font-black text-[#E76F35]">{formatINR(totalNet)}</span>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
            Recent Tax Invoices & Settlement
          </h3>
          <span className="text-xs text-gray-400">GSTIN: 24AAACZ1234F1Z5</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#F7F8FA] text-gray-400 uppercase text-[10px] font-bold border-b border-gray-100">
              <tr>
                <th className="p-3.5 pl-5">Invoice #</th>
                <th className="p-3.5">Table</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Taxable Subtotal</th>
                <th className="p-3.5">Total GST (5%)</th>
                <th className="p-3.5">Final Amount</th>
                <th className="p-3.5 text-right pr-5">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-3.5 pl-5 font-black text-[#25364A]">
                    INV-{o.orderNumber}
                  </td>
                  <td className="p-3.5 font-bold text-gray-700">
                    {o.tableNumber}
                  </td>
                  <td className="p-3.5 text-gray-600">
                    {o.customerName || 'Walk-in'}
                  </td>
                  <td className="p-3.5 font-semibold">
                    {formatINR(o.subtotal - o.discountAmount)}
                  </td>
                  <td className="p-3.5 text-gray-500">
                    {formatINR(o.cgstAmount + o.sgstAmount)}
                  </td>
                  <td className="p-3.5 font-black text-[#E76F35]">
                    {formatINR(o.finalAmount)}
                  </td>
                  <td className="p-3.5 text-right pr-5">
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                      PAID (UPI)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
