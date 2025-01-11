"use client";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import LandingPage from "../pages/LandingPage"; // Move your LandingPage component to components folder

export default function Dashboard() {
  const { isConnected, address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isConnected || !address) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });

        const data = await response.json();

        if (data.status !== "AUTHENTICATED") {
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        router.push("/login");
      }
    };

    verifyAuth();
  }, [isConnected, address, router]);

  return <LandingPage />;
}
