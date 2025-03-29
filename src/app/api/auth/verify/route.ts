import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";


export async function GET(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.split("auth_token=")[1]
    ?.split(";")[0];

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  try {
    await verifyToken(token);
    return NextResponse.json({ valid: true });
  } catch (error) {
    return NextResponse.json({ message: error, valid: false }, { status: 401 });
  }
}
