import { Badge } from "@/components/ui/badge";

interface ThreatActorDetailProps {
  actor: {
    id: string;
    name: string;
    type: string;
    status: string;
    messageCount: number;
    lastMessage: {
      content: string;
      timestamp: string;
    };
  };
}

export function ThreatActorDetail({ actor }: ThreatActorDetailProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{actor.name}</h2>
        <div className="flex items-center space-x-2 mt-2">
          <Badge variant="outline">{actor.type}</Badge>
          <Badge variant={actor.status === "Active" ? "default" : "secondary"}>
            {actor.status}
          </Badge>
        </div>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-sm text-gray-500 mb-1">Message Count</p>
        <p className="text-2xl font-bold">{actor.messageCount}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Last Recorded Message</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="mb-2">{actor.lastMessage.content}</p>
          <p className="text-sm text-gray-500">
            {new Date(actor.lastMessage.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
