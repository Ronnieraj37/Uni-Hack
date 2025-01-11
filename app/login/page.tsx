"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Wallet, ArrowRight } from "lucide-react";
import React from "react";

const LoginPage = () => {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const [userType, setUserType] = useState<"INVESTOR" | "USER" | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleRegistration = async () => {
    if (!address || !userType) return;

    try {
      setIsRegistering(true);
      setError("");

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          role: userType,
          name,
          email,
        }),
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
        // After successful registration, check auth status
        const authResponse = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });

        const authData = await authResponse.json();

        if (authData.status === "AUTHENTICATED") {
          router.push("/dashboard");
        }
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const checkExistingUser = async () => {
    if (!address) return;

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
        }),
      });

      const data = await response.json();

      if (data.status === "AUTHENTICATED") {
        router.push("/");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      checkExistingUser();
    }
  }, [isConnected, address]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome to DAPP</h2>
          <p className="mt-2 text-gray-600">
            Connect your wallet to get started
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {isConnected && !userType ? (
          <div className="space-y-4">
            <p className="text-center text-gray-600">Choose your role:</p>
            <button
              onClick={() => setUserType("INVESTOR")}
              className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              Continue as Investor
            </button>
            <button
              onClick={() => setUserType("USER")}
              className="w-full px-4 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50"
            >
              Continue as User
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <button
              onClick={handleRegistration}
              disabled={!name || isRegistering}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegistering ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Complete Registration
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        )}

        {isConnected && (
          <div className="text-center text-sm text-gray-500">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
