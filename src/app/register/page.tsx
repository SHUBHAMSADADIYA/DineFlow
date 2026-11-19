'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UtensilsCrossed,
  CheckCircle2,
  Store,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [restaurantName, setRestaurantName] = useState('');
  const [city, setCity] = useState('');
  const [cuisine, setCuisine] = useState('North Indian & Mughlai');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE'>('PROFESSIONAL');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      router.push('/admin');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4 py-12">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-gray-200 shadow-xl">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center space-x-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E76F35] to-[#EE8E47] flex items-center justify-center text-white shadow">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-[#25364A]">
              Dine<span className="text-[#E76F35]">Flow</span>
            </span>
          </Link>
          <h2 className="text-xl font-black text-[#25364A]">Onboard Your Restaurant</h2>
          <p className="text-xs text-gray-500 mt-1">
            Start your 14-day free trial. Setup your digital QR menu in minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">
                Restaurant Brand Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Haveli"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">
                City / Location
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ahmedabad, Surat, Pune"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">
                Owner Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Your Name"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">
                Owner Work Email
              </label>
              <input
                type="email"
                required
                placeholder="owner@yourrestaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              Create Password
            </label>
            <input
              type="password"
              required
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
            />
          </div>

          {/* Plan Picker */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-2">
              Select Starting SaaS Plan
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { tier: 'BASIC', label: 'Basic', price: '₹999/mo' },
                { tier: 'PROFESSIONAL', label: 'Pro', price: '₹2,499/mo' },
                { tier: 'ENTERPRISE', label: 'Enterprise', price: '₹4,999/mo' },
              ].map((p) => {
                const isSelected = selectedPlan === p.tier;
                return (
                  <button
                    key={p.tier}
                    type="button"
                    onClick={() => setSelectedPlan(p.tier as any)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      isSelected
                        ? 'border-[#E76F35] bg-orange-50 text-[#E76F35]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-xs font-bold">{p.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{p.price}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-500 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Includes 14 days free trial. No credit card required.</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#E76F35] hover:bg-[#D3551B] text-white text-xs font-black rounded-xl shadow-lg transition flex items-center justify-center space-x-1"
          >
            <span>{submitting ? 'Setting Up Your Restaurant...' : 'Create Account & Launch'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#25364A] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
