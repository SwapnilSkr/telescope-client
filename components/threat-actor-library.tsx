import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ThreatActorLibrary() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  // Mock data for threat actors
  const threatActors = [
    { id: 1, name: "APT29", type: "APT", region: "Russia", status: "Active" },
    { id: 2, name: "Lazarus Group", type: "APT", region: "North Korea", status: "Active" },
    { id: 3, name: "FIN7", type: "Cybercrime", region: "Eastern Europe", status: "Active" },
    // Add more mock data as needed
  ]

  const filteredActors = threatActors.filter(
    (actor) => actor.name.toLowerCase().includes(search.toLowerCase()) && (filter === "all" || actor.type === filter),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Actor Library</CardTitle>
        <CardDescription>Comprehensive database of monitored threat actors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input placeholder="Search threat actors..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="APT">APT</SelectItem>
              <SelectItem value="Cybercrime">Cybercrime</SelectItem>
              <SelectItem value="Hacktivist">Hacktivist</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          {filteredActors.map((actor) => (
            <Card key={actor.id}>
              <CardHeader>
                <CardTitle>{actor.name}</CardTitle>
                <CardDescription>
                  {actor.type} - {actor.region}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={`text-sm font-semibold ${actor.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                  {actor.status}
                </p>
                <Button className="mt-2">View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

