import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createUser, getUserByAddress } from "@/lib/db";

function normalizeAddress(address: string): string {
  return address?.toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, role, name, email } = body;

    // Validate required fields
    if (!address || !role || !name) {
      return NextResponse.json(
        {
          status: "ERROR",
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log("HEre", address);
    const existingUser = await getUserByAddress(address);
    if (existingUser) {
      return NextResponse.json(
        {
          status: "ERROR",
          error: "User already exists",
        },
        { status: 400 }
      );
    }

    // Create new user
    const normAddress = normalizeAddress(address);
    const user = await createUser(normAddress, role, email, name);

    return NextResponse.json({
      status: "SUCCESS",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        status: "ERROR",
        error: "Registration failed",
      },
      { status: 500 }
    );
  }
}
