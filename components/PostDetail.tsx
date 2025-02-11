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

  const handleTranslate = async () => {
    try {
      setIsTranslating(true);
      const response = await fetch(`${BASE_URL}/messages/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  return (
    <ScrollArea className="h-full w-full p-4 overflow-y-auto rounded-lg border bg-white shadow-lg">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{post.channel}</h2>
          <p className="text-gray-500">{`${date}, ${time}`}</p>
        </div>

        <p>{content}</p>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            onClick={isTranslated ? handleShowOriginal : handleTranslate}
            disabled={isTranslating}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            {isTranslating
              ? "Translating..."
              : isTranslated
                ? "Show Original"
                : "Translate to English"}
          </Button>
        </div>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Media Section */}
        {post.media && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Media</h3>
            {post.media.type === "image" && (
              <Image
                src={post.media.url || "/placeholder.svg"}
                alt={post.media.alt || "Post image"}
                width={400}
                height={300}
                className="w-full rounded-lg object-cover"
              />
            )}
            {post.media.type === "video" && (
              <video
                controls
                poster={post.media.thumbnail}
                className="w-full rounded-lg"
              >
                <source src={post.media.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {post.media.type === "file" && (
              <Button asChild className="w-full sm:w-auto">
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
        )}
      </div>
    </ScrollArea>
  );
}
