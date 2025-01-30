import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Radio, Bell, Users, LogOut } from "lucide-react";
import useUserStore from "@/stores/userStore";

const menuItems = [
  { icon: LayoutDashboard, label: "Module Overview", href: "/dashboard" },
  { icon: Radio, label: "Real-Time Feed", href: "/dashboard/real-time-feed" },
  { icon: Bell, label: "Alert Settings", href: "/dashboard/alert-settings" },
  {
    icon: Users,
    label: "Threat Actor Library",
    href: "/dashboard/threat-actors",
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { clearUser } = useUserStore();

  return (
    <div className={`flex flex-col w-64 bg-white border-r ${className}`}>
      <div className="flex items-center justify-center h-16 border-b">
        <span className="text-2xl font-semibold">Telescope</span>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                  pathname === item.href ? "bg-gray-100" : ""
                }`}
              >
                <item.icon className="w-6 h-6 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={() => clearUser()}
          className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100"
        >
          <LogOut className="w-6 h-6 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
