import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        bids: {
          orderBy: {
            price: "asc",
          },
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        name: 'asc', 
      },
    });
    return NextResponse.json(collections);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching collections", error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { name, description, price, stocks, userId } = await request.json();

    try {
      const newCollection = await prisma.collection.create({
        data: {
          name,
          description,
          price,
          stocks,
          user: {
            connect: { id: userId }
          }
        }
      });
      return NextResponse.json(newCollection, { status: 201 });
    } catch (error) {
      console.error("Error creating collection:", error);
      return NextResponse.json({ error: "Failed to create collection" }, { status: 500 });
    }
}
