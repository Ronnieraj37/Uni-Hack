import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  createInvestment,
  getAllInvestments,
  getInvestmentByAddress,
} from "@/lib/db";
import { auth } from "@/lib/auth";

// Create new investment
export async function POST(req: NextRequest) {
  try {
    const user = await auth(req);

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

    const {
      protectedDataAddress,
      collectionId,
      name,
      description,
      price,
      tokenAllocations,
    } = await req.json();

    // Validate required fields
    if (!protectedDataAddress || !collectionId || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const investment = await createInvestment({
      protectedDataAddress,
      collectionId,
      name,
      description,
      price,
      creatorId: user.id,
      tokenAllocations,
    });

    return NextResponse.json({
      status: "SUCCESS",
      investment,
    });
  } catch (error) {
    console.error("Investment creation error:", error);
    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 }
    );
  }
}

// Get all investments
export async function GET(req: NextRequest) {
  try {
    const user = await auth(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const investments = await getAllInvestments();

    return NextResponse.json({
      status: "SUCCESS",
      investments,
    });
  } catch (error) {
    console.error("Investment fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}
