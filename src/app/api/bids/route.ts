import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { collectionId, price, status, userId } = await req.json();

    const newBid = await prisma.bid.create({
      data: {
        collectionId,
        price,
        status,
        userId
      },
    });

    return NextResponse.json(newBid, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 });
  }
}
