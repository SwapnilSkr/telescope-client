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
import { Search, Trash2 } from "lucide-react";
import { BASE_URL } from "@/utils/baseUrl";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Image from "next/image";
import { toast, Toaster } from "sonner";

const ITEMS_PER_PAGE = 10;

interface Alert {
  _id: string;
  text: string;
  alert_types: string[];
  is_notified: boolean;
  date_detected: string;
  source: string;
  media_url?: string;
  matched_keywords: Array<{
    type: string;
    value: string;
  }>;
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
  const [alertToDelete, setAlertToDelete] = useState<Alert | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

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
      console.log(data);
      setAlerts(data.alerts);
      setTotalPages(data.total_pages);
      setTotalCount(data.total_count);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      toast.error("Failed to fetch alerts", {
        description: "There was a problem fetching your alerts. Please try again."
      });
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

  // Delete alert
  const handleDeleteClick = (e: React.MouseEvent, alert: Alert) => {
    e.stopPropagation(); // Prevent opening the sheet
    setAlertToDelete(alert);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!alertToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`${BASE_URL}/delete-alert/${alertToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete alert");
      }

      // Update local state to remove the deleted alert
      setAlerts(alerts.filter((alert) => alert._id !== alertToDelete._id));
      
      // Show success toast
      toast.success("Alert Deleted", {
        description: "The alert has been successfully deleted.",
      });
      
      // Close modal
      setIsDeleteModalOpen(false);
      setAlertToDelete(null);
      
      // If we deleted the last item on the page and there are more pages, go to the previous page
      if (alerts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        // Otherwise, just refresh the current page
        fetchAlerts();
      }
    } catch (error) {
      console.error("Error deleting alert:", error);
      toast.error("Delete Failed", {
        description: error instanceof Error ? error.message : "Failed to delete alert. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setAlertToDelete(null);
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
      {/* Toast notifications */}
      <Toaster position="top-right" richColors />
      
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
          <div className="col-span-3 md:col-span-2">Alert Content</div>
          <div className="col-span-2 md:col-span-2">Keyword</div>
          <div className="col-span-2 md:col-span-2">Type</div>
          <div className="col-span-2 md:col-span-2">Alert Type</div>
          <div className="col-span-2 md:col-span-2">Notified</div>
          <div className="col-span-2 md:col-span-1 hidden sm:block">Date</div>
          <div className="col-span-1 text-center">Actions</div>
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
                <div className="col-span-3 md:col-span-2">
                  <Skeleton className="h-7 w-full bg-[#1c1c36]" />
                </div>

                {/* Keyword Skeleton */}
                <div className="col-span-2 md:col-span-2">
                  <Skeleton className="h-6 w-full rounded-full bg-[#1c1c36]" />
                </div>

                {/* Keyword Type Skeleton */}
                <div className="col-span-2 md:col-span-2">
                  <Skeleton className="h-6 w-full rounded-full bg-[#1c1c36]" />
                </div>

                {/* Alert Type Skeleton */}
                <div className="col-span-2 md:col-span-2">
                  <Skeleton className="h-6 w-full rounded-full bg-[#1c1c36]" />
                </div>

                {/* Notified Skeleton */}
                <div className="col-span-2 md:col-span-2">
                  <Skeleton className="h-6 w-full rounded-full bg-[#1c1c36]" />
                </div>

                {/* Date Skeleton */}
                <div className="col-span-2 md:col-span-1 hidden sm:block">
                  <Skeleton className="h-6 w-full bg-[#1c1c36]" />
                </div>
                
                {/* Actions Skeleton */}
                <div className="col-span-1 flex justify-center">
                  <Skeleton className="h-8 w-8 rounded-full bg-[#1c1c36]" />
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
                      <div className="col-span-3 md:col-span-2">
                        <p className="font-medium text-sm md:text-base truncate">
                          {alert.text ? alert.text.length > 40
                            ? `${alert.text.substring(0, 40)}...`
                            : alert.text : "No text messages found"}
                        </p>
                      </div>

                      {/* Keyword */}
                      <div className="col-span-2 md:col-span-2">
                        <Badge
                          className="px-2 sm:px-3 py-1 text-xs whitespace-nowrap overflow-hidden text-ellipsis w-full"
                          style={{
                            backgroundColor: "rgba(66, 12, 105, 0.84)",
                            border: "0.426px solid rgba(255, 255, 255, 0.16)",
                            borderRadius: "80px",
                            color: "#A958E3",
                          }}
                        >
                          {alert.matched_keywords?.[0]?.value || "N/A"}
                        </Badge>
                      </div>

                      {/* Keyword Type */}
                      <div className="col-span-2 md:col-span-2">
                        <Badge
                          className="px-2 sm:px-3 py-1 text-xs whitespace-nowrap overflow-hidden text-ellipsis w-full"
                          style={{
                            backgroundColor: "rgba(66, 12, 105, 0.84)",
                            border: "0.426px solid rgba(255, 255, 255, 0.16)",
                            borderRadius: "80px",
                            color: "#A958E3",
                          }}
                        >
                          {alert.matched_keywords?.[0]?.type || "N/A"}
                        </Badge>
                      </div>

                      {/* Alert Type */}
                      <div className="col-span-2 md:col-span-2 flex items-center flex-wrap gap-1">
                        {alert.alert_types.length > 0 &&
                          alert.alert_types.map((type) => (
                            <Badge
                              key={type}
                              className="px-2 sm:px-3 py-1 text-xs whitespace-nowrap overflow-hidden text-ellipsis w-full"
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
                      </div>

                      {/* Status */}
                      <div className="col-span-2 md:col-span-2">
                        <Badge
                          className={`px-2 sm:px-3 py-1 text-xs w-full ${
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
                      <div className="col-span-2 md:col-span-1 text-sm text-gray-400 hidden sm:block">
                        {format(new Date(alert.date_detected), "MM/dd/yy")}
                      </div>
                      
                      {/* Actions */}
                      <div className="col-span-1 flex justify-center items-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                          onClick={(e) => handleDeleteClick(e, alert)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#191927] rounded-lg w-full max-w-sm p-6 border border-gray-800">
            <h3 className="text-xl font-semibold mb-4">Delete Alert</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this alert? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={cancelDelete}
                className="bg-[#191927] border-gray-600 text-white hover:bg-gray-800"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </div>
                ) : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Alert Detail Component for the Sheet
function AlertDetail({ alert }: { alert: Alert }) {
  const accessToken = localStorage.getItem("access_token");
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this alert? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        const response = await fetch(`${BASE_URL}/delete-alert/${alert._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to delete alert");
        }

        toast.success("Alert Deleted", {
          description: "The alert has been successfully deleted.",
        });
        
        // Close the sheet after deletion
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        
        // Wait a moment for the sheet to close, then refresh the alerts
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error("Error deleting alert:", error);
        toast.error("Delete Failed", {
          description: error instanceof Error ? error.message : "Failed to delete alert. Please try again.",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold mb-4">Alert Details</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting...
              </div>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Alert
              </>
            )}
          </Button>
        </div>

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
