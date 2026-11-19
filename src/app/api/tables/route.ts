import { NextResponse } from 'next/server';
import { dineFlowStore } from '@/lib/store';

export async function GET() {
  const tables = dineFlowStore.getTables();
  return NextResponse.json({ success: true, tables });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { tableId, status, details } = body;

    if (!tableId || !status) {
      return NextResponse.json(
        { success: false, error: 'tableId and status are required' },
        { status: 400 }
      );
    }

    const updated = dineFlowStore.updateTableStatus(tableId, status, details);
    return NextResponse.json({ success: true, table: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
