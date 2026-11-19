'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  Printer,
  Sparkles,
  ExternalLink,
  UtensilsCrossed,
  Wifi,
} from 'lucide-react';
import { INITIAL_TABLES } from '@/lib/seed-data';

export default function AdminQRCodesPage() {
  const [qrImages, setQrImages] = useState<{ [tableNumber: string]: string }>({});
  const [selectedTable, setSelectedTable] = useState('T05');

  const tables = INITIAL_TABLES;

  useEffect(() => {
    // Generate QR code data URLs for each table
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dineflow.vercel.app';
    tables.forEach(async (table) => {
      const url = `${origin}/menu/zaika/ahmedabad/${table.tableNumber}`;
      try {
        const dataUrl = await QRCode.toDataURL(url, {
          width: 320,
          margin: 2,
          color: {
            dark: '#25364A',
            light: '#FFFFFF',
          },
        });
        setQrImages((prev) => ({ ...prev, [table.tableNumber]: dataUrl }));
      } catch (err) {
        console.error(err);
      }
    });
  }, []);

  const downloadQR = (tableNum: string) => {
    const dataUrl = qrImages[tableNum];
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Zaika_Standee_QR_${tableNum}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#25364A]">Table QR Standee Generator</h1>
          <p className="text-xs text-gray-500">
            Export ready-to-print acrylic standees for your dining tables
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-[#25364A] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition flex items-center space-x-1.5 shadow"
        >
          <Printer className="w-4 h-4" />
          <span>Print All Standees</span>
        </button>
      </div>

      {/* Main Preview Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Standee Live Preview (Print Layout) */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Acrylic Standee Live Preview (Table {selectedTable})
            </span>

            {/* Standee Design Card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-orange-200 shadow-xl text-center relative overflow-hidden">
              <div className="w-full h-2 bg-gradient-to-r from-[#E76F35] to-[#EE8E47] absolute top-0 inset-x-0" />

              {/* Restaurant Branding */}
              <div className="flex items-center justify-center space-x-2 mt-2 mb-1">
                <UtensilsCrossed className="w-5 h-5 text-[#E76F35]" />
                <h3 className="font-black text-lg text-[#25364A]">ZAIKA</h3>
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Restaurant &bull; Bar &bull; Lounge
              </p>

              {/* Table Pill */}
              <div className="mt-4 inline-block bg-[#25364A] text-white px-4 py-1.5 rounded-full text-xs font-black shadow">
                TABLE {selectedTable}
              </div>

              {/* QR Image */}
              <div className="my-5 p-3 bg-orange-50/50 rounded-2xl border border-orange-100 inline-block">
                {qrImages[selectedTable] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrImages[selectedTable]}
                    alt={`QR Code Table ${selectedTable}`}
                    className="w-48 h-48 rounded-xl object-contain shadow-sm mx-auto"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                    Generating QR...
                  </div>
                )}
              </div>

              {/* Instructions */}
              <p className="text-xs font-bold text-[#25364A]">
                Scan with Camera to Order
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                No mobile app download needed!
              </p>

              {/* WiFi helper on standee */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center space-x-2 text-[10px] text-gray-400">
                <Wifi className="w-3.5 h-3.5 text-gray-400" />
                <span>WiFi: Zaika_Guest_WiFi_5G &bull; Pass: zaikadelicious</span>
              </div>
            </div>

            <button
              onClick={() => downloadQR(selectedTable)}
              className="mt-4 w-full py-2.5 bg-[#E76F35] text-white text-xs font-bold rounded-xl hover:bg-[#D3551B] transition shadow flex items-center justify-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG for Table {selectedTable}</span>
            </button>
          </div>
        </div>

        {/* All Tables QR Grid */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
            Select Table to Preview & Export
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tables.map((table) => {
              const isSelected = selectedTable === table.tableNumber;
              return (
                <div
                  key={table.id}
                  onClick={() => setSelectedTable(table.tableNumber)}
                  className={`bg-white rounded-2xl p-4 border cursor-pointer transition shadow-sm hover:shadow-md flex items-center justify-between ${
                    isSelected
                      ? 'border-[#E76F35] ring-2 ring-orange-200'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {qrImages[table.tableNumber] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={qrImages[table.tableNumber]}
                        alt={table.tableNumber}
                        className="w-16 h-16 rounded-lg border border-gray-100"
                      />
                    )}
                    <div>
                      <h4 className="font-black text-sm text-[#25364A]">
                        Table {table.tableNumber}
                      </h4>
                      <p className="text-[11px] text-gray-400">{table.section}</p>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        Permanent Bound
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadQR(table.tableNumber);
                      }}
                      className="p-2 text-gray-500 hover:text-[#E76F35] hover:bg-orange-50 rounded-lg transition"
                      title="Download PNG"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/menu/zaika/ahmedabad/${table.tableNumber}`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Test URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
