import { NextResponse } from 'next/server';
import { dineFlowStore } from '@/lib/store';

export async function GET() {
  const reviews = dineFlowStore.getReviews();
  return NextResponse.json({ success: true, reviews });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderNumber, customerName, rating, comment, foodRating, serviceRating, ambianceRating } = body;

    if (!orderNumber || !rating) {
      return NextResponse.json(
        { success: false, error: 'orderNumber and rating are required' },
        { status: 400 }
      );
    }

    const newReview = dineFlowStore.addReview({
      orderNumber,
      customerName: customerName || 'Verified Guest',
      rating,
      comment: comment || '',
      foodRating: foodRating || rating,
      serviceRating: serviceRating || rating,
      ambianceRating: ambianceRating || rating,
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
