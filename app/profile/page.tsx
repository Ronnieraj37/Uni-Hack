"use client";
import React, { useState, useEffect } from "react";
import { User, Wallet, ChevronRight, Shield, Settings } from "lucide-react";
import PortfolioViewer from "../components/PortfolioViewer";

interface Portfolio {
  address: string;
  name: string;
  createdAt: string;
}

const ProfilePage = () => {
  const [userAddress, setUserAddress] = useState<string>("");
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("");

  // Placeholder function to fetch protected data addresses
  const fetchProtectedPortfolios = async () => {
    // This would normally fetch from your backend or blockchain
    // For now, returning mock data
    return [
      {
        address: "0x481F130001B70ffe7cE6e763e6b8FCFaacFd8C8d",
        name: "Investment Portfolio",
        createdAt: "10/01/2025",
      },
      {
        address: "0x456...def",
        name: "Aggressive Growth Portfolio",
        createdAt: "2024-01-09T15:30:00Z",
      },
      {
        address: "0x789...ghi",
        name: "Balanced Portfolio",
        createdAt: "2024-01-08T09:15:00Z",
      },
    ];
  };

  useEffect(() => {
    const init = async () => {
      try {
        // Get user's wallet address
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUserAddress(accounts[0]);

        // Fetch user's portfolios
        const userPortfolios = await fetchProtectedPortfolios();
        setPortfolios(userPortfolios);
      } catch (error) {
        console.error("Failed to initialize:", error);
      }
    };

    init();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-8">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Wallet className="h-4 w-4 mr-2" />
                {userAddress ? (
                  <span className="font-mono">{userAddress}</span>
                ) : (
                  <span>Connect your wallet to view profile</span>
                )}
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Settings className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Portfolios List */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Protected Portfolios
              </h2>
              <div className="space-y-3">
                {portfolios.map((portfolio) => (
                  <button
                    key={portfolio.address}
                    onClick={() => setSelectedPortfolio(portfolio.address)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedPortfolio === portfolio.address
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">{portfolio.name}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(portfolio.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600">Total Portfolios</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {portfolios.length}
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600">Shared With</div>
                  <div className="text-2xl font-bold text-green-700">3</div>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Viewer */}
          <div className="md:col-span-2">
            {selectedPortfolio ? (
              <PortfolioViewer protectedDataAddress={selectedPortfolio} />
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <Shield className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Select a Portfolio
                </h3>
                <p className="mt-2 text-gray-500">
                  Choose a portfolio from the list to view its details and
                  manage access
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
