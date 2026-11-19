'use client';

import { useState } from 'react';
import { GlassWater, Utensils, Receipt, HandHelping, MessageSquare, CheckCircle2 } from 'lucide-react';

interface AssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
}

export function AssistanceModal({ isOpen, onClose, tableNumber }: AssistanceModalProps) {
  const [selectedType, setSelectedType] = useState<string>('WATER');
  const [customNote, setCustomNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const requestOptions = [
    { type: 'WATER', label: 'Need Water', icon: GlassWater, desc: 'Fresh drinking water jug' },
    { type: 'NAPKINS', label: 'Need Napkins', icon: Utensils, desc: 'Extra napkins & cutlery' },
    { type: 'REQUEST_BILL', label: 'Request Bill', icon: Receipt, desc: 'Ready to settle the bill' },
    { type: 'CALL_WAITER', label: 'Need Assistance', icon: HandHelping, desc: 'Call our floor steward' },
    { type: 'CUSTOM', label: 'Special Request', icon: MessageSquare, desc: 'Type specific instructions' },
  ];

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/assistance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: `table-${tableNumber.toLowerCase()}`,
          tableNumber,
          type: selectedType,
          customNote: customNote.trim() || undefined,
        }),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#25364A]">Request Sent to Waiter!</h3>
            <p className="text-xs text-gray-500 mt-1">
              Our service steward for Table {tableNumber} is on their way.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-5">
              <h3 className="text-lg font-bold text-[#25364A]">Call Floor Steward</h3>
              <p className="text-xs text-gray-500">
                Table {tableNumber} &bull; What can we bring for you?
              </p>
            </div>

            <div className="space-y-2 mb-4">
              {requestOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedType === opt.type;
                return (
                  <button
                    key={opt.type}
                    onClick={() => setSelectedType(opt.type)}
                    className={`w-full p-3 rounded-xl border flex items-center space-x-3 text-left transition ${
                      isSelected
                        ? 'border-[#E76F35] bg-orange-50/50 text-[#E76F35]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-[#E76F35] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">{opt.label}</p>
                      <p className="text-[11px] text-gray-500">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedType === 'CUSTOM' && (
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Extra green chillies, ice bucket, baby chair..."
                className="w-full text-xs p-3 rounded-xl border border-gray-200 mb-4 focus:outline-none focus:border-[#E76F35]"
                rows={2}
              />
            )}

            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-1/2 py-2.5 rounded-xl bg-[#E76F35] hover:bg-[#D3551B] text-white text-xs font-bold transition shadow"
              >
                {submitting ? 'Sending...' : 'Notify Waiter'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
