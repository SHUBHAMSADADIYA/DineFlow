import { NextResponse } from 'next/server';
import { dineFlowStore } from '@/lib/store';

export async function GET() {
  const inventory = dineFlowStore.getInventory();
  return NextResponse.json({ success: true, inventory });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, amount } = body;

    if (!id || typeof amount !== 'number') {
      return NextResponse.json(
        { success: false, error: 'id and amount (number) are required' },
        { status: 400 }
      );
    }

    const item = dineFlowStore.adjustStock(id, amount);
    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
