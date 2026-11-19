'use client';

import { useState } from 'react';
import { Store, Plus, MapPin, Phone, CheckCircle2, Building2 } from 'lucide-react';

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState([
    {
      id: 'b-1',
      name: 'Zaika - Ahmedabad (Main Flagship)',
      address: 'Shop 12-14, Titanium City Center, Prahlad Nagar',
      city: 'Ahmedabad, Gujarat',
      phone: '+91 95899 54890',
      tablesCount: 6,
      fssai: '10723001000452',
      isActive: true,
      isCurrent: true,
    },
    {
      id: 'b-2',
      name: 'Zaika - Surat Outlet',
      address: 'Near VR Mall, Dumas Road',
      city: 'Surat, Gujarat',
      phone: '+91 98250 88991',
      tablesCount: 12,
      fssai: '10724002000889',
      isActive: true,
      isCurrent: false,
    },
    {
      id: 'b-3',
      name: 'Zaika - Mumbai Bandra',
      address: 'Linking Road, Bandra West',
      city: 'Mumbai, Maharashtra',
      phone: '+91 98190 77665',
      tablesCount: 18,
      fssai: '11525003000124',
      isActive: true,
      isCurrent: false,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#25364A]">Multi-Branch Outlets</h1>
          <p className="text-xs text-gray-500">
            Centrally manage menus, pricing & floor configurations across multiple restaurant cities
          </p>
        </div>

        <button className="px-4 py-2 bg-[#E76F35] text-white text-xs font-bold rounded-xl hover:bg-[#D3551B] transition flex items-center space-x-1 shadow">
          <Plus className="w-4 h-4" />
          <span>Add New Outlet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map((b) => (
          <div
            key={b.id}
            className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-between transition ${
              b.isCurrent ? 'border-[#E76F35] ring-2 ring-orange-200' : 'border-gray-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#E76F35] flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                {b.isCurrent ? (
                  <span className="text-[10px] font-bold bg-[#E76F35] text-white px-2 py-0.5 rounded-full">
                    Active Console
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    Connected
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm text-[#25364A]">{b.name}</h3>

              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
                <div className="flex items-start space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>{b.address}, {b.city}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{b.phone}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-gray-700 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>{b.tablesCount} Tables &bull; FSSAI: {b.fssai}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              {b.isCurrent ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Currently Selected
                </span>
              ) : (
                <button className="w-full py-1.5 bg-gray-100 hover:bg-[#25364A] hover:text-white text-gray-700 text-xs font-bold rounded-lg transition">
                  Switch to this Branch
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
