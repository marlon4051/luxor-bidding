import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logout successful" },
    { status: 200 }
  );

  response.cookies.set({
    name: "auth_token",
    value: "",
    maxAge: -1,
    path: "/",
  });

  return response;
}
