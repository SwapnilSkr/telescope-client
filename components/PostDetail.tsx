import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { BASE_URL } from "@/utils/baseUrl";

interface PostDetailProps {
  post: {
    id: number;
    channel: string;
    timestamp: string;
    content: string;
    tags: string[];
    media?: {
      type: string;
      url: string;
      alt?: string;
      thumbnail?: string;
      name?: string;
    };
  };
}

export function PostDetail({ post }: PostDetailProps) {
  const [content, setContent] = useState(post.content);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  const handleTranslate = async () => {
    try {
      setIsTranslating(true);
      const response = await fetch(`${BASE_URL}/messages/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          id: post.id,
          text: post.content,
        }),
      });

      const data = await response.json();
      setContent(data.translated_text);
      setIsTranslated(true);
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleShowOriginal = () => {
    setContent(post.content);
    setIsTranslated(false);
  };

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

  const istDate = new Intl.DateTimeFormat("en-IN", istOptions).format(utcDate);
  const [date, time] = istDate.split(", ");

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(utcDate);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(utcDate);

  const getThreatLevel = (id: number) => {
    const idString = id.toString();
    const lastChar = idString.charAt(idString.length - 1);
    const numValue = parseInt(lastChar, 16);
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

  return (
    <ScrollArea
      className="h-full w-full overflow-y-auto text-white px-4"
      style={{
        background:
          "linear-gradient(0deg, #1A1E34 0%, #1A1E34 100%), lightgray -3246.934px 0px / 384.569% 100% no-repeat",
      }}
    >
      <div className="p-6 space-y-8">
        <div className="flex flex-col space-y-4">
          <h2 className="text-3xl font-bold text-white">{post.channel}</h2>

          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <p className="text-gray-400">Threat Strength</p>
              {renderThreatStrength(getThreatLevel(post.id))}
            </div>

            <div className="flex items-center space-x-4 text-purple-300">
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="20"
                  viewBox="0 0 19 20"
                  fill="none"
                >
                  <path
                    d="M5.95067 11.2288C6.41948 11.2288 6.79954 10.8487 6.79954 10.3799C6.79954 9.91103 6.41948 9.53101 5.95067 9.53101C5.48185 9.53101 5.10181 9.91103 5.10181 10.3799C5.10181 10.8487 5.48185 11.2288 5.95067 11.2288Z"
                    fill="#A958E3"
                  />
                  <path
                    d="M5.95067 14.6255C6.41948 14.6255 6.79954 14.2455 6.79954 13.7766C6.79954 13.3078 6.41948 12.9277 5.95067 12.9277C5.48185 12.9277 5.10181 13.3078 5.10181 13.7766C5.10181 14.2455 5.48185 14.6255 5.95067 14.6255Z"
                    fill="#A958E3"
                  />
                  <path
                    d="M13.5905 10.3799C13.5905 10.8487 13.2105 11.2288 12.7417 11.2288C12.2729 11.2288 11.8928 10.8487 11.8928 10.3799C11.8928 9.91103 12.2729 9.53101 12.7417 9.53101C13.2105 9.53101 13.5905 9.91103 13.5905 10.3799Z"
                    fill="#A958E3"
                  />
                  <path
                    d="M12.7417 14.6255C13.2105 14.6255 13.5905 14.2455 13.5905 13.7766C13.5905 13.3078 13.2105 12.9277 12.7417 12.9277C12.2729 12.9277 11.8928 13.3078 11.8928 13.7766C11.8928 14.2455 12.2729 14.6255 12.7417 14.6255Z"
                    fill="#A958E3"
                  />
                  <path
                    d="M10.1953 10.3799C10.1953 10.8487 9.81524 11.2288 9.34639 11.2288C8.87761 11.2288 8.49756 10.8487 8.49756 10.3799C8.49756 9.91103 8.87761 9.53101 9.34639 9.53101C9.81524 9.53101 10.1953 9.91103 10.1953 10.3799Z"
                    fill="#A958E3"
                  />
                  <path
                    d="M9.34639 14.6255C9.81524 14.6255 10.1953 14.2455 10.1953 13.7766C10.1953 13.3078 9.81524 12.9277 9.34639 12.9277C8.87761 12.9277 8.49756 13.3078 8.49756 13.7766C8.49756 14.2455 8.87761 14.6255 9.34639 14.6255Z"
                    fill="#A958E3"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.95085 1.46265C6.33444 1.46265 6.64538 1.7736 6.64538 2.15717V2.33135C7.29265 2.31158 8.0332 2.31158 8.88399 2.31159H9.80856C10.6594 2.31158 11.4 2.31158 12.0472 2.33135V2.15717C12.0472 1.7736 12.3581 1.46265 12.7417 1.46265C13.1252 1.46265 13.4362 1.7736 13.4362 2.15717V2.42758C14.2174 2.52598 14.8764 2.7137 15.4608 3.09207C16.0368 3.4649 16.5273 3.9554 16.9001 4.53134C17.3194 5.17918 17.5047 5.91844 17.5936 6.81423C17.6806 7.69098 17.6806 8.78928 17.6806 10.1837V10.2593C17.6806 11.6537 17.6806 12.7519 17.5936 13.6287C17.5047 14.5245 17.3194 15.2638 16.9001 15.9116C16.5273 16.4876 16.0368 16.9781 15.4608 17.3509C14.813 17.7702 14.0738 17.9554 13.1779 18.0443C12.3013 18.1314 11.203 18.1314 9.80865 18.1314H8.88394C7.48962 18.1314 6.39134 18.1314 5.51461 18.0443C4.61882 17.9554 3.87955 17.7702 3.23172 17.3509C2.65578 16.9781 2.16528 16.4876 1.79245 15.9116C1.37308 15.2638 1.18791 14.5245 1.09898 13.6287C1.01195 12.7519 1.01196 11.6537 1.01196 10.2593V10.1836C1.01196 8.78926 1.01195 7.69098 1.09898 6.81423C1.18791 5.91844 1.37308 5.17918 1.79245 4.53134C2.16528 3.9554 2.65578 3.4649 3.23172 3.09207C3.81622 2.7137 4.47516 2.52598 5.25633 2.42758V2.15717C5.25633 1.7736 5.56728 1.46265 5.95085 1.46265ZM12.0472 3.72099V3.8549C12.0472 4.23848 12.3581 4.54943 12.7417 4.54943C13.1252 4.54943 13.4362 4.23848 13.4362 3.8549V3.82982C14.0017 3.91576 14.3893 4.05312 14.706 4.25813C15.1174 4.52443 15.4677 4.8748 15.7341 5.28618C15.925 5.58123 16.0574 5.93779 16.144 6.44244C15.8673 6.4123 15.5305 6.37916 15.1338 6.3461C13.8414 6.2384 11.9122 6.13149 9.34628 6.13149C6.78037 6.13149 4.85118 6.2384 3.55876 6.3461C3.162 6.37916 2.82526 6.4123 2.54855 6.44244C2.63523 5.93779 2.76751 5.58123 2.95851 5.28618C3.22481 4.8748 3.57517 4.52443 3.98656 4.25813C4.30325 4.05312 4.69082 3.91576 5.25633 3.82982V3.8549C5.25633 4.23848 5.56728 4.54943 5.95085 4.54943C6.33444 4.54943 6.64538 4.23848 6.64538 3.8549V3.72099C7.2716 3.70096 8.01532 3.70064 8.92185 3.70064H9.77068C10.6773 3.70064 11.421 3.70096 12.0472 3.72099ZM16.2681 7.85451C15.9654 7.81861 15.5488 7.77455 15.0184 7.73035C13.7643 7.62584 11.8735 7.52054 9.34628 7.52054C6.819 7.52054 4.9283 7.62584 3.67411 7.73035C3.14375 7.77455 2.72718 7.81861 2.42443 7.85451C2.40137 8.4993 2.40102 9.27088 2.40102 10.2215C2.40102 11.662 2.40181 12.6914 2.48124 13.4915C2.55956 14.2805 2.70889 14.7712 2.95851 15.1568C3.22481 15.5681 3.57517 15.9185 3.98656 16.1849C4.37216 16.4344 4.86283 16.5838 5.65183 16.662C6.45195 16.7415 7.48135 16.7423 8.92185 16.7423H9.77068C11.2112 16.7423 12.2406 16.7415 13.0407 16.662C13.8298 16.5838 14.3204 16.4344 14.706 16.1849C15.1174 15.9185 15.4677 15.5681 15.7341 15.1568C15.9836 14.7712 16.133 14.2805 16.2114 13.4915C16.2907 12.6914 16.2915 11.662 16.2915 10.2215C16.2915 9.27088 16.2912 8.4993 16.2681 7.85451Z"
                    fill="#A958E3"
                  />
                </svg>
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.1835 4.47217C10.5671 4.47217 10.8781 4.78312 10.8781 5.16669V9.36763L13.2722 10.5647C13.6153 10.7362 13.7544 11.1534 13.5828 11.4965C13.4113 11.8396 12.9942 11.9787 12.6511 11.8071L9.87294 10.4181C9.63764 10.3005 9.48901 10.06 9.48901 9.79687V5.16669C9.48901 4.78312 9.79997 4.47217 10.1835 4.47217Z"
                    fill="#A958E3"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.1835 17.668C14.5306 17.668 18.0548 14.1439 18.0548 9.79673C18.0548 5.44953 14.5306 1.92543 10.1835 1.92543C5.83625 1.92543 2.31215 5.44953 2.31215 9.79673C2.31215 14.1439 5.83625 17.668 10.1835 17.668ZM10.1835 19.0571C15.2978 19.0571 19.4438 14.911 19.4438 9.79673C19.4438 4.68238 15.2978 0.536377 10.1835 0.536377C5.0691 0.536377 0.923096 4.68238 0.923096 9.79673C0.923096 14.911 5.0691 19.0571 10.1835 19.0571Z"
                    fill="#A958E3"
                  />
                </svg>
                {formattedTime}
              </span>
            </div>
          </div>
        </div>

        <hr className="border-gray-700/50" />

        <div className="mt-6">
          <p className="text-white text-lg leading-relaxed">{content}</p>
        </div>

        <div className="flex">
          <Button
            onClick={isTranslated ? handleShowOriginal : handleTranslate}
            disabled={isTranslating}
            variant="outline"
            size="sm"
            className="text-purple-300 border-purple-500 hover:bg-purple-900/30 rounded-full"
          >
            {isTranslating
              ? "Translating..."
              : isTranslated
              ? "Show Original"
              : "Translate to English"}
          </Button>
        </div>

        <hr className="border-gray-700/50" />

        <div className="space-y-2">
          <h3 className="text-gray-400 uppercase text-sm font-medium">TAGS</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags && post.tags.length > 0 ? (
              post.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="text-[#A958E3] px-3 py-1 text-xs"
                  style={{
                    backgroundColor: "rgba(66, 12, 105, 0.84)",
                    border: "0.426px solid rgba(255, 255, 255, 0.16)",
                    borderRadius: "80px",
                  }}
                >
                  {tag}
                </Badge>
              ))
            ) : (
              <Badge
                className="text-[#A958E3] px-3 py-1 text-xs"
                style={{
                  backgroundColor: "rgba(66, 12, 105, 0.84)",
                  border: "0.426px solid rgba(255, 255, 255, 0.16)",
                  borderRadius: "80px",
                }}
              >
                no tags found
              </Badge>
            )}
          </div>
        </div>

        <hr className="border-gray-700/50" />

        {post.media && (
          <div className="space-y-4">
            <h3 className="text-gray-400 uppercase text-sm font-medium">
              Media
            </h3>
            <div className="w-full overflow-auto">
              {post.media.type === "image" && (
                <div className="w-full max-h-[500px] overflow-hidden rounded-lg">
                  <Image
                    src={post.media.url || "/placeholder.svg"}
                    alt={post.media.alt || "Post image"}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: "500px" }}
                  />
                </div>
              )}
              {post.media.type === "video" && (
                <div className="w-full max-h-[500px] rounded-lg">
                  <video
                    controls
                    poster={post.media.thumbnail}
                    className="w-full h-auto max-h-[500px]"
                  >
                    <source src={post.media.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {post.media.type === "file" && (
                <Button
                  asChild
                  className="bg-purple-900 hover:bg-purple-800 text-white"
                >
                  <a
                    href={post.media.url}
                    download={post.media.name}
                    className="inline-flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Download {post.media.name}
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
