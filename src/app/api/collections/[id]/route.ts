import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const updatedCollection = await prisma.collection.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updatedCollection, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const deletedCollection = await prisma.collection.delete({
      where: {
        id: params.id, 
      },
      include: {
        bids: true,
      },
    });

    if (!deletedCollection) {
      return NextResponse.json({ message: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Collection and associated bids deleted successfully",
      collection: deletedCollection,
    });
  } catch (error) {
    console.error("Error deleting collection:", error);
    return NextResponse.json({ message: "Error deleting collection", error }, { status: 500 });
  }
}