"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import useUserStore from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, fetchUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const loadUser = async () => {
      await fetchUser();
      setIsLoading(false); // Loading is done once the user data is fetched
    };
    loadUser();
  }, [fetchUser]);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-gray-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-xl font-semibold text-gray-800">Access Denied</h1>
          <p className="text-gray-600 text-center">
            You must be logged in to view this page. Please log in to continue.
          </p>
          <Button
            className="px-6 py-2 text-white"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
