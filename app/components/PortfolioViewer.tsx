"use client";
import React, { useState } from "react";
import { IExecDataProtector } from "@iexec/dataprotector";
import { Loader2, Eye, AlertCircle } from "lucide-react";
import JSZip from "jszip";

interface ViewerProps {
  protectedDataAddress?: string;
}

const PortfolioViewer: React.FC<ViewerProps> = ({ protectedDataAddress }) => {
  interface PortfolioData {
    allocations: { token: string; percentage: number }[];
    timestamp: number;
  }

  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const iExecDataProtectorClient = new IExecDataProtector(window.ethereum);

  const fetchProtectedData = async () => {
    if (!protectedDataAddress) return;

    setIsLoading(true);
    setError("");

    try {
      await iExecDataProtectorClient.sharing.rentProtectedData({
        protectedData: protectedDataAddress,
        price: 0,
        duration: 60 * 60 * 24 * 30, // 30 days
      });
    } catch (err) {
      console.error("Error renting protected data:", err);
    }
    try {
      const result =
        await iExecDataProtectorClient.sharing.consumeProtectedData({
          protectedData: protectedDataAddress,
          app: process.env
            .NEXT_PUBLIC_VITE_PROTECTED_DATA_DELIVERY_DAPP_ADDRESS!,
          workerpool: process.env.NEXT_PUBLIC_VITE_DEMO_WORKERPOOL_ADDRESS!,
          onStatusUpdate: (status) => {
            console.log("[consumeProtectedData] status", status);
          },
        });

      // Create a new JSZip instance
      const zip = new JSZip();

      // Load the ZIP content
      const loadedZip = await zip.loadAsync(result.result);

      // Find and read the content file
      let content;
      for (const filename of Object.keys(loadedZip.files)) {
        if (filename === "content" || filename === "computed.json") {
          const file = loadedZip.files[filename];
          // Get the content as text
          content = await file.async("text");
          break;
        }
      }

      if (!content) {
        throw new Error("No content found in the protected data");
      }

      // Parse the content as JSON
      const parsedData = JSON.parse(content);
      setPortfolioData(parsedData);
    } catch (err) {
      console.error("Error processing protected data:", err);
      if (err instanceof Error) {
        // More specific error messages
        if (err.message.includes("No content found")) {
          setError("Protected data format is invalid or empty");
        } else if (err.message.includes("Unexpected token")) {
          setError("Protected data is not in the expected JSON format");
        } else {
          setError(`Failed to fetch portfolio data: ${err.message}`);
        }
      } else {
        setError("Failed to fetch portfolio data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Render the portfolio data in a nice format
  const renderPortfolioData = () => {
    if (!portfolioData) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Portfolio Allocation</h3>
          <div className="space-y-4">
            {portfolioData.allocations.map(
              (allocation: { token: string; percentage: number }) => (
                <div
                  key={allocation.token}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <img
                        src="/api/placeholder/24/24"
                        alt={allocation.token}
                        className="w-6 h-6"
                      />
                    </div>
                    <span className="font-medium">{allocation.token}</span>
                  </div>
                  <span className="text-blue-600 font-semibold">
                    {allocation.percentage}%
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Last updated: {new Date(portfolioData.timestamp).toLocaleString()}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* View Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Portfolio Viewer</h2>
          <button
            onClick={fetchProtectedData}
            disabled={isLoading || !protectedDataAddress}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
            View Portfolio
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {renderPortfolioData()}
      </div>
    </div>
  );
};

export default PortfolioViewer;
