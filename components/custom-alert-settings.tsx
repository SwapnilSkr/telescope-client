import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CustomAlertSettings() {
  const [keyword, setKeyword] = useState("")
  const [frequency, setFrequency] = useState("immediate")

  const alertTypes = [
    { id: "ransomware", label: "Ransomware" },
    { id: "phishing", label: "Phishing" },
    { id: "data-breach", label: "Data Breach" },
    { id: "malware", label: "Malware" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Alert Settings</CardTitle>
        <CardDescription>Configure your alert preferences for real-time notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium">Keyword or Threat Actor</label>
            <Input
              placeholder="Enter keyword or threat actor name"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Alert Types</label>
            <div className="mt-2 space-y-2">
              {alertTypes.map((type) => (
                <div key={type.id} className="flex items-center">
                  <Checkbox id={type.id} />
                  <label htmlFor={type.id} className="ml-2 text-sm">
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Alert Frequency</label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Save Alert Settings</Button>
        </form>
      </CardContent>
    </Card>
  )
}

