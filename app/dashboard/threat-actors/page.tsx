"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockThreatActors = [
  { id: 1, name: "APT29", type: "APT", region: "Russia", status: "Active" },
  { id: 2, name: "Lazarus Group", type: "APT", region: "North Korea", status: "Active" },
  { id: 3, name: "FIN7", type: "Cybercrime", region: "Eastern Europe", status: "Active" },
  { id: 4, name: "Anonymous", type: "Hacktivist", region: "Global", status: "Active" },
  { id: 5, name: "Carbanak", type: "Cybercrime", region: "Russia", status: "Dormant" },
]

export default function ThreatActorLibrary() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const filteredActors = mockThreatActors.filter(
    (actor) =>
      (actor.name.toLowerCase().includes(search.toLowerCase()) ||
        actor.type.toLowerCase().includes(search.toLowerCase()) ||
        actor.region.toLowerCase().includes(search.toLowerCase())) &&
      (filter === "all" || actor.type === filter),
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Threat Actor Library</h1>
      <div className="flex space-x-4">
        <Input
          placeholder="Search threat actors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredActors.map((actor) => (
          <Card key={actor.id}>
            <CardHeader>
              <CardTitle>{actor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <Badge>{actor.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Region:</span>
                  <span>{actor.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge variant={actor.status === "Active" ? "default" : "secondary"}>{actor.status}</Badge>
                </div>
              </div>
              <Button className="w-full mt-4">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

