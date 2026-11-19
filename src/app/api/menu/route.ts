import { NextResponse } from 'next/server';
import { dineFlowStore } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;

  const items = dineFlowStore.getMenuItems(category);
  return NextResponse.json({ success: true, items });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (action === 'TOGGLE_AVAILABILITY') {
      const item = dineFlowStore.toggleMenuItemAvailability(id);
      return NextResponse.json({ success: true, item });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
