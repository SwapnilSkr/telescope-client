/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostDetail } from "@/components/PostDetail";
import { BASE_URL } from "@/utils/baseUrl";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 10;
const PAGINATION_BUTTONS_LIMIT = 10;

interface Media {
  type: "image" | "video" | "file";
  url: string;
  alt?: string;
  thumbnail?: string;
  name?: string;
}

interface Post {
  id: string;
  message_id: number;
  group_id: number;
  channel: string;
  timestamp: string;
  content: string;
  tags: string[];
  media?: Media;
  has_previous: boolean;
}

interface Group {
  _id: string;
  group_id: string;
  title: string;
}

export default function RealTimeFeed() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accessToken = localStorage.getItem("access_token");

  // Single source of truth - URL parameters
  const getParamValue = useCallback(
    (key: string, defaultValue: string = "") => {
      return searchParams.get(key) || defaultValue;
    },
    [searchParams]
  );

  const getParamValues = useCallback(
    (key: string) => {
      return searchParams.getAll(key);
    },
    [searchParams]
  );

  // Derived state from URL parameters
  const [searchInput, setSearchInput] = useState<string>(
    getParamValue("keyword")
  );
  const [groupSearch, setGroupSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingGroups, setLoadingGroups] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [loadingPrevious, setLoadingPrevious] = useState<boolean>(false);

  // Fetch posts based on URL parameters
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      // Get parameters directly from URL for consistency
      const currentSortBy = getParamValue("sortBy", "latest");
      const currentPage = getParamValue("page", "1");
      const currentLimit = getParamValue("limit", ITEMS_PER_PAGE.toString());

      // Create a new URLSearchParams object
      const params = new URLSearchParams();

      // Set parameters explicitly with consistent names
      params.set("sortOrder", currentSortBy);
      params.set("page", currentPage);
      params.set("limit", currentLimit);

      // Add keyword if it exists
      const keyword = getParamValue("keyword");
      if (keyword) {
        params.set("keyword", keyword);
      }

      // Add group_ids if they exist
      const groupIds = getParamValues("group_ids");
      groupIds.forEach((id) => {
        params.append("group_ids", id);
      });

      console.log(
        `Fetching with sort order: ${currentSortBy}, page: ${currentPage}`
      );

      const response = await fetch(
        `${BASE_URL}/messages/search?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      setPosts(data.messages);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [searchParams, accessToken, getParamValue, getParamValues]);

  // Fetch groups from the API
  const fetchGroups = useCallback(async () => {
    setLoadingGroups(true);
    try {
      const response = await fetch(`${BASE_URL}/groups`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch groups");

      const data = await response.json();
      setGroups(data.groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setGroups([]);
    } finally {
      setLoadingGroups(false);
    }
  }, [accessToken]);

  // Fetch posts whenever URL parameters change
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Fetch groups once on component mount
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Update URL with new parameters
  const updateUrlParams = useCallback(
    (
      updates: Record<string, string | number | null>,
      resetPage: boolean = false
    ) => {
      // Set loading first to prevent multiple fetches
      setLoading(true);

      const params = new URLSearchParams(window.location.search);

      // Apply all updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Reset page to 1 if requested
      if (resetPage) {
        params.set("page", "1");
      }

      // Use replace to avoid adding to history stack
      router.replace(`?${params.toString()}`, { scroll: false });

      // fetchPosts will be called by the useEffect watching searchParams
    },
    [router]
  );

  // Handle search submission
  const handleSearch = () => {
    updateUrlParams({ keyword: searchInput || null }, true);
  };

  // Handle sort change - prevent multiple fetches
  const handleSortChange = (value: "latest" | "oldest") => {
    updateUrlParams({
      sortBy: value,
      page: 1, // Reset to page 1 when changing sort order
    });
    // No need to manually call fetchPosts - URL change will trigger it
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (loading) return; // Prevent multiple clicks during loading
    updateUrlParams({ page });
  };

  // Handle group selection
  const handleGroupSelection = (groupIds: string[]) => {
    if (loading) return; // Prevent actions during loading

    const params = new URLSearchParams(window.location.search);

    // Remove all existing group_ids
    params.delete("group_ids");

    // Add new group_ids
    groupIds.forEach((id) => {
      params.append("group_ids", id);
    });

    // Reset to page 1
    params.set("page", "1");

    // Set loading to prevent multiple triggers
    setLoading(true);

    // Update URL - fetchPosts will be triggered by the URL change
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Truncate content for display - character limit
  const truncateContent = (content: string, charLimit: number): string => {
    return content.length > charLimit
      ? content.substring(0, charLimit) + "..."
      : content;
  };

  const filteredGroups = useMemo(() => {
    return groups.filter((group) =>
      group.title.toLowerCase().includes(groupSearch.toLowerCase())
    );
  }, [groups, groupSearch]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const socketInstance = io(BASE_URL, {
      path: "/socket.io/",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected");
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.off("connect");
        socketInstance.off("disconnect");
        socketInstance.off("connect_error");
        socketInstance.off("new_messages");
        socketInstance.disconnect();
      }
    };
  }, []);

  // Handle real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on("new_messages", (data) => {
      console.log("New messages received:", data);

      if (data?.data && Array.isArray(data.data)) {
        // Skip updates during active loading or on paginated views
        if (loading || parseInt(getParamValue("page", "1"), 10) > 1) {
          console.log(
            "Skipping real-time update - loading or not on first page"
          );
          return;
        }

        // Group messages by group_id and get latest per group
        const groupedNewMessages = data.data.reduce(
          (acc: Record<number, any[]>, message: any) => {
            if (!acc[message.group_id]) {
              acc[message.group_id] = [];
            }
            acc[message.group_id].push(message);
            return acc;
          },
          {} as Record<number, any[]>
        );

        const latestGroupMessages = Object.keys(groupedNewMessages).map(
          (groupId) => {
            const groupMessages = groupedNewMessages[parseInt(groupId)];
            return groupMessages.sort(
              (a: any, b: any) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )[0];
          }
        );

        // Update the posts state
        setPosts((prevPosts) => {
          // Get existing posts by group_id
          const existingPostsByGroup = prevPosts.reduce(
            (acc: Record<number, Post>, post) => {
              acc[post.group_id] = post;
              return acc;
            },
            {} as Record<number, Post>
          );

          // Merge new messages, keeping only the latest per group
          latestGroupMessages.forEach((newMessage: any) => {
            const existingPost = existingPostsByGroup[newMessage.group_id];
            if (
              !existingPost ||
              new Date(newMessage.timestamp) > new Date(existingPost.timestamp)
            ) {
              existingPostsByGroup[newMessage.group_id] = {
                ...newMessage,
                has_previous: true,
              };
            }
          });

          // Get current sort order and limit
          const currentSortBy = getParamValue("sortBy", "latest") as
            | "latest"
            | "oldest";
          const currentLimit = parseInt(
            getParamValue("limit", ITEMS_PER_PAGE.toString()),
            10
          );

          // Return properly sorted results
          return Object.values(existingPostsByGroup)
            .sort((a: Post, b: Post) => {
              const timeA = new Date(a.timestamp).getTime();
              const timeB = new Date(b.timestamp).getTime();
              return currentSortBy === "latest" ? timeB - timeA : timeA - timeB;
            })
            .slice(0, currentLimit);
        });
      }
    });

    return () => {
      socket.off("new_messages");
    };
  }, [socket, getParamValue, loading]);

  // Pagination controls
  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;

    const currentPage = parseInt(getParamValue("page", "1"), 10);

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

    return (
      <div className="flex justify-center mt-6">
        <div className="flex items-center space-x-1">
          <button
            className={`px-3 py-1 rounded text-[#B34AFE] cursor-pointer flex items-center ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              if (currentPage > 1) {
                handlePageChange(currentPage - 1);
              }
            }}
            disabled={currentPage === 1 || loading}
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

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((page) => (
            <button
              key={page}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                currentPage === page
                  ? "bg-[#111427] text-white"
                  : "text-gray-400 hover:bg-[#111427]"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => {
                if (!loading && page !== currentPage) {
                  handlePageChange(page);
                }
              }}
              disabled={loading}
            >
              {page}
            </button>
          ))}

          <button
            className={`px-3 py-1 rounded text-[#B34AFE] cursor-pointer flex items-center ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              if (currentPage < totalPages) {
                handlePageChange(currentPage + 1);
              }
            }}
            disabled={currentPage === totalPages || loading}
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
    );
  };

  // Threat levels for visualization (for MongoDB ObjectIDs)
  const getThreatLevel = (id: number | string) => {
    // Convert ID to string to ensure consistent handling
    const idString = id.toString();
    // Use the last character of the ID as a basis for the threat level
    const lastChar = idString.charAt(idString.length - 1);
    // Convert to number (base 16 to handle hex characters in ObjectIDs)
    const numValue = parseInt(lastChar, 16);
    // Scale to 1-5 range
    return (numValue % 5) + 1;
  };

  const renderThreatStrength = (level: number) => {
    return (
      <div className="flex space-x-1">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded-md ${
                i < level ? "bg-purple-500" : "bg-purple-900 opacity-40"
              }`}
            />
          ))}
      </div>
    );
  };

  // Format relative time (updated to display date and time on separate lines)
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(
      timestamp.endsWith("Z") ? timestamp : `${timestamp}Z`
    );
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);

    if (diffHrs < 1) {
      const mins = Math.floor(diffMs / (1000 * 60));
      return `${mins} min ago`;
    } else if (diffHrs < 24) {
      return `${Math.floor(diffHrs)} hr ago`;
    } else {
      // Format date and time separately for multi-line display
      const dateOptions: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };

      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };

      const formattedDate = new Intl.DateTimeFormat(
        "en-US",
        dateOptions
      ).format(date);
      const formattedTime = new Intl.DateTimeFormat(
        "en-US",
        timeOptions
      ).format(date);

      return (
        <div className="flex flex-col">
          <span>{formattedDate}</span>
          <span>{formattedTime}</span>
        </div>
      );
    }
  };

  // Render tags with a limit of 4 visible tags
  const renderTags = (tags: string[]) => {
    if (!tags || tags.length === 0) {
      return (
        <div className="flex flex-wrap w-full">
          <Badge
            className="text-[#A958E3] px-3 py-1 text-xs mb-2"
            style={{
              backgroundColor: "rgba(66, 12, 105, 0.84)",
              border: "0.426px solid rgba(255, 255, 255, 0.16)",
              borderRadius: "80px",
            }}
          >
            no tags found
          </Badge>
        </div>
      );
    }

    // Always show maximum 4 tags
    const visibleTags = tags.slice(0, 4);
    const remainingCount = tags.length - 4;

    return (
      <div className="flex flex-wrap gap-2 w-full">
        {visibleTags.map((tag) => (
          <Badge
            key={tag}
            className="text-[#A958E3] px-3 py-1 text-xs mb-2"
            style={{
              backgroundColor: "rgba(66, 12, 105, 0.84)",
              border: "0.426px solid rgba(255, 255, 255, 0.16)",
              borderRadius: "80px",
            }}
          >
            {tag.length > 15 ? `${tag.substring(0, 12)}...` : tag}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Badge
            className="text-[#A958E3] px-3 py-1 text-xs mb-2"
            style={{
              backgroundColor: "rgba(66, 12, 105, 0.84)",
              border: "0.426px solid rgba(255, 255, 255, 0.16)",
              borderRadius: "80px",
            }}
          >
            +{remainingCount} more
          </Badge>
        )}
      </div>
    );
  };

  // Add this function to fetch previous messages
  const fetchPreviousMessage = async (post: Post) => {
    setLoadingPrevious(true);
    try {
      const response = await fetch(
        `${BASE_URL}/messages/previous?group_id=${post.group_id}&message_id=${post.message_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch previous message");

      const data = await response.json();
      if (data && !data.has_previous) {
        // No more previous messages
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error fetching previous message:", error);
      return null;
    } finally {
      setLoadingPrevious(false);
    }
  };

  // Add this function to handle opening a post in the sheet
  const handleOpenPost = (post: Post) => {
    setCurrentPost(post);
  };

  return (
    <div className="space-y-6 text-white min-h-screen">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">Real-Time Feed Monitoring</h1>
        <span className="text-purple-400 text-sm">
          Posts Last updated 20 minutes ago
        </span>
      </div>

      {/* Search & Sorting Section */}
      <div className="flex items-center justify-between space-x-4">
        <div className="relative flex items-center justify-center w-[60%]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Posts"
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

        <div className="flex items-center justify-end space-x-3 w-[40%]">
          <span className="text-gray-300 flex items-center gap-[5px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="12"
              viewBox="0 0 18 12"
              fill="none"
            >
              <path
                d="M17.2201 1.71429H0.779896C0.573055 1.71429 0.374685 1.62398 0.228426 1.46323C0.0821675 1.30249 0 1.08447 0 0.857143C0 0.629814 0.0821675 0.411797 0.228426 0.251051C0.374685 0.090306 0.573055 0 0.779896 0H17.2201C17.4269 0 17.6253 0.090306 17.7716 0.251051C17.9178 0.411797 18 0.629814 18 0.857143C18 1.08447 17.9178 1.30249 17.7716 1.46323C17.6253 1.62398 17.4269 1.71429 17.2201 1.71429Z"
                fill="#68667C"
              />
              <path
                d="M11.4723 6.85686H0.779896C0.573055 6.85686 0.374685 6.76656 0.228426 6.60581C0.0821675 6.44507 0 6.22705 0 5.99972C0 5.77239 0.0821675 5.55437 0.228426 5.39363C0.374685 5.23288 0.573055 5.14258 0.779896 5.14258H11.4723C11.6791 5.14258 11.8775 5.23288 12.0237 5.39363C12.17 5.55437 12.2522 5.77239 12.2522 5.99972C12.2522 6.22705 12.17 6.44507 12.0237 6.60581C11.8775 6.76656 11.6791 6.85686 11.4723 6.85686Z"
                fill="#68667C"
              />
              <path
                d="M5.67764 11.9994H0.779896C0.573055 11.9994 0.374685 11.9091 0.228426 11.7484C0.0821675 11.5876 0 11.3696 0 11.1423C0 10.915 0.0821675 10.697 0.228426 10.5362C0.374685 10.3755 0.573055 10.2852 0.779896 10.2852H5.67764C5.88448 10.2852 6.08285 10.3755 6.22911 10.5362C6.37537 10.697 6.45754 10.915 6.45754 11.1423C6.45754 11.3696 6.37537 11.5876 6.22911 11.7484C6.08285 11.9091 5.88448 11.9994 5.67764 11.9994Z"
                fill="#68667C"
              />
            </svg>{" "}
            <p className="text-[#68667C] text-sm">Sort by</p>
          </span>
          <Select
            value={getParamValue("sortBy", "latest")}
            onValueChange={(value) =>
              handleSortChange(value as "latest" | "oldest")
            }
          >
            <SelectTrigger
              className="w-[120px] border-none flex items-center px-4"
              style={{
                borderRadius: "40px",
                background: "rgba(160, 83, 216, 0.30)",
              }}
            >
              <SelectValue placeholder="Sort By" className="text-center" />
            </SelectTrigger>
            <SelectContent className="bg-[#191927] text-white border-gray-700">
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>

          {/* Groups Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#191927] border-none flex items-center gap-2"
                style={{
                  borderRadius: "40px",
                  background: "rgba(160, 83, 216, 0.30)",
                }}
              >
                {loadingGroups ? (
                  <>
                    <Skeleton className="h-4 w-4 rounded-full bg-purple-900/50 animate-pulse" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="14"
                      viewBox="0 0 21 14"
                      fill="none"
                    >
                      <path
                        d="M1 1H20M4.16667 7H16.8333M7.96667 13H13.0333"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Groups({getParamValues("group_ids").length})
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#191927] text-white border-gray-700">
              <div className="mb-4">
                <Input
                  placeholder="Search groups..."
                  value={groupSearch}
                  onChange={(e) => setGroupSearch(e.target.value)}
                  className="bg-[#111427] border-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
                  disabled={loadingGroups}
                />
              </div>
              <ScrollArea className="h-[200px] pr-4">
                {loadingGroups ? (
                  // Skeleton loading state for groups
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={`skeleton-group-${index}`}
                        className="flex items-center space-x-2 mb-3"
                      >
                        <Skeleton className="h-4 w-4 rounded bg-purple-900/30" />
                        <Skeleton className="h-5 w-[80%] rounded bg-purple-900/30" />
                      </div>
                    ))
                ) : filteredGroups.length > 0 ? (
                  // Render groups when available
                  filteredGroups.slice(0, 10).map((group) => {
                    const selectedGroupIds = getParamValues("group_ids");
                    // Convert both to strings to ensure consistent comparison
                    const isSelected = selectedGroupIds.includes(
                      String(group.group_id)
                    );

                    return (
                      <div
                        key={group._id}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <Checkbox
                          id={group._id}
                          checked={isSelected}
                          className="border-purple-500 data-[state=checked]:bg-purple-600"
                          onCheckedChange={(checked) => {
                            const currentGroups = [...selectedGroupIds];
                            const groupIdString = String(group.group_id);

                            if (checked) {
                              if (!currentGroups.includes(groupIdString)) {
                                currentGroups.push(groupIdString);
                              }
                            } else {
                              const index =
                                currentGroups.indexOf(groupIdString);
                              if (index !== -1) {
                                currentGroups.splice(index, 1);
                              }
                            }
                            handleGroupSelection(currentGroups);
                          }}
                        />
                        <label
                          htmlFor={group._id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {group.title}
                        </label>
                      </div>
                    );
                  })
                ) : (
                  // No groups found
                  <div className="text-center py-4 text-gray-400">
                    No groups found
                  </div>
                )}
                {!loadingGroups && filteredGroups.length > 10 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {filteredGroups.length - 10} more groups...
                  </p>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Table Header */}
      <div
        className="bg-[#141429] rounded-[26px] overflow-hidden"
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        {/* Responsive grid with specific column widths and consistent gaps */}
        <div
          className="bg-[#1A1E38] grid grid-cols-12 gap-4 md:gap-6 py-4 px-6 text-[#DFDFDF]"
          style={{
            borderRadius: "26px 26px 0px 0px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <div className="col-span-3">Channel</div>
          <div className="col-span-3">Threat Strength</div>
          <div className="col-span-3">Tags</div>
          <div className="col-span-3">Occurred Time</div>
        </div>

        {/* Display Posts as Table Rows */}
        {loading ? (
          <div>
            {/* Skeleton loading state */}
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="grid grid-cols-12 gap-4 md:gap-6 py-5 px-6 bg-[#14152E] relative"
                >
                  {/* Channel column skeleton */}
                  <div className="col-span-3 space-y-2">
                    <Skeleton className="h-6 w-3/4 bg-gray-700/50" />
                    <Skeleton className="h-4 w-1/2 bg-gray-700/30" />
                  </div>

                  {/* Threat strength column skeleton */}
                  <div className="col-span-3 flex items-center">
                    <div className="flex space-x-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton
                            key={i}
                            className={`h-2 w-8 rounded-md bg-purple-900/40`}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Tags column skeleton */}
                  <div className="col-span-3 flex items-center gap-2">
                    <Skeleton className="h-6 w-20 rounded-full bg-purple-900/30" />
                    <Skeleton className="h-6 w-16 rounded-full bg-purple-900/30" />
                  </div>

                  {/* Time column skeleton */}
                  <div className="col-span-3">
                    <Skeleton className="h-4 w-16 bg-purple-900/30" />
                  </div>

                  {/* 90% width border at bottom */}
                  <div
                    className="absolute bottom-0 left-[2.5%] right-[2.5%] w-[95%] h-[1px] bg-gradient-to-r from-white/15 to-white/10"
                    style={{
                      opacity: 0.4,
                    }}
                  ></div>
                </div>
              ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No posts found.</div>
        ) : (
          <div>
            {posts.map((post) => (
              <Sheet key={post.id}>
                <SheetTrigger asChild>
                  <div
                    className="grid grid-cols-12 gap-4 md:gap-6 py-5 px-6 hover:bg-[#1c1c36] bg-[#14152E] cursor-pointer relative"
                    onClick={() => handleOpenPost(post)}
                  >
                    {/* Channel column - 3/12 width */}
                    <div className="col-span-3">
                      <p className="font-medium text-lg">{post.channel}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {truncateContent(post.content, 20)}
                      </p>
                    </div>

                    {/* Threat strength column - 3/12 width */}
                    <div className="col-span-3 flex items-center">
                      {renderThreatStrength(getThreatLevel(post.id))}
                    </div>

                    {/* Tags column - 3/12 width */}
                    <div className="col-span-3 flex items-center overflow-hidden">
                      {renderTags(post.tags)}
                    </div>

                    {/* Time column - 3/12 width */}
                    <div className="col-span-3 text-[#966FBE] text-sm">
                      {formatRelativeTime(post.timestamp)}
                    </div>

                    {/* 90% width border at bottom */}
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
                  <PostDetail post={post} />
                </SheetContent>
              </Sheet>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {renderPaginationControls()}
    </div>
  );
}
