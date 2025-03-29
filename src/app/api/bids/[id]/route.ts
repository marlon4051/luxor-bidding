import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const deletedBid = await prisma.bid.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({
      message: "Bid deleted successfully",
      bid: deletedBid,
    });
  } catch (error) {
    console.error("Error deleting bid:", error);
    return NextResponse.json(
      { message: "Error deleting bid", error },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const { price } = await request.json();

    const updatedBid = await prisma.bid.update({
      where: { id: id },
      data: { price },
    });

    return NextResponse.json(updatedBid);
  } catch (error) {
    console.error("Error updating bid:", error);
    return NextResponse.json({ error: "Error updating bid" }, { status: 500 });
  }
}
