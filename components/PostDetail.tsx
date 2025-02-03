import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const isoString = new Date(post.timestamp).toISOString();
  const [date, time] = isoString.split("T");
  const formattedTime = time.split(".")[0];

  return (
    <ScrollArea className="max-h-[100vh] w-full p-4 overflow-y-auto rounded-lg border bg-white shadow-lg">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{post.channel}</h2>
        <p className="text-gray-500">{`${date}, ${formattedTime}`}</p>
        <p>{post.content}</p>

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
                className="rounded-lg"
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
              <Button asChild>
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
