import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { BidStatus } from '@prisma/client';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const rejectedBid = await prisma.bid.update({
      where: { id: id },
      data: { status: BidStatus.rejected }
    });

    return NextResponse.json(rejectedBid);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Error rejecting bid' },
      { status: 500 }
    );
  }
}