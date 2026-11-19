import { NextResponse } from 'next/server';
import { dineFlowStore } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const station = searchParams.get('station') || undefined;

  const tickets = dineFlowStore.getKitchenTickets(station);
  return NextResponse.json({ success: true, tickets });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { ticketId, itemId, status } = body;

    if (!ticketId || !itemId || !status) {
      return NextResponse.json(
        { success: false, error: 'ticketId, itemId and status are required' },
        { status: 400 }
      );
    }

    const updated = dineFlowStore.updateTicketItemStatus(ticketId, itemId, status);
    return NextResponse.json({ success: true, ticket: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
