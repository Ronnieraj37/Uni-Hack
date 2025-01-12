"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import LandingPage from "../pages/LandingPage"; // Move your LandingPage component to components folder

export default function Dashboard() {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const [role, setrole] = useState<"investor" | "user" | null>(null);
  const [verified, setverified] = useState(false);

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
      console.log("Data", data);
      if (data.status !== "AUTHENTICATED") {
        router.push("/login");
      }
      setverified(true);
      setrole(data.user.role.toLowerCase());
    } catch (error) {
      console.log("Auth verification failed:", error);
    }
  };

  useEffect(() => {
    if (!verified) verifyAuth();
  }, []);

  return <LandingPage userType={role} />;
}
