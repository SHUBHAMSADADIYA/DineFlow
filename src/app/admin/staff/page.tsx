'use client';

import { useState } from 'react';
import { Users, Plus, Shield, CheckCircle2, Clock, Phone, Mail } from 'lucide-react';

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState([
    {
      id: 'st-1',
      name: 'Ramesh Solanki',
      role: 'Floor Captain / Senior Waiter',
      phone: '+91 98250 11223',
      shift: 'Morning & Evening (11:00 - 23:00)',
      tables: 'T01 - T03',
      isActive: true,
    },
    {
      id: 'st-2',
      name: 'Gurpreet Singh',
      role: 'Head Tandoor Master',
      phone: '+91 97234 44556',
      shift: 'Evening Shift (16:00 - 23:30)',
      tables: 'Tandoor Station',
      isActive: true,
    },
    {
      id: 'st-3',
      name: 'Rajesh Sharma',
      role: 'Executive Chef (Curries & Mains)',
      phone: '+91 94280 88990',
      shift: 'Full Day Shift',
      tables: 'Main Kitchen Station',
      isActive: true,
    },
    {
      id: 'st-4',
      name: 'Vikas Prajapati',
      role: 'Bar & Beverage Steward',
      phone: '+91 99090 33445',
      shift: 'Full Day Shift',
      tables: 'Drinks Station & T04 - T06',
      isActive: true,
    },
    {
      id: 'st-5',
      name: 'Priya Joshi',
      role: 'Restaurant Assistant Manager',
      phone: '+91 98790 55667',
      shift: 'Morning Shift (10:00 - 19:00)',
      tables: 'Floor Supervisor',
      isActive: true,
    },
  ]);

  const toggleStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#25364A]">Staff & Floor Stewards</h1>
          <p className="text-xs text-gray-500">
            Manage floor waiters, head chefs, station masters & role authorizations
          </p>
        </div>

        <button className="px-4 py-2 bg-[#E76F35] text-white text-xs font-bold rounded-xl hover:bg-[#D3551B] transition flex items-center space-x-1 shadow">
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#25364A] text-white flex items-center justify-center font-black text-sm">
                  {member.name.slice(0, 2).toUpperCase()}
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                    member.isActive
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}
                >
                  {member.isActive ? 'Active Duty' : 'On Leave'}
                </span>
              </div>

              <h3 className="font-bold text-sm text-[#25364A]">{member.name}</h3>
              <p className="text-xs font-semibold text-[#E76F35] mt-0.5">{member.role}</p>

              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{member.shift}</span>
                </div>
                <div className="flex items-center space-x-1.5 font-medium text-gray-700">
                  <Shield className="w-3.5 h-3.5 text-blue-500" />
                  <span>Assigned: {member.tables}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => toggleStatus(member.id)}
                className="text-xs text-gray-500 hover:text-gray-800 font-semibold"
              >
                {member.isActive ? 'Mark On Leave' : 'Mark On Duty'}
              </button>
              <span className="text-[10px] text-gray-400">PIN: ****</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
