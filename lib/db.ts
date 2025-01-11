import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// User Operations
export async function getUserByAddress(address: string) {
  try {
    return await prisma.user.findUnique({
      where: { address },
    });
  } catch (error) {
    console.error("Database error:", error);
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
  tokenAllocations: { token: string; percentage: number }[];
}) {
  return prisma.investment.create({
    data: {
      protectedDataAddress: data.protectedDataAddress,
      collectionId: data.collectionId,
      name: data.name,
      description: data.description,
      price: data.price,
      creatorId: data.creatorId,
      tokenAllocations: {
        create: data.tokenAllocations,
      },
    },
    include: {
      tokenAllocations: true,
    },
  });
}

export async function getInvestmentByAddress(protectedDataAddress: string) {
  return prisma.investment.findUnique({
    where: { protectedDataAddress },
    include: {
      tokenAllocations: true,
      creator: true,
    },
  });
}

export async function getAllInvestments() {
  return prisma.investment.findMany({
    include: {
      tokenAllocations: true,
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
      investment: {
        include: {
          tokenAllocations: true,
        },
      },
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
