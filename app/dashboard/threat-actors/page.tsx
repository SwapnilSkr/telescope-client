/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { ThreatActorDetail } from "@/components/ThreatActorDetail";
import { AddGroupModal } from "@/components/AddGroupModal";
import { BASE_URL } from "@/utils/baseUrl";
import { AddMultipleGroupsModal } from "@/components/AddMultipleGroupsModal";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 10;
const PAGINATION_BUTTONS_LIMIT = 10;

interface Group {
  id: string;
  name: string;
  type: string;
  status: "active" | "dormant" | "inactive";
  messageCount: number;
  lastMessage: {
    content: string;
    timestamp: string;
  };
}

export default function ThreatActorLibrary() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accessToken = localStorage.getItem("access_token");

  // Get params from URL
  const initialSearch = searchParams.get("keyword") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialStatus = searchParams.get("status") || "All";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  // States
  const [searchInput, setSearchInput] = useState<string>(initialSearch);
  const [searchKeyword, setSearchKeyword] = useState<string>(initialSearch);
  const [selectedType, setSelectedType] = useState<string>(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [groups, setGroups] = useState<Group[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isAddMultipleGroupsModalOpen, setIsAddMultipleGroupsModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(["All"]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/categories`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        const categoryNames = data.categories.map(
          (c: { category_name: string }) => c.category_name
        );
        setCategories(["All", ...categoryNames]); // Add "All" as default
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [accessToken]);

  // Handle URL changes and fetch data
  useEffect(() => {
    // Set initial loading state
    setLoading(true);
    
    // Get current params from URL
    const keyword = searchParams.get("keyword") || "";
    const category = searchParams.get("category") || "All";
    const status = searchParams.get("status") || "All";
    const page = parseInt(searchParams.get("page") || "1", 10);
    
    // Update state with URL values (without triggering effects)
    setSearchKeyword(keyword);
    setSearchInput(keyword);
    setSelectedType(category);
    setSelectedStatus(status);
    setCurrentPage(page);
    
    // Fetch data based on URL parameters
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (keyword) params.set("keyword", keyword);
        if (category !== "All") params.set("category", category);
        if (status !== "All") params.set("status", status);
        params.set("page", page.toString());
        params.set("limit", ITEMS_PER_PAGE.toString());
        
        const response = await fetch(
          `${BASE_URL}/groups/search?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        
        if (!response.ok) throw new Error("Failed to fetch groups");
        
        const data = await response.json();
        setGroups(data.groups);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [searchParams, accessToken]);

  // Handler functions - these update the URL which triggers the data fetch
  const handleTypeChange = (value: string) => {
    updateUrlParams({
      category: value,
      page: "1" // Reset to page 1
    });
  };

  const handleStatusChange = (value: string) => {
    updateUrlParams({
      status: value,
      page: "1" // Reset to page 1
    });
  };

  const handlePageChange = (page: number) => {
    updateUrlParams({
      page: page.toString()
    });
  };

  const handleSearch = () => {
    updateUrlParams({
      keyword: searchInput,
      page: "1" // Reset to page 1
    });
  };
  
  // Helper function to update URL params
  const updateUrlParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === "All") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    // Navigate to new URL
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="text-white min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Threat Actor Library</h1>
      </div>

      {/* Search & Filters Section - all on one line for large screens */}
      <div className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
        {/* Search bar */}
        <div className="relative flex items-center w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="search threat actors"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 bg-[#020017] border-none text-white focus:outline-none focus:ring-0"
            style={{
              borderRadius: "136.083px",
              border: "1.389px solid rgba(255, 255, 255, 0.15)",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>

        {/* Filter by Type */}
        <div className="flex-1 w-full md:w-auto">
          <p className="text-sm text-gray-400 mb-2">Filter by Type</p>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger
              className="w-full bg-[#191927] border-none text-white"
              style={{
                borderRadius: "40px",
                background: "rgba(160, 83, 216, 0.30)",
              }}
            >
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#191927] text-white border-gray-700">
              {categories.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter by Status */}
        <div className="flex-1 w-full md:w-auto">
          <p className="text-sm text-gray-400 mb-2">Filter by Status</p>
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger
              className="w-full bg-[#191927] border-none text-white"
              style={{
                borderRadius: "40px",
                background: "rgba(160, 83, 216, 0.30)",
              }}
            >
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#191927] text-white border-gray-700">
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="dormant">Dormant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Header and Content */}
      <div
        className="bg-[#141429] rounded-[26px] overflow-hidden mt-[30px]"
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        {/* Table Header */}
        <div
          className="bg-[#1A1E38] grid grid-cols-12 gap-4 md:gap-6 py-4 px-6 text-[#DFDFDF]"
          style={{
            borderRadius: "26px 26px 0px 0px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <div className="col-span-6">Threat Actor</div>
          <div className="col-span-3">Type</div>
          <div className="col-span-3">Current Status</div>
        </div>

        {/* Display Groups */}
        {loading ? (
          <div>
            {/* Loading skeletons */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div 
                key={index}
                className="grid grid-cols-12 gap-4 md:gap-6 py-5 px-6 bg-[#14152E] relative"
              >
                {/* Threat Actor Name Skeleton */}
                <div className="col-span-6">
                  <Skeleton className="h-7 w-3/4 bg-[#1c1c36]" />
                </div>

                {/* Type Skeleton */}
                <div className="col-span-3 flex items-center">
                  <Skeleton className="h-6 w-24 rounded-full bg-[#1c1c36]" />
                </div>

                {/* Status Skeleton */}
                <div className="col-span-3">
                  <Skeleton className="h-6 w-20 rounded-full bg-[#1c1c36]" />
                </div>

                {/* Bottom border */}
                <div
                  className="absolute bottom-0 left-[2.5%] right-[2.5%] w-[95%] h-[1px] bg-gradient-to-r from-white/15 to-white/10"
                  style={{ opacity: 0.4 }}
                ></div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {groups.length === 0 ? (
              <div className="py-8">
                <p className="text-center text-gray-500">No groups found.</p>
              </div>
            ) : (
              groups.map((group) => (
                <Sheet key={group.id}>
                  <SheetTrigger asChild>
                    <div className="grid grid-cols-12 gap-4 md:gap-6 py-5 px-6 hover:bg-[#1c1c36] bg-[#14152E] cursor-pointer relative">
                      {/* Threat Actor Name */}
                      <div className="col-span-6">
                        <p className="font-medium text-lg">{group.name}</p>
                      </div>

                      {/* Type (Tags) */}
                      <div className="col-span-3 flex items-center">
                        <Badge
                          className="px-3 py-1 text-xs"
                          style={{
                            backgroundColor: "rgba(66, 12, 105, 0.84)",
                            border: "0.426px solid rgba(255, 255, 255, 0.16)",
                            borderRadius: "80px",
                            color: "#A958E3",
                          }}
                        >
                          {group.type}
                        </Badge>
                      </div>

                      {/* Status */}
                      <div className="col-span-3">
                        <Badge
                          className={`px-3 py-1 text-xs ${
                            group.status === "active"
                              ? "bg-red-800/50 text-red-400"
                              : "bg-gray-700/50 text-gray-300"
                          }`}
                          style={{
                            borderRadius: "80px",
                          }}
                        >
                          {group.status === "active" ? "Active" : "Dormant"}
                        </Badge>
                      </div>

                      {/* Bottom border */}
                      <div
                        className="absolute bottom-0 left-[2.5%] right-[2.5%] w-[95%] h-[1px] bg-gradient-to-r from-white/15 to-white/10"
                        style={{
                          opacity: 0.4,
                        }}
                      ></div>
                    </div>
                  </SheetTrigger>
                  <SheetContent
                    className="w-[90vw] sm:max-w-[600px] lg:max-w-[50vw] bg-[#191927] text-white border-gray-800 p-0"
                    side="right"
                  >
                    <ThreatActorDetail actor={group} />
                  </SheetContent>
                </Sheet>
              ))
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-1">
            <button
              className="px-3 py-1 rounded text-[#B34AFE] cursor-pointer flex items-center"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Previous
            </button>

            {(() => {
              // Calculate the range of page numbers to display
              let startPage = Math.max(
                1,
                currentPage - Math.floor(PAGINATION_BUTTONS_LIMIT / 2)
              );
              const endPage = Math.min(
                totalPages,
                startPage + PAGINATION_BUTTONS_LIMIT - 1
              );

              // Adjust startPage if we're near the end
              if (endPage - startPage + 1 < PAGINATION_BUTTONS_LIMIT) {
                startPage = Math.max(1, endPage - PAGINATION_BUTTONS_LIMIT + 1);
              }

              return Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
              ).map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    currentPage === page
                      ? "bg-[#111427] text-white"
                      : "text-gray-400 hover:bg-[#111427]"
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ));
            })()}

            <button
              className="px-3 py-1 rounded text-[#B34AFE] cursor-pointer flex items-center"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddGroupModal
        isOpen={isAddGroupModalOpen}
        setIsOpen={setIsAddGroupModalOpen}
      />
      <AddMultipleGroupsModal
        isOpen={isAddMultipleGroupsModalOpen}
        setIsOpen={setIsAddMultipleGroupsModalOpen}
      />
    </div>
  );
}
