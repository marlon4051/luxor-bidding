import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { BidStatus } from '@prisma/client';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { collectionId } = await request.json();
    const { id } = await params;
    
    await prisma.bid.updateMany({
      where: {
        collectionId,
        id: { not: id }
      },
      data: { status: BidStatus.rejected }
    });

    const acceptedBid = await prisma.bid.update({
      where: { id: id },
      data: { status: BidStatus.accepted }
    });

    return NextResponse.json(acceptedBid);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Error accepting bid' },
      { status: 500 }
    );
  }
}