import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createInvestment, getAllInvestments } from "@/lib/db";
import { auth } from "@/lib/auth";

// Create new investment
export async function POST(req: NextRequest) {
  try {
    const user = await auth(req);
    console.log("Authenticated user:", user);

    if (!user) {
      console.log("Auth failed - no user");
      return NextResponse.json(
        { error: "Unauthorized - No user found" },
        { status: 401 }
      );
    }

    if (user.role !== "INVESTOR") {
      console.log("Auth failed - not an investor", user.role);
      return NextResponse.json(
        { error: "Unauthorized - Not an investor" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("Received request body:", body);

    const { protectedDataAddress, collectionId, name, description, price } =
      body;

    // Log all inputs
    console.log("Processing investment creation with:", {
      protectedDataAddress,
      collectionId,
      name,
      description,
      price,
      creatorId: user.id,
    });

    // Validate required fields
    if (!protectedDataAddress || !collectionId || !name) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      const investment = await createInvestment({
        protectedDataAddress,
        collectionId: collectionId.toString(),
        name,
        description,
        price,
        creatorId: user.id,
      });

      console.log("Investment created successfully:", investment);

      return NextResponse.json({
        status: "SUCCESS",
        investment,
      });
    } catch (dbError) {
      console.error("Database error during investment creation:", dbError);
      return NextResponse.json(
        { error: "Database error: " + (dbError as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Investment creation error:", error);
    return NextResponse.json(
      { error: "Failed to create investment: " + (error as Error).message },
      { status: 500 }
    );
  }
}

// Get all investments
export async function GET() {
  try {
    const investments = await getAllInvestments();

    return NextResponse.json({
      status: "SUCCESS",
      investments,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}
