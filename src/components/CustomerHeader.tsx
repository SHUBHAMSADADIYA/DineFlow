'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wifi, Bell, Award, Sparkles, Check, Copy } from 'lucide-react';
import { AssistanceModal } from './AssistanceModal';

interface CustomerHeaderProps {
  restaurantName: string;
  tableNumber: string;
  restaurantSlug: string;
  branchSlug: string;
  wifiSsid?: string;
  wifiPassword?: string;
}

export function CustomerHeader({
  restaurantName,
  tableNumber,
  restaurantSlug,
  branchSlug,
  wifiSsid = 'Zaika_Guest_WiFi_5G',
  wifiPassword = 'zaikadelicious',
}: CustomerHeaderProps) {
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [showAssistanceModal, setShowAssistanceModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyWifi = () => {
    navigator.clipboard.writeText(wifiPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const basePath = `/menu/${restaurantSlug}/${branchSlug}/${tableNumber}`;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E76F35] to-[#EE8E47] flex items-center justify-center text-white font-black text-sm shadow">
              {tableNumber}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-sm text-[#25364A] leading-tight">
                  {restaurantName}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Table {tableNumber}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">Ahmedabad Outlet &bull; Dine-in</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* WiFi Button */}
            <button
              onClick={() => setShowWifiModal(true)}
              className="p-2 rounded-full text-gray-600 hover:text-[#E76F35] hover:bg-orange-50 transition"
              title="Restaurant WiFi"
            >
              <Wifi className="w-4 h-4" />
            </button>

            {/* Spice Quiz Link */}
            <Link
              href={`${basePath}/quiz`}
              className="p-2 rounded-full text-gray-600 hover:text-amber-500 hover:bg-amber-50 transition"
              title="Spice Quiz Game"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
            </Link>

            {/* Loyalty Wallet Link */}
            <Link
              href={`${basePath}/loyalty`}
              className="p-2 rounded-full text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition"
              title="Loyalty Points"
            >
              <Award className="w-4 h-4" />
            </Link>

            {/* Call Waiter */}
            <button
              onClick={() => setShowAssistanceModal(true)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#E76F35] text-white text-xs font-semibold shadow hover:bg-[#D3551B] transition"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Call Staff</span>
            </button>
          </div>
        </div>
      </header>

      {/* WiFi Modal */}
      {showWifiModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Wifi className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#25364A]">Complimentary Guest WiFi</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Connect to high-speed internet while dining at Zaika.
            </p>

            <div className="bg-gray-50 p-4 rounded-xl text-left border border-gray-100 mb-6 space-y-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Network (SSID)</span>
                <p className="text-sm font-semibold text-[#25364A]">{wifiSsid}</p>
              </div>
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Password</span>
                  <p className="text-sm font-mono font-bold text-[#25364A]">{wifiPassword}</p>
                </div>
                <button
                  onClick={copyWifi}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-white border border-gray-200 text-gray-700 flex items-center space-x-1 hover:bg-gray-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowWifiModal(false)}
              className="w-full py-2.5 bg-[#25364A] text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Assistance Modal */}
      <AssistanceModal
        isOpen={showAssistanceModal}
        onClose={() => setShowAssistanceModal(false)}
        tableNumber={tableNumber}
      />
    </>
  );
}
