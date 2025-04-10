import { forwardRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import TelescopeLogo from "@/public/Telescopelogo.png";
import Module from "@/public/module.png";
import ModuleFill from "@/public/modulefill.png";
import Realtime from "@/public/realtime.png";
import RealtimeFill from "@/public/realtimefill.png";
import Alert from "@/public/alert.png";
import AlertFill from "@/public/alertfill.png";
import Threat from "@/public/Threat.png";
import ThreatFill from "@/public/threatfill.png";
import useUserStore from "@/stores/userStore";
import { useRouter } from "next/navigation";

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
];

export const MobileMenu = forwardRef<
  HTMLDivElement,
  { open: boolean; setOpen: (open: boolean) => void }
>(({ open, setOpen }, ref) => {
  const pathname = usePathname();
  const router = useRouter();
  const { clearUser } = useUserStore();
  const [isClosing, setIsClosing] = useState(false);
  
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      document.body.style.overflow = '';
    }, 300); // Match animation duration
  };
  
  const handleLogout = () => {
    setIsClosing(true);
    setTimeout(() => {
      clearUser();
      setOpen(false);
      document.body.style.overflow = '';
      router.push("/");
    }, 300); // Match animation duration
  };
  
  if (!open) return null;

  return (
    <>
      <style jsx global>{`
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          z-index: 9999;
          animation: ${isClosing ? 'fadeOut' : 'fadeIn'} 0.3s ease forwards;
        }
        
        .mobile-menu-panel {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          width: 280px;
          background-color: #111427;
          color: white;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 10px rgba(0, 0, 0, 0.5);
          animation: ${isClosing ? 'slideOut' : 'slideIn'} 0.3s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        
        @keyframes slideOut {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
      `}</style>
      
      <div className="mobile-menu-overlay" onClick={handleClose}></div>
      <div className="mobile-menu-panel p-[30px]" ref={ref}>
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white hover:bg-[#1A1A2E] hover:text-[#B435D4]"
            onClick={handleClose}
          >
            <X className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        
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
                  onClick={handleClose}
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
        
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 rounded-lg hover:text-[#A958E3] group"
          >
            <div className="mr-2">
              <LogOutIcon fill={false} className="group-hover:stroke-[#A958E3]" />
            </div>
            Logout
          </button>
        </div>
      </div>
    </>
  );
});

MobileMenu.displayName = "MobileMenu";
