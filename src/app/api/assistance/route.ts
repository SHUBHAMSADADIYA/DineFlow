import { NextResponse } from 'next/server';
import { dineFlowStore } from '@/lib/store';

export async function GET() {
  const requests = dineFlowStore.getAssistanceRequests();
  return NextResponse.json({ success: true, requests });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableId, tableNumber, type, customNote } = body;

    if (!tableId || !tableNumber || !type) {
      return NextResponse.json(
        { success: false, error: 'tableId, tableNumber, and type are required' },
        { status: 400 }
      );
    }

    const newReq = dineFlowStore.createAssistanceRequest({
      tableId,
      tableNumber,
      type,
      customNote,
    });

    return NextResponse.json({ success: true, request: newReq }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, handledByName } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'id and status are required' },
        { status: 400 }
      );
    }

    const updated = dineFlowStore.updateAssistanceStatus(id, status, handledByName);
    return NextResponse.json({ success: true, request: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
