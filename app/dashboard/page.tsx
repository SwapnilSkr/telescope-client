import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, Bell, Users, BarChart, Shield, Zap } from "lucide-react";

const modules = [
  {
    name: "Cyber Module",
    description:
      "Track Telegram groups and channels relevant to cyber threats and incidents.",
    status: "Active",
    features: [
      {
        name: "Real-Time Feed",
        description:
          "Monitor posts from Telegram channels in real-time with advanced search and filtering capabilities.",
        icon: Radio,
      },
      {
        name: "Alert Settings",
        description:
          "Configure custom alerts based on specific keywords, threat actors, or types of threats.",
        icon: Bell,
      },
      {
        name: "Threat Actor Library",
        description:
          "Access a comprehensive database of monitored threat actors with detailed profiles and activity timelines.",
        icon: Users,
      },
    ],
  },
  {
    name: "OSINT Module",
    description:
      "Monitor open-source intelligence channels for comprehensive OSINT analysis.",
    status: "Coming Soon",
  },
  {
    name: "Crime Monitoring Module",
    description:
      "Keep tabs on criminal activities across various Telegram channels.",
    status: "Coming Soon",
  },
];

const platformBenefits = [
  {
    title: "Comprehensive Threat Intelligence",
    description:
      "Gain a holistic view of the threat landscape by combining data from multiple sources and modules.",
    icon: Shield,
  },
  {
    title: "Proactive Risk Mitigation",
    description:
      "Stay ahead of potential threats with real-time alerts and actionable intelligence.",
    icon: Zap,
  },
  {
    title: "Data-Driven Decision Making",
    description:
      "Leverage advanced analytics and visualizations to make informed security decisions.",
    icon: BarChart,
  },
];

export default function ModuleOverview() {
  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <h1 className="text-3xl font-bold">Module Overview</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.name} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {module.name}
                  <Badge
                    variant={
                      module.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {module.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="mb-4 text-sm text-gray-600">
                  {module.description}
                </p>
                {module.features && (
                  <div className="space-y-4">
                    {module.features.map((feature) => (
                      <div key={feature.name} className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <feature.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">
                            {feature.name}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-12 px-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Empowering Your Cybersecurity Strategy
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {platformBenefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="inline-block p-3 bg-primary rounded-full text-white mb-4">
                <benefit.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
