import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserByAddress } from "@/lib/db";

function normalizeAddress(address: string): string {
  return address?.toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json(
        {
          status: "ERROR",
          error: "Invalid address",
        },
        { status: 400 }
      );
    }

    const normalizedAddress = normalizeAddress(address);
    const user = await getUserByAddress(normalizedAddress);
    if (!user) {
      return NextResponse.json(
        {
          status: "REGISTRATION_REQUIRED",
          address: normalizedAddress,
        },
        {
          status: 200,
        }
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
