"use client";
import React, { useState } from "react";
import { IExecDataProtector } from "@iexec/dataprotector";
import {
  Loader2,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  Search,
  Check,
  House,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getTokenInfo, tokens } from "@/types/token";
import Link from "next/link";

interface SelectedToken {
  symbol: string;
  percentage: number;
}

const PortfolioProtector: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [allocations, setAllocations] = useState<SelectedToken[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [protectedDataAddress, setProtectedDataAddress] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [investmentTitle, setInvestmentTitle] = useState("");
  const [investmentDescription, setInvestmentDescription] = useState("");

  const totalAllocation = allocations.reduce(
    (sum, token) => sum + token.percentage,
    0
  );

  const toggleToken = (symbol: string) => {
    const newSelected = new Set(selectedTokens);
    if (newSelected.has(symbol)) {
      newSelected.delete(symbol);
      setAllocations(allocations.filter((t) => t.symbol !== symbol));
    } else {
      newSelected.add(symbol);
      setAllocations([...allocations, { symbol, percentage: 0 }]);
    }
    setSelectedTokens(newSelected);
  };

  const updateAllocation = (symbol: string, percentage: number) => {
    if (percentage < 0 || percentage > 100) return;
    const newAllocations = allocations.map((token) =>
      token.symbol === symbol ? { ...token, percentage } : token
    );
    setAllocations(newAllocations);
  };

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const protectPortfolio = async () => {
    if (totalAllocation !== 100) {
      setError("Total allocation must equal 100%");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const iExecDataProtectorClient = new IExecDataProtector(window.ethereum);

      const portfolioData = {
        timestamp: new Date().toISOString(),
        allocations: allocations.map(({ symbol, percentage }) => ({
          token: symbol,
          percentage,
        })),
      };

      // Protect the data
      const protectedDataResponse =
        await iExecDataProtectorClient.core.protectData({
          data: {
            file: new TextEncoder().encode(
              JSON.stringify(portfolioData, null, 2)
            ),
          },
          name: `Investment Portfolio - ${new Date().toLocaleDateString()}`,
        });
      console.log("Protected data", protectedDataResponse);

      // Add to collection
      await iExecDataProtectorClient.sharing.addToCollection({
        protectedData: protectedDataResponse.address,
        collectionId: 451,
        addOnlyAppWhitelist:
          process.env
            .NEXT_PUBLIC_VITE_PROTECTED_DATA_DELIVERY_WHITELIST_ADDRESS!,
      });
      console.log("Added to collection");

      // Setup for renting
      await iExecDataProtectorClient.sharing.setProtectedDataToRenting({
        protectedData: protectedDataResponse.address,
        price: 0,
        duration: 60 * 60 * 24 * 30, // 30 days
      });
      console.log("data set for renting");

      await iExecDataProtectorClient.sharing.rentProtectedData({
        protectedData: protectedDataResponse.address,
        price: 0,
        duration: 60 * 60 * 24 * 30, // 30 days
      });
      console.log("Rented data at 0 initially");

      // Save to database without token allocations
      const saveInvestmentResponse = await fetch("/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "wallet-address": window.ethereum.selectedAddress,
        },
        body: JSON.stringify({
          protectedDataAddress: protectedDataResponse.address,
          collectionId: 451, // Using fixed collection ID
          name: investmentTitle,
          description: investmentDescription,
          price: 0,
        }),
      });

      if (!saveInvestmentResponse.ok) {
        // Get the actual error message from response
        const errorData = await saveInvestmentResponse.json();
        console.error("API Error Details:", errorData);
        throw new Error(errorData.error || "Failed to save investment");
      }

      const successData = await saveInvestmentResponse.json();
      console.log("Success response:", successData);

      setProtectedDataAddress(protectedDataResponse.address);

      return {
        address: protectedDataResponse.address,
        collectionId: "451",
      };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to protect portfolio data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderInvestmentDetails = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Investment Details</CardTitle>
        <CardDescription>Define your portfolio strategy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Investment Title *
          </label>
          <input
            type="text"
            value={investmentTitle}
            onChange={(e) => setInvestmentTitle(e.target.value)}
            placeholder="E.g., Conservative Growth Portfolio"
            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={investmentDescription}
            onChange={(e) => setInvestmentDescription(e.target.value)}
            placeholder="Describe your investment strategy..."
            rows={4}
            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <Link href={"/dashboard"}>
        <button>
          <House />
        </button>
      </Link>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-lg backdrop-filter">
          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-100">
            <div
              className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {step === 1 ? "Select Tokens" : "Configure Portfolio"}
                </h1>
                <p className="text-gray-600 mt-2">
                  Step {step} of 2:{" "}
                  {step === 1
                    ? "Choose tokens for your portfolio"
                    : "Set allocations and details"}
                </p>
              </div>

              {step === 1 && (
                <div className="w-full sm:w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tokens..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            {step === 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTokens.map((token) => (
                  <div
                    key={token.symbol}
                    onClick={() => toggleToken(token.symbol)}
                    className={`group relative overflow-hidden p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedTokens.has(token.symbol)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-100 hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gray-100 p-2 flex items-center justify-center">
                          <img
                            src={token.logo}
                            alt={token.name}
                            className="w-8 h-8"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {token.symbol}
                          </h3>
                          <p className="text-sm text-gray-500">{token.name}</p>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                          selectedTokens.has(token.symbol)
                            ? "bg-blue-500"
                            : "bg-gray-100 group-hover:bg-blue-100"
                        }`}
                      >
                        <Check
                          className={`w-4 h-4 ${
                            selectedTokens.has(token.symbol)
                              ? "text-white"
                              : "text-transparent"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {renderInvestmentDetails()}

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Token Allocations
                  </h3>
                  <div className="space-y-4">
                    {allocations.map((token) => {
                      const tokenInfo = getTokenInfo(token.symbol);
                      return (
                        <div
                          key={token.symbol}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
                        >
                          <div className="flex items-center space-x-3 w-48">
                            <div className="w-12 h-12 rounded-full bg-white p-2 flex items-center justify-center shadow-sm">
                              {tokenInfo ? (
                                <img
                                  src={tokenInfo.logo}
                                  alt={tokenInfo.name}
                                  className="w-8 h-8"
                                />
                              ) : (
                                <img
                                  src="/api/placeholder/32/32"
                                  alt={token.symbol}
                                  className="w-8 h-8"
                                />
                              )}
                            </div>
                            <span className="font-semibold text-lg">
                              {token.symbol}
                            </span>
                          </div>
                          <div className="flex-1 w-full sm:w-auto">
                            <div className="relative">
                              <input
                                type="number"
                                value={token.percentage}
                                onChange={(e) =>
                                  updateAllocation(
                                    token.symbol,
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter percentage"
                              />
                              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                %
                              </span>
                            </div>
                          </div>
                          <div className="w-24 text-right">
                            <span
                              className={`text-lg font-semibold ${
                                token.percentage > 0
                                  ? "text-blue-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {token.percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-blue-50 rounded-xl">
                  <span className="font-semibold text-lg">
                    Total Allocation
                  </span>
                  <span
                    className={`text-2xl font-bold ${
                      totalAllocation === 100
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {totalAllocation}%
                  </span>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            )}

            {/* Footer Actions */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Selection
                </button>
              )}

              <button
                onClick={step === 1 ? () => setStep(2) : protectPortfolio}
                disabled={
                  step === 1
                    ? selectedTokens.size === 0
                    : isLoading || totalAllocation !== 100
                }
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white transition-all duration-200 ${
                  step === 1
                    ? "bg-blue-600 hover:bg-blue-700 ml-auto"
                    : "bg-green-600 hover:bg-green-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {step === 1 ? (
                  <>
                    Next Step
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Protecting...
                      </>
                    ) : (
                      "Protect Portfolio"
                    )}
                  </>
                )}
              </button>
            </div>

            {protectedDataAddress && (
              <div className="mt-6 p-6 bg-green-50 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-green-800">
                  Portfolio Protected Successfully!
                </h3>
                <p className="mt-2 text-sm text-green-700 font-mono break-all bg-white p-3 rounded-lg">
                  {protectedDataAddress}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioProtector;
