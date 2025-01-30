import { Shield, Search, AlertTriangle } from "lucide-react";

const features = [
  {
    name: "Cyber Module",
    description:
      "Track Telegram groups and channels relevant to cyber threats and incidents.",
    icon: Shield,
    status: "Active",
  },
  {
    name: "OSINT Module",
    description:
      "Monitor open-source intelligence channels for comprehensive OSINT analysis.",
    icon: Search,
    status: "Coming Soon",
  },
  {
    name: "Crime Monitoring Module",
    description:
      "Keep tabs on criminal activities across various Telegram channels.",
    icon: AlertTriangle,
    status: "Coming Soon",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <h2 className="text-3xl font-bold tracking-tight text-center mb-16">
        Key Features
      </h2>
      <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0 px-6">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
          >
            <div className="md:flex-shrink-0 flex justify-center">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900">
                {<feature.icon className="w-1/3 h-1/3" />}
              </div>
            </div>
            <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
              <h3 className="text-lg font-semibold leading-7 tracking-tight">
                {feature.name}
              </h3>
              <p className="mt-2 text-base leading-7 text-muted-foreground">
                {feature.description}
              </p>
              <p
                className={`mt-2 text-sm font-semibold ${feature.status === "Active" ? "text-green-600" : "text-yellow-600"}`}
              >
                {feature.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
