/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useCallback } from "react";
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
  id: number;
  channel: string;
  timestamp: string;
  content: string;
  tags: string[];
  media?: Media;
}

interface Group {
  _id: string;
  group_id: string;
  title: string;
}

export default function RealTimeFeed() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Watch for URL parameter changes
  useEffect(() => {
    // Update state based on current URL parameters
    const keyword = searchParams.get("keyword") || "";
    const sortOrder =
      (searchParams.get("sortBy") as "latest" | "oldest") || "latest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const groupIds = searchParams.getAll("group_ids");

    setSearchKeyword(keyword);
    setSearchInput(keyword);
    setSortBy(sortOrder);
    setCurrentPage(page);
    setSelectedGroups(groupIds);

    // Fetch posts with the new parameters
    fetchPosts();
  }, [searchParams]);

  // Get params from URL (still needed for initial state)
  const initialSearch = searchParams.get("keyword") || "";
  const initialSortBy =
    (searchParams.get("sortBy") as "latest" | "oldest") || "latest";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialLimit = parseInt(
    searchParams.get("limit") || ITEMS_PER_PAGE.toString(),
    10
  );
  const [searchKeyword, setSearchKeyword] = useState<string>(initialSearch);

  // States
  const [searchInput, setSearchInput] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<"latest" | "oldest">(initialSortBy);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>(
    searchParams.getAll("group_ids") // Initialize from "group_ids" in URL
  );
  const [groupSearch, setGroupSearch] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const accessToken = localStorage.getItem("access_token");

  // Fetch groups
  const fetchGroups = useCallback(async () => {
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
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, []);

  // Filtered groups based on search
  const filteredGroups = groups.filter((group) =>
    group.title.toLowerCase().includes(groupSearch.toLowerCase())
  );

  useEffect(() => {
    fetchPosts();
    updateQueryParams();
  }, [
    searchKeyword,
    sortBy,
    currentPage,
    selectedGroups,
    initialLimit,
    router,
  ]);

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

  const handleSearch = () => {
    setSearchKeyword(searchInput);
    setCurrentPage(1);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        keyword: searchKeyword, // Changed from searchInput to searchKeyword
        sortOrder: sortBy,
        page: currentPage.toString(),
        limit: initialLimit.toString(),
      });

      // Add multiple group_ids
      if (selectedGroups.length > 0) {
        selectedGroups.forEach((groupId) => {
          params.append("group_ids", groupId);
        });
      }

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
    }
    setLoading(false);
  }, [searchKeyword, sortBy, currentPage, initialLimit, selectedGroups]);

  useEffect(() => {
    if (!socket) return;

    socket.on("new_messages", (data) => {
      console.log("New messages received:", data);
      fetchPosts();
    });

    return () => {
      socket.off("new_messages");
    };
  }, [socket, fetchPosts]);

  const updateQueryParams = () => {
    const params = new URLSearchParams();
    if (searchKeyword) params.set("keyword", searchKeyword);
    if (sortBy) params.set("sortBy", sortBy);
    if (selectedGroups.length > 0) {
      selectedGroups.forEach((groupId) => {
        params.append("group_ids", groupId); // Use "group_ids" to match the API
      });
    }
    params.set("page", currentPage.toString());
    params.set("limit", initialLimit.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Truncate content for display - character limit
  const truncateContent = (content: string, charLimit: number): string => {
    return content.length > charLimit
      ? content.substring(0, charLimit) + "..."
      : content;
  };

  // Pagination controls
  const startPage = Math.max(
    1,
    currentPage - Math.floor(PAGINATION_BUTTONS_LIMIT / 2)
  );
  const endPage = Math.min(
    totalPages,
    startPage + PAGINATION_BUTTONS_LIMIT - 1
  );

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
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value as "latest" | "oldest");
              setCurrentPage(1);
            }}
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
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Groups({selectedGroups.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#191927] text-white border-gray-700">
              <div className="mb-4">
                <Input
                  placeholder="Search groups..."
                  value={groupSearch}
                  onChange={(e) => setGroupSearch(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[200px] pr-4">
                {filteredGroups.slice(0, 10).map((group) => {
                  const selectedGroupsArrayInt = selectedGroups.map((g) =>
                    parseInt(g)
                  );
                  return (
                    <div
                      key={group._id}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <Checkbox
                        id={group._id}
                        checked={selectedGroupsArrayInt.includes(
                          parseInt(group.group_id)
                        )}
                        onCheckedChange={(checked) => {
                          setSelectedGroups(
                            checked
                              ? [...selectedGroups, group.group_id]
                              : selectedGroups.filter(
                                  (g) =>
                                    parseInt(g) !== parseInt(group.group_id)
                                )
                          );
                          setCurrentPage(1);
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
                })}
                {filteredGroups.length > 10 && (
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
            {Array(5).fill(0).map((_, index) => (
              <div key={`skeleton-${index}`} className="grid grid-cols-12 gap-4 md:gap-6 py-5 px-6 bg-[#14152E] relative">
                {/* Channel column skeleton */}
                <div className="col-span-3 space-y-2">
                  <Skeleton className="h-6 w-24 bg-gray-700/50" />
                  <Skeleton className="h-4 w-32 bg-gray-700/30" />
                </div>

                {/* Threat strength column skeleton */}
                <div className="col-span-3 flex items-center">
                  <div className="flex space-x-1">
                    {Array(5).fill(0).map((_, i) => (
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
                  <Skeleton className="h-6 w-24 rounded-full bg-purple-900/30" />
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
                  <div className="grid grid-cols-12 gap-4 md:gap-6 py-5 px-6 hover:bg-[#1c1c36] bg-[#14152E] cursor-pointer relative">
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
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-1">
            <button
              className="px-3 py-1 rounded text-[#B34AFE] cursor-pointer flex items-center"
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
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="px-3 py-1 rounded text-[#B34AFE] cursor-pointer flex items-center"
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
