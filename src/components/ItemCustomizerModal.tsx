'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MenuItem, SpiceLevel } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { Flame, Plus, Minus, X, Check } from 'lucide-react';

interface ItemCustomizerModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (customizedItem: {
    menuItemId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    modifiers: {
      variantName?: string;
      variantPrice?: number;
      addons: { name: string; price: number }[];
      spiceLevel: SpiceLevel;
      specialInstructions?: string;
    };
    totalPrice: number;
    stationName: string;
  }) => void;
}

export function ItemCustomizerModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
}: ItemCustomizerModalProps) {
  if (!isOpen || !item) return null;

  const defaultVariant = item.variants?.find((v) => v.isDefault) || item.variants?.[0];
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>(item.spiceLevel || 'MEDIUM');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Calculate Unit Price based on Variant
  const basePrice = selectedVariant ? selectedVariant.price : item.basePrice;

  // Calculate Add-on prices
  const addonsTotal = selectedAddons.reduce((sum, addonName) => {
    const addon = item.addons?.find((a) => a.name === addonName);
    return sum + (addon ? addon.price : 0);
  }, 0);

  const unitPrice = basePrice + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddon = (name: string) => {
    setSelectedAddons((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleConfirm = () => {
    onAddToCart({
      menuItemId: item.id,
      name: selectedVariant ? `${item.name} (${selectedVariant.name})` : item.name,
      unitPrice,
      quantity,
      modifiers: {
        variantName: selectedVariant?.name,
        variantPrice: selectedVariant?.price,
        addons: selectedAddons.map((addonName) => ({
          name: addonName,
          price: item.addons?.find((a) => a.name === addonName)?.price || 0,
        })),
        spiceLevel,
        specialInstructions: specialInstructions.trim() || undefined,
      },
      totalPrice,
      stationName: item.stationName,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header Image */}
        <div className="relative h-48 w-full bg-gray-100">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-4 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-white text-[11px] font-semibold">
            {item.stationName} Station &bull; ~{item.prepTimeMinutes} mins
          </div>
        </div>

        <div className="p-5">
          {/* Title & Desc */}
          <div className="mb-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {item.foodType === 'VEGETARIAN' ? 'Pure Vegetarian' : 'Non-Vegetarian'}
                </span>
                <h3 className="text-lg font-bold text-[#25364A] mt-1.5">{item.name}</h3>
              </div>
              <span className="text-lg font-extrabold text-[#E76F35]">
                {formatINR(basePrice)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">{item.description}</p>
          </div>

          {/* Variants (Portion Size) */}
          {item.variants && item.variants.length > 0 && (
            <div className="mb-5 pt-4 border-t border-gray-100">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                Choose Portion Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                        isSelected
                          ? 'border-[#E76F35] bg-orange-50/50 text-[#25364A]'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">{variant.name}</p>
                        <p className="text-xs text-[#E76F35] font-semibold">{formatINR(variant.price)}</p>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[#E76F35] text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spice Level */}
          <div className="mb-5 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-1.5 mb-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Spice Intensity
              </label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['MILD', 'MEDIUM', 'HOT', 'EXTRA_HOT'] as SpiceLevel[]).map((level) => {
                const isSelected = spiceLevel === level;
                return (
                  <button
                    key={level}
                    onClick={() => setSpiceLevel(level)}
                    className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition ${
                      isSelected
                        ? 'border-[#E76F35] bg-[#E76F35] text-white'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {level.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add-ons */}
          {item.addons && item.addons.length > 0 && (
            <div className="mb-5 pt-4 border-t border-gray-100">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                Custom Add-ons
              </label>
              <div className="space-y-2">
                {item.addons.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.name);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.name)}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                        isChecked
                          ? 'border-[#E76F35] bg-orange-50/40 text-[#25364A]'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <span className="font-medium">{addon.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#E76F35]">+{formatINR(addon.price)}</span>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked
                              ? 'bg-[#E76F35] border-[#E76F35] text-white'
                              : 'border-gray-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cooking Instructions */}
          <div className="mb-6 pt-4 border-t border-gray-100">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
              Chef Instructions (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less oil, extra crispy, no garlic..."
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F35]"
            />
          </div>

          {/* Quantity & Confirm */}
          <div className="flex items-center space-x-3 pt-3 border-t border-gray-100">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-gray-50">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-9 text-center text-sm font-bold text-[#25364A]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 bg-[#E76F35] hover:bg-[#D3551B] text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-between transition"
            >
              <span>Add to Table Order</span>
              <span>{formatINR(totalPrice)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
