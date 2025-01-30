import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const modules = [
  {
    name: "Cyber Module",
    description: "Track Telegram groups and channels relevant to cyber threats and incidents.",
    status: "Active",
  },
  {
    name: "OSINT Module",
    description: "Monitor open-source intelligence channels for comprehensive OSINT analysis.",
    status: "Coming Soon",
  },
  {
    name: "Crime Monitoring Module",
    description: "Keep tabs on criminal activities across various Telegram channels.",
    status: "Coming Soon",
  },
]

export function ModuleOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {modules.map((module) => (
        <Card key={module.name}>
          <CardHeader>
            <CardTitle>{module.name}</CardTitle>
            <CardDescription>{module.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-sm font-semibold ${module.status === "Active" ? "text-green-600" : "text-yellow-600"}`}>
              {module.status}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

