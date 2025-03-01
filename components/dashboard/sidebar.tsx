import Link from "next/link";
import { usePathname } from "next/navigation";
import TelescopeLogo from "@/public/Telescopelogo.png";
import Module from "@/public/module.png";
import ModuleFill from "@/public/modulefill.png";
import Realtime from "@/public/realtime.png";
import RealtimeFill from "@/public/realtimefill.png";
import Alert from "@/public/alert.png";
import AlertFill from "@/public/alertfill.png";
import Threat from "@/public/threat.png";
import ThreatFill from "@/public/threatfill.png";
import Pricing from "@/public/pricing.png";
import PricingFill from "@/public/pricingfill.png";
import useUserStore from "@/stores/userStore";
import Image from "next/image";

const LogOutIcon = ({ fill, className }: { fill: boolean, className: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 27" fill="none">
      <path 
        d="M10.4288 8.39846C10.7733 4.39881 12.8286 2.76562 17.3282 2.76562H17.4727C22.4389 2.76562 24.4276 4.75434 24.4276 9.72057V16.9644C24.4276 21.9306 22.4389 23.9193 17.4727 23.9193H17.3282C12.862 23.9193 10.8066 22.3083 10.44 18.3754M17.206 13.3314H4.56269M7.04025 9.60946L3.31836 13.3314L7.04025 17.0533" 
        stroke={fill ? "#A958E3" : "white"} 
        strokeWidth="1.81802" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={className}
      />
    </svg>
  );
};

const menuItems = [
  { icon: Module, fillIcon: ModuleFill, label: "Module Overview", href: "/dashboard" },
  { icon: Realtime, fillIcon: RealtimeFill, label: "Real-Time Feed", href: "/dashboard/real-time-feed" },
  { icon: Alert, fillIcon: AlertFill, label: "Alert Settings", href: "/dashboard/alert-settings" },
  { icon: Threat, fillIcon: ThreatFill, label: "Threat Actor Library", href: "/dashboard/threat-actors" },
  { icon: Pricing, fillIcon: PricingFill, label: "Pricing", href: "/dashboard/pricing" },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { clearUser } = useUserStore();

  return (
    <div className={`flex flex-col w-[200px] xl:w-[300px] text-white bg-[#111427] ${className} p-[30px]`}>
      <div className="flex items-center h-16 mb-[50px]">
        <Image src={TelescopeLogo} alt="Telescope Logo" width={150} height={50} />
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-[30px]">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded-lg hover:text-[#A958E3] group ${
                  pathname === item.href ? "text-[#A958E3]" : ""
                }`}
              >
                <div className="relative w-[20px] h-[20px] mr-3 flex items-center justify-center">
                  <Image 
                    src={item.icon} 
                    alt={item.label} 
                    width={20} 
                    height={20} 
                    className={`absolute inset-0 ${
                      pathname === item.href ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
                    }`} 
                  />
                  <Image 
                    src={item.fillIcon} 
                    alt={`${item.label} (active)`} 
                    width={20} 
                    height={20} 
                    className={`absolute inset-0 ${
                      pathname === item.href ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`} 
                  />
                </div>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="">
        <button
          onClick={() => clearUser()}
          className="flex items-center w-full p-2 rounded-lg hover:text-[#A958E3] group"
        >
          <div className="mr-2">
            <LogOutIcon fill={false} className="group-hover:stroke-[#A958E3]" />
          </div>
          Logout
        </button>
      </div>
    </div>
  );
}
