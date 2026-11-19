import { NextResponse } from 'next/server';
import { dineFlowStore } from '@/lib/store';

export async function GET() {
  const stats = dineFlowStore.getTodayAnalytics();

  // Hourly trend data
  const hourlySales = [
    { hour: '11:00', sales: 2400, orders: 4 },
    { hour: '12:00', sales: 5800, orders: 8 },
    { hour: '13:00', sales: 12400, orders: 16 },
    { hour: '14:00', sales: 9200, orders: 11 },
    { hour: '15:00', sales: 3100, orders: 4 },
    { hour: '18:00', sales: 4600, orders: 6 },
    { hour: '19:00', sales: 11800, orders: 14 },
    { hour: '20:00', sales: 16200, orders: 20 },
    { hour: '21:00', sales: 14500, orders: 18 },
  ];

  // Category breakdown
  const categoryBreakdown = [
    { name: 'Main Course', value: 42, color: '#E76F35' },
    { name: 'Indian Breads', value: 24, color: '#E9A23B' },
    { name: 'Starters', value: 16, color: '#25364A' },
    { name: 'Beverages', value: 11, color: '#1D9B68' },
    { name: 'Desserts', value: 7, color: '#D94B4B' },
  ];

  // Top selling dishes
  const topSellingItems = [
    { name: 'Paneer Makhani', count: 42, revenue: 13440 },
    { name: 'Amritsari Butter Naan', count: 96, revenue: 4800 },
    { name: 'Dum Pukht Veg Biryani', count: 28, revenue: 7280 },
    { name: 'Charcoal Garlic Butter Naan', count: 54, revenue: 3780 },
    { name: 'Alphonso Mango Lassi', count: 35, revenue: 3500 },
  ];

  return NextResponse.json({
    success: true,
    stats,
    hourlySales,
    categoryBreakdown,
    topSellingItems,
  });
}
