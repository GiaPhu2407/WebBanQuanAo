import { signUp } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password, fullname, phone, address } = body;

    const user = await signUp(
      email,
      username,
      password,
      fullname,
      phone,
      address
    );
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 400 });
  }
}
