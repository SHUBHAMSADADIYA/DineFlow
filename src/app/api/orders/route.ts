import { NextResponse } from 'next/server';
import { dineFlowStore } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table');

  if (table) {
    const order = dineFlowStore.getOrderByTableNumber(table);
    return NextResponse.json({ success: true, order: order || null });
  }

  const orders = dineFlowStore.getOrders();
  return NextResponse.json({ success: true, orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tableId,
      tableNumber,
      customerName,
      customerPhone,
      items,
      subtotal,
      discountAmount = 0,
      couponCode,
      tipAmount = 0,
      specialNotes,
    } = body;

    if (!tableNumber || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Table number and items are required' },
        { status: 400 }
      );
    }

    const cgstAmount = Math.round(((subtotal - discountAmount) * 0.025) * 100) / 100;
    const sgstAmount = Math.round(((subtotal - discountAmount) * 0.025) * 100) / 100;
    const finalAmount = Math.round((subtotal - discountAmount + cgstAmount + sgstAmount + tipAmount) * 100) / 100;

    const newOrder = dineFlowStore.createOrder({
      restaurantId: 'rest-zaika-001',
      branchId: 'branch-ahmedabad-01',
      tableId: tableId || `table-${tableNumber.toLowerCase()}`,
      tableNumber,
      customerName: customerName || 'Guest User',
      customerPhone: customerPhone || '',
      status: 'PLACED',
      items,
      subtotal,
      discountAmount,
      couponCode,
      cgstAmount,
      sgstAmount,
      serviceCharge: 0,
      tipAmount,
      finalAmount,
      specialNotes,
      estimatedMinutesRemaining: 18,
      paymentStatus: 'PENDING',
      isPaid: false,
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
