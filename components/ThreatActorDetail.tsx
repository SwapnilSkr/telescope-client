import { Badge } from "@/components/ui/badge";
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
      timestamp?: string;
    };
  };
}

export function ThreatActorDetail({ actor }: ThreatActorDetailProps) {
  const hasLastMessage = actor.lastMessage && actor.lastMessage.timestamp;
  const isoString = hasLastMessage
    ? new Date(actor.lastMessage.timestamp!).toISOString()
    : null;
  const [date, time] = isoString ? isoString.split("T") : ["N/A", "N/A"];
  const formattedTime = time ? time.split(".")[0] : "N/A";

  console.log("lastMessage", actor.lastMessage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">{actor.name}</h2>
        <div className="flex items-center space-x-2 mt-2">
          <Badge variant="outline">{actor.type}</Badge>
          <Badge variant={actor.status === "Active" ? "default" : "secondary"}>
            {actor.status}
          </Badge>
        </div>
      </div>

      {/* Message Count */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-sm text-gray-500 mb-1">Message Count</p>
        <p className="text-2xl font-bold">{actor.messageCount}</p>
      </div>

      {/* Last Recorded Message */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Last Recorded Message</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          {/* Message Content */}
          {actor.lastMessage?.content ? (
            <p className="mb-2">{actor.lastMessage.content}</p>
          ) : (
            <p className="text-gray-500 italic">
              No message content available.
            </p>
          )}

          {/* Media Preview (Image/Video/File) */}
          {actor.lastMessage?.media?.url && (
            <div className="mt-2">
              {actor.lastMessage.media.type === "image" ? (
                <Image
                  className="rounded-md w-full mt-2"
                  src={actor.lastMessage.media.url}
                  alt="Group media"
                  width={600}
                  height={400}
                />
              ) : actor.lastMessage.media.type === "video" ? (
                <video
                  className="rounded-md w-full mt-2"
                  controls
                  src={actor.lastMessage.media.url}
                />
              ) : (
                <a
                  href={actor.lastMessage.media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Download File
                </a>
              )}
            </div>
          )}

          {/* Timestamp */}
          <p className="text-sm text-gray-500 mt-2">
            {hasLastMessage
              ? `${date}, ${formattedTime}`
              : "No timestamp available"}
          </p>
        </div>
      </div>
    </div>
  );
}
