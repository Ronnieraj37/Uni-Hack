import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// User Operations
export async function getUserByAddress(address: string) {
  try {
    // Log the input address and its normalized version
    console.log("Input address:", address);
    const normalizedAddress = address.toLowerCase();
    console.log("Normalized address:", normalizedAddress);

    // First try exact match
    let user = await prisma.user.findUnique({
      where: {
        address: address,
      },
    });

    // If not found, try lowercase
    if (!user) {
      user = await prisma.user.findFirst({
        where: {
          address: {
            equals: normalizedAddress,
            mode: "insensitive", // This makes the search case-insensitive
          },
        },
      });
    }

    console.log("Found user:", user); // Debug log
    return user;
  } catch {
    console.log("Database error in getUserByAddress:");
    return null;
  }
}

export async function createUser(
  address: string,
  role: "INVESTOR" | "USER",
  email?: string | null,
  name?: string | null
) {
  try {
    return await prisma.user.create({
      data: {
        address,
        role,
        email: email || null,
        name: name || null,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to create user");
  }
}

// Investment Operations
export async function createInvestment(data: {
  protectedDataAddress: string;
  collectionId: string;
  name: string;
  description?: string;
  price: number;
  creatorId: string;
}) {
  return prisma.investment.create({
    data: {
      protectedDataAddress: data.protectedDataAddress,
      collectionId: data.collectionId,
      name: data.name,
      description: data.description,
      price: data.price,
      creatorId: data.creatorId,
    },
  });
}

export async function getInvestmentByAddress(protectedDataAddress: string) {
  return prisma.investment.findUnique({
    where: { protectedDataAddress },
    include: {
      creator: true,
    },
  });
}

export async function getAllInvestments() {
  return prisma.investment.findMany({
    include: {
      creator: true,
      _count: {
        select: { purchases: true },
      },
    },
  });
}

// Purchase Operations
export async function purchaseInvestment(
  userId: string,
  investmentId: string,
  price: number
) {
  return prisma.investmentPurchase.create({
    data: {
      userId,
      investmentId,
      purchasePrice: price,
    },
  });
}

export async function getUserPurchases(userId: string) {
  return prisma.investmentPurchase.findMany({
    where: { userId },
    include: {
      investment: true,
    },
  });
}

// Transaction Tracking
export async function createTransaction(txHash: string, type: string) {
  return prisma.transaction.create({
    data: {
      txHash,
      type,
      status: "PENDING",
    },
  });
}

export async function updateTransactionStatus(txHash: string, status: string) {
  return prisma.transaction.update({
    where: { txHash },
    data: { status },
  });
}
