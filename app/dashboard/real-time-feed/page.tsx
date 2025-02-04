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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

  // Get params from URL
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

  // Fetch groups
  const fetchGroups = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/groups`);
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
        `${BASE_URL}/messages/search?${params.toString()}`
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

  // Truncate content for display
  const truncateContent = (content: string, wordLimit: number): string => {
    const words = content.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Real-Time Feed Monitoring</h1>

      {/* Search & Sorting Section */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 flex space-x-2">
          <Input
            placeholder="Search posts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <Button variant="default" onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <div className="flex space-x-2">
          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value as "latest" | "oldest");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Sort And Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Sort By Latest</SelectItem>
              <SelectItem value="oldest">Sort By Oldest</SelectItem>
            </SelectContent>
          </Select>

          {/* Groups Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                Groups ({selectedGroups.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
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

      {/* Display Posts */}
      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts found.</p>
          ) : (
            posts.map((post) => {
              // Ensure timestamp is treated as UTC (add 'Z' if missing)
              const timestamp = post.timestamp.endsWith("Z")
                ? post.timestamp
                : `${post.timestamp}Z`;
              const utcDate = new Date(timestamp);

              const istOptions: Intl.DateTimeFormatOptions = {
                timeZone: "Asia/Kolkata",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              };

              // Use 'en-IN' locale for Indian date format (DD/MM/YYYY)
              const istDate = new Intl.DateTimeFormat(
                "en-IN",
                istOptions
              ).format(utcDate);
              const [date, time] = istDate.split(", ");

              return (
                <Sheet key={post.id}>
                  <SheetTrigger asChild>
                    <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <CardHeader>
                        <CardTitle>{post.channel}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">
                          {truncateContent(post.content, 10)}
                        </p>
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {`${date}, ${time}`}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </SheetTrigger>
                  <SheetContent>
                    <PostDetail post={post} />
                  </SheetContent>
                </Sheet>
              );
            })
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage((prev) => prev - 1);
                }}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>

            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => i + startPage
            ).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages)
                    setCurrentPage((prev) => prev + 1);
                }}
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
