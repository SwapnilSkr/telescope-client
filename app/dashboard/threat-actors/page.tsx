/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { ThreatActorDetail } from "@/components/ThreatActorDetail";
import { AddGroupModal } from "@/components/AddGroupModal";
import { BASE_URL } from "@/utils/baseUrl";

const ITEMS_PER_PAGE = 10;

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

  // Get params from URL
  const initialSearch = searchParams.get("keyword") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialStatus = searchParams.get("status") || "All";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  // States
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>(initialSearch);
  const [selectedType, setSelectedType] = useState<string>(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [groups, setGroups] = useState<Group[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(["All"]);

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/categories`);
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
  }, []);

  // Fetch groups from the API
  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchKeyword) params.set("keyword", searchKeyword);
      if (selectedType !== "All") params.set("category", selectedType);
      if (selectedStatus !== "All") params.set("status", selectedStatus);
      params.set("page", currentPage.toString());
      params.set("limit", ITEMS_PER_PAGE.toString());

      const response = await fetch(
        `${BASE_URL}/groups/search?${params.toString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch groups");

      const data = await response.json();
      setGroups(data.groups);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
    setLoading(false);
  }, [searchKeyword, selectedType, selectedStatus, currentPage]);

  // Update query params in URL
  const updateQueryParams = () => {
    const params = new URLSearchParams();
    if (searchKeyword) params.set("keyword", searchKeyword);
    if (selectedType !== "All") params.set("category", selectedType);
    if (selectedStatus !== "All") params.set("status", selectedStatus);
    params.set("page", currentPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Fetch groups when parameters change
  useEffect(() => {
    fetchGroups();
    updateQueryParams();
  }, [fetchGroups]);

  // Handle search button click
  const handleSearch = () => {
    setSearchKeyword(searchInput);
    setCurrentPage(1);
  };

  // Get card color based on status
  const getCardColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 hover:bg-green-100";
      case "dormant":
        return "bg-yellow-50 hover:bg-yellow-100";
      case "inactive":
        return "bg-red-50 hover:bg-red-100";
      default:
        return "bg-gray-50 hover:bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Threat Actor Library</h1>
        <Button onClick={() => setIsAddGroupModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add a Group
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="flex-1 flex space-x-2">
          <Input
            placeholder="Search groups..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Filter by Type */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Type
          </label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort By Type" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter by Status */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort By Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="dormant">Dormant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Display Groups */}
      {loading ? (
        <p className="text-center text-gray-500">Loading groups...</p>
      ) : (
        <div className="space-y-4">
          {groups.length === 0 ? (
            <p className="text-center text-gray-500">No groups found.</p>
          ) : (
            groups.map((group) => (
              <Sheet key={group.id}>
                <SheetTrigger asChild>
                  <Card
                    className={`cursor-pointer transition-colors shadow-md ${getCardColor(group.status)}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{group.name}</span>
                        <Badge
                          variant="outline"
                          className="text-black bg-white"
                        >
                          {group.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="text-black bg-white">
                        {group.type}
                      </Badge>
                    </CardContent>
                  </Card>
                </SheetTrigger>
                <SheetContent>
                  <ThreatActorDetail actor={group} />
                </SheetContent>
              </Sheet>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <AddGroupModal
        isOpen={isAddGroupModalOpen}
        setIsOpen={setIsAddGroupModalOpen}
      />
    </div>
  );
}
