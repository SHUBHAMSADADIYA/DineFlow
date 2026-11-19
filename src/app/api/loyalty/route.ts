import { NextResponse } from 'next/server';
import { dineFlowStore } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  if (!phone) {
    return NextResponse.json(
      { success: false, error: 'Phone number is required' },
      { status: 400 }
    );
  }

  const customer = dineFlowStore.getCustomerByPhone(phone);
  return NextResponse.json({
    success: true,
    points: customer ? customer.loyaltyPoints : 0,
    customer: customer || null,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, points, action } = body;

    if (!phone || !points) {
      return NextResponse.json(
        { success: false, error: 'Phone and points are required' },
        { status: 400 }
      );
    }

    if (action === 'REDEEM') {
      const redeemed = dineFlowStore.redeemLoyaltyPoints(phone, points);
      if (!redeemed) {
        return NextResponse.json(
          { success: false, error: 'Insufficient points or customer not found' },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true, message: 'Points redeemed successfully' });
    }

    // Default: Add/Award points
    const customer = dineFlowStore.addLoyaltyPoints(phone, points);
    return NextResponse.json({ success: true, customer });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
