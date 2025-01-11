import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { purchaseInvestment, getInvestmentByAddress } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await auth(req);

    if (!user || user.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { investmentId, price } = await req.json();

    const purchase = await purchaseInvestment(user.id, investmentId, price);

    return NextResponse.json({
      status: "SUCCESS",
      purchase,
    });
  } catch (error) {
    console.error("Purchase error:", error);
    return NextResponse.json(
      { error: "Failed to process purchase" },
      { status: 500 }
    );
  }
}
