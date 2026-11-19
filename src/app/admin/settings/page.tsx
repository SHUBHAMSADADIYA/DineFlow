'use client';

import { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Building,
  CreditCard,
  Percent,
  Wifi,
  Sparkles,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  // Form states
  const [name, setName] = useState('Zaika Restaurant & Bar');
  const [phone, setPhone] = useState('+91 95899 54890');
  const [address, setAddress] = useState('Shop 12-14, Titanium City Center, Prahlad Nagar, Ahmedabad');
  const [gstin, setGstin] = useState('24AAACZ1234F1Z5');
  const [fssai, setFssai] = useState('10723001000452');
  const [cgst, setCgst] = useState('2.5');
  const [sgst, setSgst] = useState('2.5');
  const [serviceCharge, setServiceCharge] = useState('0.0');
  const [upiId, setUpiId] = useState('zaika.restaurant@icici');
  const [razorpayKey, setRazorpayKey] = useState('rzp_test_samplekey123');
  const [wifiSsid, setWifiSsid] = useState('Zaika_Guest_WiFi_5G');
  const [wifiPass, setWifiPass] = useState('zaikadelicious');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#25364A]">Restaurant Configuration</h1>
          <p className="text-xs text-gray-500">
            Profile metadata, GST taxation, Razorpay credentials & guest WiFi settings
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-[#E76F35] text-white text-xs font-bold rounded-xl hover:bg-[#D3551B] transition flex items-center space-x-1.5 shadow"
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Changes Saved!' : 'Save Configuration'}</span>
        </button>
      </div>

      {/* Business Details */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#25364A] flex items-center space-x-2 border-b border-gray-100 pb-3">
          <Building className="w-4 h-4 text-[#E76F35]" />
          <span>Restaurant Legal Profile & Licensing</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              Registered Restaurant Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              Primary Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              Goods & Services Tax ID (GSTIN)
            </label>
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 font-mono focus:outline-none focus:border-[#E76F35]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              FSSAI Food License Number (14 Digits)
            </label>
            <input
              type="text"
              value={fssai}
              onChange={(e) => setFssai(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 font-mono focus:outline-none focus:border-[#E76F35]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">
            Physical Outlet Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
          />
        </div>
      </div>

      {/* Taxes & Charges */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#25364A] flex items-center space-x-2 border-b border-gray-100 pb-3">
          <Percent className="w-4 h-4 text-emerald-600" />
          <span>GST Taxation & Service Charges</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              Central GST (CGST %)
            </label>
            <input
              type="number"
              step="0.1"
              value={cgst}
              onChange={(e) => setCgst(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              State GST (SGST %)
            </label>
            <input
              type="number"
              step="0.1"
              value={sgst}
              onChange={(e) => setSgst(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              Service Charge (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={serviceCharge}
              onChange={(e) => setServiceCharge(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
            />
          </div>
        </div>
      </div>

      {/* Payment Gateways & UPI */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#25364A] flex items-center space-x-2 border-b border-gray-100 pb-3">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span>Indian Payment Gateways & UPI VPA</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              Primary Merchant UPI ID (for instant QR)
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 font-mono focus:outline-none focus:border-[#E76F35]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              Razorpay Merchant Key ID
            </label>
            <input
              type="text"
              value={razorpayKey}
              onChange={(e) => setRazorpayKey(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 font-mono focus:outline-none focus:border-[#E76F35]"
            />
          </div>
        </div>
      </div>

      {/* Guest WiFi */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#25364A] flex items-center space-x-2 border-b border-gray-100 pb-3">
          <Wifi className="w-4 h-4 text-indigo-600" />
          <span>Guest Dining WiFi Network</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              WiFi SSID (Network Name)
            </label>
            <input
              type="text"
              value={wifiSsid}
              onChange={(e) => setWifiSsid(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              WiFi Password
            </label>
            <input
              type="text"
              value={wifiPass}
              onChange={(e) => setWifiPass(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 font-mono focus:outline-none focus:border-[#E76F35]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
