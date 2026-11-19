'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UtensilsCrossed,
  ChefHat,
  LayoutDashboard,
  ShieldCheck,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('owner@zaika.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<'OWNER' | 'WAITER' | 'CHEF' | 'SUPER_ADMIN'>('OWNER');

  const handleRoleSelect = (role: 'OWNER' | 'WAITER' | 'CHEF' | 'SUPER_ADMIN') => {
    setSelectedRole(role);
    if (role === 'OWNER') {
      setEmail('owner@zaika.com');
    } else if (role === 'WAITER') {
      setEmail('waiter@zaika.com');
    } else if (role === 'CHEF') {
      setEmail('chef@zaika.com');
    } else if (role === 'SUPER_ADMIN') {
      setEmail('superadmin@dineflow.com');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'OWNER') {
      router.push('/admin');
    } else if (selectedRole === 'WAITER') {
      router.push('/staff');
    } else if (selectedRole === 'CHEF') {
      router.push('/kitchen');
    } else if (selectedRole === 'SUPER_ADMIN') {
      router.push('/super-admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-gray-200 shadow-xl">
        {/* Brand */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center space-x-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E76F35] to-[#EE8E47] flex items-center justify-center text-white shadow">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-[#25364A]">
              Dine<span className="text-[#E76F35]">Flow</span>
            </span>
          </Link>
          <h2 className="text-xl font-black text-[#25364A]">Sign In to Your Workspace</h2>
          <p className="text-xs text-gray-500 mt-1">
            Choose your role to launch corresponding role-based portal
          </p>
        </div>

        {/* 1-Click Role Switcher */}
        <div className="mb-6">
          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2 text-center">
            Instant Demo Account Picker
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleRoleSelect('OWNER')}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition ${
                selectedRole === 'OWNER'
                  ? 'border-[#E76F35] bg-orange-50 text-[#E76F35]'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Owner Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('WAITER')}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition ${
                selectedRole === 'WAITER'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Waiter POS</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('CHEF')}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition ${
                selectedRole === 'CHEF'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Kitchen Chef</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('SUPER_ADMIN')}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition ${
                selectedRole === 'SUPER_ADMIN'
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Super Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#E76F35] hover:bg-[#D3551B] text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center space-x-1"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Want to register your own restaurant?{' '}
            <Link href="/register" className="font-bold text-[#E76F35] hover:underline">
              Create Restaurant Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
