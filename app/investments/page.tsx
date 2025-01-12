"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Loader2,
  AlertCircle,
  ChevronRight,
  DollarSign,
  Lock,
  Users,
} from "lucide-react";

interface Creator {
  id: string;
  address: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Investment {
  id: string;
  name: string;
  description: string;
  protectedDataAddress: string;
  price: number;
  createdAt: string;
  collectionId: string;
  creatorId: string;
  creator: Creator;
  _count: {
    purchases: number;
  };
}

interface ApiResponse {
  status: string;
  investments: Investment[];
}

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/investments");
      if (!response.ok) throw new Error("Failed to fetch investments");

      const data: ApiResponse = await response.json();

      if (data.status === "SUCCESS" && Array.isArray(data.investments)) {
        setInvestments(data.investments);
      } else {
        setInvestments([]);
      }
    } catch (err) {
      setError("Failed to load investments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (investmentId: string) => {
    if (!window.ethereum?.selectedAddress) {
      setError("Please connect your wallet first");
      return;
    }

    setPurchaseLoading(investmentId);
    try {
      const response = await fetch("/api/investments/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "wallet-address": window.ethereum.selectedAddress,
        },
        body: JSON.stringify({
          investmentId,
          price: investments.find((inv) => inv.id === investmentId)?.price || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to purchase investment");
      }

      if (data.status === "SUCCESS") {
        await fetchInvestments(); // Refresh the list
      } else {
        throw new Error(data.error || "Failed to purchase investment");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to purchase investment"
      );
      console.error(err);
    } finally {
      setPurchaseLoading(null);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading investments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Investment Marketplace
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Browse and purchase investment strategies from other traders
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Investment Grid */}
        {investments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments.map((investment) => (
              <Card
                key={investment.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="text-xl font-bold">
                    {investment.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Created by {investment.creator.name}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                  <p className="text-gray-600 mb-4">
                    {investment.description || "No description provided"}
                  </p>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Lock className="w-4 h-4" />
                        <span>
                          {investment.protectedDataAddress.slice(0, 8)}...
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{investment.price} Credits</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Purchases: {investment._count.purchases}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-gray-50 p-4">
                  <button
                    onClick={() => handlePurchase(investment.id)}
                    disabled={purchaseLoading === investment.id}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {purchaseLoading === investment.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Purchase Strategy
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-lg text-gray-600">
              No investments available at the moment.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Check back later for new investment strategies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
