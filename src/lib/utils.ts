import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function calculateOrderBreakdown(
  subtotal: number,
  discount: number = 0,
  tip: number = 0,
  cgstRate: number = 2.5,
  sgstRate: number = 2.5
) {
  const taxableAmount = Math.max(0, subtotal - discount);
  const cgst = (taxableAmount * cgstRate) / 100;
  const sgst = (taxableAmount * sgstRate) / 100;
  const total = taxableAmount + cgst + sgst + tip;

  return {
    subtotal,
    discount,
    taxableAmount,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    tip,
    total: Math.round(total * 100) / 100,
  };
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
