// app/api/investments/purchase/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { purchaseInvestment } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await auth(req);

    if (!user || user.role !== "USER") {
      return NextResponse.json(
        { status: "ERROR", error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body || !body.investmentId) {
      return NextResponse.json(
        { status: "ERROR", error: "Investment ID is required" },
        { status: 400 }
      );
    }

    const { investmentId } = body;
    // Default price to 0 if not provided
    const price = body.price || 0;

    const purchase = await purchaseInvestment(user.id, investmentId, price);

    return NextResponse.json({
      status: "SUCCESS",
      purchase,
    });
  } catch (error) {
    console.error("Purchase error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { status: "ERROR", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { status: "ERROR", error: "Failed to process purchase" },
      { status: 500 }
    );
  }
}
