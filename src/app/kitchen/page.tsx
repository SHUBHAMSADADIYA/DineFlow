'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChefHat,
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Filter,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { KitchenTicket, KitchenTicketStatus } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function KitchenDisplayPage() {
  const [tickets, setTickets] = useState<KitchenTicket[]>([]);
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const stations = [
    { id: 'ALL', label: 'All Stations' },
    { id: 'Tandoor', label: 'Tandoor & Breads' },
    { id: 'Curry', label: 'Curry & Gravy' },
    { id: 'Chinese', label: 'Wok & Chinese' },
    { id: 'Drinks', label: 'Bar & Beverages' },
    { id: 'Dessert', label: 'Dessert & Sweets' },
  ];

  const fetchTickets = () => {
    fetch(`/api/kitchen?station=${selectedStation}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTickets(data.tickets);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 3500); // 3.5s live polling
    return () => clearInterval(interval);
  }, [selectedStation]);

  const handleUpdateItemStatus = async (
    ticketId: string,
    itemId: string,
    newStatus: KitchenTicketStatus
  ) => {
    try {
      const res = await fetch('/api/kitchen', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, itemId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Play gentle audio chime if sound enabled
        if (soundEnabled && typeof window !== 'undefined') {
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 chime
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
          } catch (e) {}
        }
        fetchTickets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeTickets = tickets.filter(
    (t) => t.status !== 'SERVED' && t.status !== 'CANCELLED'
  );

  return (
    <div className="min-h-screen bg-[#1C2A3A] text-white flex flex-col">
      {/* Top KDS Header */}
      <header className="bg-[#141F2B] border-b border-gray-800 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#E76F35] flex items-center justify-center font-bold text-white shadow-md">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-black text-base text-white tracking-wide">
                  Zaika Kitchen Display (KDS)
                </h1>
                <span className="text-[10px] uppercase font-bold bg-[#E76F35] px-2 py-0.5 rounded">
                  Live
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Ahmedabad Main Kitchen &bull; {activeTickets.length} Active Tickets
              </p>
            </div>
          </div>

          {/* Station Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {stations.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStation(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedStation === st.id
                    ? 'bg-[#E76F35] text-white shadow'
                    : 'bg-[#25364A] text-gray-300 hover:bg-slate-700'
                }`}
              >
                {st.label}
              </button>
            ))}

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl transition ${
                soundEnabled ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}
              title="Toggle Kitchen Sound Alerts"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={fetchTickets}
              className="p-2 rounded-xl bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              href="/staff"
              className="px-3 py-1.5 bg-[#25364A] hover:bg-slate-700 text-xs font-bold rounded-xl transition"
            >
              Floor POS
            </Link>
          </div>
        </div>
      </header>

      {/* Main KDS Board */}
      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        {activeTickets.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center p-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-3" />
            <h2 className="text-xl font-bold">Kitchen Queue Cleared!</h2>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              All active food items have been cooked and dispatched to tables.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTickets.map((ticket) => {
              const elapsedMinutes = Math.floor(
                (Date.now() - new Date(ticket.createdAt).getTime()) / 60000
              );
              const isOverdue = elapsedMinutes > ticket.targetPrepTime;

              return (
                <div
                  key={ticket.id}
                  className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg transition ${
                    isOverdue
                      ? 'border-red-500 bg-[#2A1D22]'
                      : ticket.status === 'READY'
                      ? 'border-emerald-500 bg-[#172D24]'
                      : 'border-gray-700 bg-[#25364A]'
                  }`}
                >
                  {/* Ticket Header */}
                  <div className="p-3.5 bg-black/30 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="px-2.5 py-1 rounded-lg bg-[#E76F35] text-white font-black text-sm">
                        Table {ticket.tableNumber}
                      </div>
                      <span className="font-bold text-xs text-gray-200">
                        #{ticket.orderNumber}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded flex items-center space-x-1 ${
                          isOverdue
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-white/10 text-gray-300'
                        }`}
                      >
                        <Clock className="w-3 h-3 mr-0.5" />
                        <span>{elapsedMinutes}m elapsed</span>
                      </span>
                    </div>
                  </div>

                  {/* Ticket Items List */}
                  <div className="p-4 space-y-3 flex-1">
                    {ticket.items.map((item) => {
                      const isReady = item.status === 'READY';
                      const isCooking = item.status === 'PREPARING';

                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-xl border transition ${
                            isReady
                              ? 'bg-emerald-950/40 border-emerald-700 text-gray-300'
                              : isCooking
                              ? 'bg-orange-950/40 border-orange-600 text-white'
                              : 'bg-black/20 border-white/10 text-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-base font-black text-amber-400">
                                  {item.quantity}x
                                </span>
                                <span className="font-bold text-sm leading-snug">
                                  {item.itemName}
                                </span>
                              </div>

                              <div className="text-[11px] text-gray-400 mt-1 space-x-2">
                                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-semibold text-gray-300">
                                  {item.stationName}
                                </span>
                                {item.spiceLevel && (
                                  <span>Spice: {item.spiceLevel}</span>
                                )}
                              </div>

                              {item.notes && (
                                <p className="text-xs text-yellow-300 font-semibold mt-1">
                                  &ldquo;{item.notes}&rdquo;
                                </p>
                              )}
                            </div>

                            {/* Item State Action Buttons */}
                            <div className="flex flex-col space-y-1">
                              {item.status === 'NEW' && (
                                <button
                                  onClick={() =>
                                    handleUpdateItemStatus(ticket.id, item.id, 'PREPARING')
                                  }
                                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-black text-[11px] font-black rounded-lg transition"
                                >
                                  Start Cook
                                </button>
                              )}
                              {item.status === 'PREPARING' && (
                                <button
                                  onClick={() =>
                                    handleUpdateItemStatus(ticket.id, item.id, 'READY')
                                  }
                                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black rounded-lg transition flex items-center space-x-1"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Mark Ready</span>
                                </button>
                              )}
                              {item.status === 'READY' && (
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded text-center">
                                  Plated & Ready
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ticket Footer */}
                  <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      Ordered at {formatDate(ticket.createdAt)}
                    </span>
                    <span className="font-bold text-gray-300">
                      Target: ~{ticket.targetPrepTime}m
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
