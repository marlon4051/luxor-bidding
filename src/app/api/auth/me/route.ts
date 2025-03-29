import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ userId: "", userName: "" });
  }

  try {
    const payload = await verifyToken(token);
    return NextResponse.json({
      userId: payload?.userId,
      userName: payload?.userName,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ userId: "", userName: "" });
  }
}
