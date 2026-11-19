import { NextResponse } from 'next/server';
import { dineFlowStore } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const order = dineFlowStore.getOrderById(params.id);
  if (!order) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, order });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, action, paymentMethod, amountPaid } = body;

    if (action === 'PAY_BILL') {
      const paidOrder = dineFlowStore.payBill(params.id, paymentMethod || 'UPI', amountPaid);
      return NextResponse.json({ success: true, order: paidOrder });
    }

    if (status) {
      const updated = dineFlowStore.updateOrderStatus(params.id, status);
      return NextResponse.json({ success: true, order: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid update request' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
