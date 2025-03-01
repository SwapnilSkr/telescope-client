import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface ThreatActorDetailProps {
  actor: {
    id: string;
    name: string;
    type: string;
    status: string;
    messageCount: number;
    lastMessage: {
      content?: string;
      media?: { type: string; url: string } | null;
      timestamp: string;
    };
  };
}

export function ThreatActorDetail({ actor }: ThreatActorDetailProps) {
  return (
    <ScrollArea
      className="h-full w-full overflow-y-auto text-white"
      style={{
        background:
          "linear-gradient(0deg, #1A1E34 0%, #1A1E34 100%), lightgray -3246.934px 0px / 384.569% 100% no-repeat",
      }}
    >
      <div className="p-6 space-y-6">
        {/* Header with name and badges */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">{actor.name}</h2>

          <div className="flex items-center space-x-2">
            <Badge
              className="text-[#A958E3] px-3 py-1 text-xs"
              style={{
                backgroundColor: "rgba(66, 12, 105, 0.84)",
                border: "0.426px solid rgba(255, 255, 255, 0.16)",
                borderRadius: "80px",
              }}
            >
              {actor.type}
            </Badge>
            <Badge
              className={`px-3 py-1 text-xs ${
                actor.status === "Active"
                  ? "bg-red-800/50 text-red-400"
                  : "bg-gray-700/50 text-gray-300"
              }`}
              style={{
                borderRadius: "80px",
              }}
            >
              {actor.status}
            </Badge>
          </div>
        </div>

        {/* Separator line */}
        <hr className="border-t border-slate-700/50" />

        {/* Message Count */}
        <div
          className="p-6"
          style={{
            borderRadius: "20px",
            border: "1.411px solid rgba(255, 255, 255, 0.03)",
            background: "rgba(17, 20, 39, 0.60)",
            backdropFilter: "blur(16.92917823791504px)",
          }}
        >
          <div className="flex items-center gap-4">
            <span className="text-purple-400 mr-4">Message Count</span>
            <span className="text-4xl font-bold text-white">
              {actor.messageCount}
            </span>
          </div>
        </div>

        {/* Last Recorded Message - EVERYTHING inside the box */}
        <div
          className="p-6"
          style={{
            borderRadius: "20px",
            border: "1.411px solid rgba(255, 255, 255, 0.03)",
            background: "rgba(17, 20, 39, 0.60)",
            backdropFilter: "blur(16.92917823791504px)",
          }}
        >
          <h3 className="text-purple-400 mb-4">Last Recorded Message</h3>

          {/* Message Content */}
          {actor.lastMessage?.content ? (
            <p className="text-white text-lg leading-relaxed mb-6">
              {actor.lastMessage.content}
            </p>
          ) : (
            <p className="text-gray-500 italic mb-6">
              No message content available.
            </p>
          )}

          {/* Media Preview with natural dimensions */}
          {actor.lastMessage?.media?.url && (
            <div className="overflow-auto">
              {actor.lastMessage.media.type === "image" ? (
                <div className="rounded-lg">
                  <Image
                    className="object-contain"
                    src={actor.lastMessage.media.url}
                    alt="Threat actor media"
                    width={800}
                    height={600}
                    style={{ width: "auto", height: "auto" }}
                    unoptimized={true}
                  />
                </div>
              ) : actor.lastMessage.media.type === "video" ? (
                <div className="rounded-lg">
                  <video
                    controls
                    className="max-w-full"
                    src={actor.lastMessage.media.url}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <a
                  href={actor.lastMessage.media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-purple-900 hover:bg-purple-800 text-white px-4 py-2 rounded-md"
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
                  Download File
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
