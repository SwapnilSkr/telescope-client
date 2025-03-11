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
import { Search } from "lucide-react";
import { BASE_URL } from "@/utils/baseUrl";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Image from "next/image";

const ITEMS_PER_PAGE = 10;

interface Alert {
  _id: string;
  text: string;
  alert_types: string[];
  is_notified: boolean;
  date_detected: string;
  source: string;
  media_url?: string;
}

export default function AlertLogs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accessToken = localStorage.getItem("access_token");

  // Get params from URL
  const initialSearch = searchParams.get("keyword") || "";
  const initialType = searchParams.get("alert_type") || "All";
  const initialNotified = searchParams.get("notified") || "All";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  // States
  const [searchInput, setSearchInput] = useState<string>(initialSearch);
  const [searchKeyword, setSearchKeyword] = useState<string>(initialSearch);
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [selectedNotified, setSelectedNotified] =
    useState<string>(initialNotified);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [alertTypes, setAlertTypes] = useState<string[]>(["All"]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Fetch alert types for the dropdown
  useEffect(() => {
    const fetchAlertTypes = async () => {
      try {
        const response = await fetch(`${BASE_URL}/alert-types`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch alert types");

        const data = await response.json();
        setAlertTypes(["All", ...data]);
      } catch (error) {
        console.error("Error fetching alert types:", error);
      }
    };
    fetchAlertTypes();
  }, [accessToken]);

  // Fetch alerts from the API
  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchKeyword) params.set("keyword", searchKeyword);
      if (selectedType !== "All") params.set("alert_type", selectedType);
      if (selectedNotified !== "All") params.set("notified", selectedNotified);
      params.set("page", currentPage.toString());
      params.set("limit", ITEMS_PER_PAGE.toString());

      const response = await fetch(
        `${BASE_URL}/alerts-by-user?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch alerts");

      const data = await response.json();
      setAlerts(data.alerts);
      setTotalPages(data.total_pages);
      setTotalCount(data.total_count);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
    setLoading(false);
  }, [searchKeyword, selectedType, selectedNotified, currentPage, accessToken]);

  // Update query params in URL
  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    if (searchKeyword) params.set("keyword", searchKeyword);
    if (selectedType !== "All") params.set("alert_type", selectedType);
    if (selectedNotified !== "All") params.set("notified", selectedNotified);
    params.set("page", currentPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchKeyword, selectedType, selectedNotified, currentPage, router]);

  // Initial load and URL parameter changes
  useEffect(() => {
    // Update state based on URL parameters when they change
    const keyword = searchParams.get("keyword") || "";
    const alertType = searchParams.get("alert_type") || "All";
    const notified = searchParams.get("notified") || "All";
    const page = parseInt(searchParams.get("page") || "1", 10);

    // Only update state if values are different from current state
    if (searchKeyword !== keyword) setSearchKeyword(keyword);
    if (searchInput !== keyword) setSearchInput(keyword);
    if (selectedType !== alertType) setSelectedType(alertType);
    if (selectedNotified !== notified) setSelectedNotified(notified);
    if (currentPage !== page) setCurrentPage(page);
  }, [searchParams]);

  // Fetch alerts when filter parameters change
  useEffect(() => {
    fetchAlerts();
    updateQueryParams();
  }, [
    searchKeyword,
    selectedType,
    selectedNotified,
    currentPage,
    fetchAlerts,
    updateQueryParams,
  ]);

  // Handle search button click
  const handleSearch = () => {
    setSearchKeyword(searchInput);
    setCurrentPage(1);
  };

  // Mark alert as read
  const markAsRead = async (alertId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/mark-alert-read/${alertId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to mark alert as read");

      // Update the local state
      setAlerts(
        alerts.map((alert) =>
          alert._id === alertId ? { ...alert, status: "read" } : alert
        )
      );
    } catch (error) {
      console.error("Error marking alert as read:", error);
    }
  };

  // Get threat level badge color
  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-800/50 text-red-400";
      case "medium":
        return "bg-yellow-800/50 text-yellow-400";
      case "low":
        return "bg-green-800/50 text-green-400";
      default:
        return "bg-gray-700/50 text-gray-300";
    }
  };

  return (
    <div className="text-white min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Alert Logs</h1>
      </div>

      {/* Search & Filters Section */}
      <div className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
        {/* Search bar */}
        <div className="relative flex items-center w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search alerts"
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
          <Select 
            value={selectedType} 
            onValueChange={(value) => {
              setSelectedType(value);
              setCurrentPage(1);
            }}
          >
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
              {alertTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter by Status */}
        <div className="flex-1 w-full md:w-auto">
          <p className="text-sm text-gray-400 mb-2">Filter by Notified</p>
          <Select 
            value={selectedNotified} 
            onValueChange={(value) => {
              setSelectedNotified(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger
              className="w-full bg-[#191927] border-none text-white"
              style={{
                borderRadius: "40px",
                background: "rgba(160, 83, 216, 0.30)",
              }}
            >
              <SelectValue placeholder="Filter by Notified" />
            </SelectTrigger>
            <SelectContent className="bg-[#191927] text-white border-gray-700">
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="false">False</SelectItem>
              <SelectItem value="true">True</SelectItem>
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
          <div className="col-span-5 md:col-span-5">Alert Content</div>
          <div className="col-span-3 md:col-span-2">Type</div>
          <div className="col-span-3 md:col-span-2">Notified</div>
          <div className="col-span-1 md:col-span-1 hidden sm:block">Date</div>
        </div>

        {/* Display Alerts */}
        {loading ? (
          <div>
            {/* Loading skeletons */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 md:gap-6 py-5 px-6 bg-[#14152E] relative"
              >
                {/* Alert Content Skeleton */}
                <div className="col-span-5 md:col-span-5">
                  <Skeleton className="h-7 w-3/4 bg-[#1c1c36]" />
                </div>

                {/* Type Skeleton */}
                <div className="col-span-3 md:col-span-2 flex items-center">
                  <Skeleton className="h-6 w-24 rounded-full bg-[#1c1c36]" />
                </div>

                {/* Threat Level Skeleton */}
                <div className="col-span-3 md:col-span-2">
                  <Skeleton className="h-6 w-20 rounded-full bg-[#1c1c36]" />
                </div>

                {/* Date Skeleton */}
                <div className="col-span-1 md:col-span-1 hidden sm:block">
                  <Skeleton className="h-6 w-16 bg-[#1c1c36]" />
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
            {alerts.length === 0 ? (
              <div className="py-8">
                <p className="text-center text-gray-500">No alerts found.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <Sheet key={alert._id}>
                  <SheetTrigger asChild>
                    <div
                      className="grid grid-cols-12 gap-4 md:gap-6 py-5 px-6 hover:bg-[#1c1c36] bg-[#14152E] cursor-pointer relative"
                      onClick={() => {
                        setSelectedAlert(alert);
                      }}
                    >
                      {/* Alert Content */}
                      <div className="col-span-5 md:col-span-5">
                        <p className="font-medium text-lg truncate">
                          {alert.text.length > 60
                            ? `${alert.text.substring(0, 60)}...`
                            : alert.text}
                        </p>
                      </div>

                      {/* Type */}
                      <div className="col-span-3 md:col-span-2 flex items-center flex-wrap gap-1">
                        {alert.alert_types.length > 0 &&
                          alert.alert_types.map((type) => (
                            <Badge
                              key={type}
                              className="px-2 sm:px-3 py-1 text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                              style={{
                                backgroundColor: "rgba(66, 12, 105, 0.84)",
                                border:
                                  "0.426px solid rgba(255, 255, 255, 0.16)",
                                borderRadius: "80px",
                                color: "#A958E3",
                              }}
                            >
                              {type}
                            </Badge>
                          ))}
                      </div>

                      {/* Status */}
                      <div className="col-span-3 md:col-span-2">
                        <Badge
                          className={`px-2 sm:px-3 py-1 text-xs ${
                            alert.is_notified === false
                              ? "bg-blue-800/50 text-blue-400"
                              : "bg-gray-700/50 text-gray-300"
                          }`}
                          style={{
                            borderRadius: "80px",
                          }}
                        >
                          {alert.is_notified === false ? "False" : "True"}
                        </Badge>
                      </div>

                      {/* Date */}
                      <div className="col-span-1 md:col-span-1 text-sm text-gray-400 hidden sm:block">
                        {format(new Date(alert.date_detected), "MM/dd/yy")}
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
                    <AlertDetail alert={alert} />
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
              className={`px-3 py-1 rounded flex items-center ${
                currentPage === 1
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-[#B34AFE] cursor-pointer"
              }`}
              onClick={() => {
                if (currentPage > 1) setCurrentPage((prev) => prev - 1);
              }}
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
              // Calculate which page numbers to show
              let startPage = Math.max(1, currentPage - 2);
              const endPage = Math.min(totalPages, startPage + 4);

              // Adjust if we're near the end
              if (endPage - startPage < 4) {
                startPage = Math.max(1, endPage - 4);
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
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ));
            })()}

            <button
              className={`px-3 py-1 rounded flex items-center ${
                currentPage === totalPages
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-[#B34AFE] cursor-pointer"
              }`}
              onClick={() => {
                if (currentPage < totalPages)
                  setCurrentPage((prev) => prev + 1);
              }}
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
    </div>
  );
}

// Alert Detail Component for the Sheet
function AlertDetail({ alert }: { alert: Alert }) {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Alert Details</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {alert.alert_types.length > 0 &&
            alert.alert_types.map((type) => (
              <Badge
                key={type}
                className="px-3 py-1"
                style={{
                  backgroundColor: "rgba(66, 12, 105, 0.84)",
                  border: "0.426px solid rgba(255, 255, 255, 0.16)",
                  borderRadius: "80px",
                  color: "#A958E3",
                }}
              >
                {type}
              </Badge>
            ))}

          <Badge
            className={`px-3 py-1 ${
              alert.is_notified === false
                ? "bg-blue-800/50 text-blue-400"
                : "bg-gray-700/50 text-gray-300"
            }`}
            style={{
              borderRadius: "80px",
            }}
          >
            {alert.is_notified === false ? "False" : "True"}
          </Badge>
        </div>

        <div className="text-sm text-gray-400 mb-2">
          {format(new Date(alert.date_detected), "MMMM dd, yyyy 'at' h:mm a")}
        </div>

        <div className="text-sm text-gray-400 mb-6">Source: {alert.source}</div>
      </div>

      <div className="bg-[#14152E] p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Alert Content</h3>
        <p className="text-gray-300 whitespace-pre-wrap">
          {alert.text || "No content available"}
        </p>
      </div>

      <div className="mt-6">
        {alert.media_url && (
          <>
            <h3 className="text-lg font-medium mb-2">Media</h3>
            <Image
              src={alert.media_url}
              alt="Alert Media"
              className="rounded-lg"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "100%"}}
            />
          </>
        )}
      </div>
    </div>
  );
}
