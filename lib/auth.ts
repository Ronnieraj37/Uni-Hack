import { NextRequest } from "next/server";
import { getUserByAddress } from "./db";

export async function auth(req: NextRequest) {
  try {
    const walletAddress = req.headers.get("wallet-address");

    if (!walletAddress) {
      console.log("No wallet address provided");
      return null;
    }

    // Get user from database
    const user = await getUserByAddress(walletAddress);

    if (!user) {
      console.log("No user found for address:", walletAddress);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
