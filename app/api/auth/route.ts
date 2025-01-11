import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserByAddress } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || !body.address) {
      return NextResponse.json(
        {
          status: "ERROR",
          error: "Missing address",
        },
        { status: 400 }
      );
    }

    const { address } = body;

    // Check if user exists
    const user = await getUserByAddress(address);

    if (!user) {
      return NextResponse.json(
        {
          status: "REGISTRATION_REQUIRED",
          address,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      status: "AUTHENTICATED",
      user,
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      {
        status: "ERROR",
        error: "Authentication failed",
      },
      { status: 500 }
    );
  }
}
