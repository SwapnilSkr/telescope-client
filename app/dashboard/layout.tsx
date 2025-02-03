"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import useUserStore from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/dashboard/mobile-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, fetchUser } = useUserStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
      <Sidebar className="hidden md:flex" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </header>
        <MobileMenu
          open={mobileMenuOpen}
          setOpen={setMobileMenuOpen}
          ref={mobileMenuRef}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
