"use client"; // Ensure this component runs only on the client side

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useUserStore from "@/stores/userStore";
import { BASE_URL } from "@/utils/baseUrl";
import LoginBackground from "@/public/Login_bg.png";
import TelescopeLogo from "@/public/Telescopelogo.png";
import ClosedEye from "@/public/closed_eye.png";
import Shield from "@/public/attention_logo.png";
import Image from "next/image";
import { Eye } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { user, fetchUser } = useUserStore();
  const router = useRouter();

  // List of blocked email domains
  const blockedEmailDomains = [
    // Personal email providers
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com", "icloud.com", "protonmail.com",
    "mail.com", "zoho.com", "yandex.com", "gmx.com", "live.com", "msn.com",
    
    // Temporary/disposable email providers
    "temp-mail.org", "tempmail.com", "guerrillamail.com", "mailinator.com", "10minutemail.com",
    "throwawaymail.com", "yopmail.com", "getnada.com", "dispostable.com", "sharklasers.com",
    "trashmail.com", "maildrop.cc", "tempr.email", "fakeinbox.com", "tempinbox.com", "burpcollaborator.net"
  ];

  // Email validation function
  const validateEmail = (email: string): boolean => {
    if (!email) return false;
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    
    // Check if domain is in blocked list
    const domain = email.split('@')[1].toLowerCase();
    if (blockedEmailDomains.includes(domain)) {
      setEmailError("Please use a work email. Personal and temporary emails are not allowed.");
      return false;
    }
    
    // Check for common patterns of disposable emails
    if (/temp|fake|disposable|trash|throw|junk/.test(domain)) {
      setEmailError("Please use a work email. Temporary emails are not allowed.");
      return false;
    }
    
    setEmailError(null);
    return true;
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail) validateEmail(newEmail);
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validate email before submission
    if (!validateEmail(email)) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/register_account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div
      className="flex min-h-screen w-full justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${LoginBackground.src})`,
        backgroundSize: "cover",
        backgroundColor: "#06002C",
        backgroundPosition: "left center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
      }}
    >
      <div className="p-[100px] flex items-center justify-between w-full h-full">
        <div className="login-title lg:block hidden text-white w-[50%] h-full py-[50px]">
          <Image
            src={TelescopeLogo}
            alt="Telescope Logo"
            width={200}
            height={50}
          />
          <div className="mt-[80px] text-[35px] xl:text-[45px] font-[500]">
            Track, Analyze & Stay
          </div>
          <div className="text-[35px] xl:text-[45px] font-[500]">Ahead of Cyber Threats</div>
          <div className="xl:mt-[80px] mt-[40px] flex flex-col justify-center gap-y-[50px]">
            <div className="flex items-center gap-x-[10px]">
              <Image src={Shield} alt="Shield" width={45} height={45} />
              <p className="xl:text-[18px] text-[16px] text-white font-[400] cursor-pointer text-left">
              Access a comprehensive database of monitored threat actors 
              </p>
            </div>
            <div className="flex items-center gap-x-[10px]">
              <Image src={Shield} alt="Shield" width={45} height={45} />
              <p className="xl:text-[18px] text-[16px] text-white font-[400] cursor-pointer text-left">
              Access a comprehensive database of monitored threat actors 
              </p>
            </div>
            <div className="flex items-center gap-x-[10px]">
              <Image src={Shield} alt="Shield" width={45} height={45} />
              <p className="xl:text-[18px] text-[16px] text-white font-[400] cursor-pointer text-left">
              Access a comprehensive database of monitored threat actors 
              </p>
            </div>
          </div>
        </div>
        <div className="form text-white lg:w-[45%] w-full h-full">
          <div
            className="p-[40px] xl:p-[80px] rounded-lg h-full"
            style={{
              background:
                "linear-gradient(321deg, rgba(191, 191, 191, 0.06) 5.98%, rgba(0, 0, 0, 0.00) 66.28%), rgba(255, 255, 255, 0.04)",
              border: "1px solid #AFAFAF",
              boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.24)",
              borderRadius: "20px",
              backdropFilter: "blur(26.5px)",
            }}
          >
            <div className="mb-[50px]" style={{ lineHeight: "1.5" }}>
              <p className="text-[36px] font-[500] text-center">Create an Account</p>
              <p className="text-[16px] font-[400] text-center">
                Enter your details to create your account
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-[25px]">
                <input
                  id="username"
                  placeholder="Username"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="username"
                  autoCorrect="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-[16px] py-[10px] bg-transparent focus:ring-0 focus:outline-none w-full"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.30)",
                    borderRadius: "12px",
                  }}
                />
              </div>
              <div className="mb-[25px]">
                <input
                  id="email"
                  placeholder="Work email address"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  value={email}
                  onChange={handleEmailChange}
                  className={`px-[16px] py-[10px] bg-transparent focus:ring-0 focus:outline-none w-full ${
                    emailError ? "border-red-400" : "border-[rgba(255,255,255,0.30)]"
                  }`}
                  style={{
                    border: emailError ? "1px solid rgba(255, 100, 100, 0.5)" : "1px solid rgba(255, 255, 255, 0.30)",
                    borderRadius: "12px",
                  }}
                />
                {emailError && (
                  <p className="text-sm text-red-400 mt-[5px]">{emailError}</p>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-[16px] py-[10px] bg-transparent focus:ring-0 focus:outline-none w-full"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.30)",
                    borderRadius: "12px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-6 transform -translate-y-1/2 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Eye size={20} color="white" />
                  ) : (
                    <Image
                      src={ClosedEye}
                      alt="Show password"
                      width={20}
                      height={20}
                    />
                  )}
                </button>
              </div>
              {error && <p className="text-sm text-red-400 mt-[15px]">{error}</p>}
              <button
                type="submit"
                className="w-full text-white"
                style={{
                  background:
                    "linear-gradient(89deg, #A958E3 -2.61%, #8B0EE5 53.73%, #6908AE 116.23%)",
                  borderRadius: "12px",
                  padding: "10px",
                  fontSize: "20px",
                  fontWeight: "500",
                  marginTop: "25px",
                }}
              >
                Sign Up
              </button>
              <p className="text-center text-[20px] text-white font-[500] mt-[30px]">
                Already have an account?{" "}
                <Link href="/" className="text-[#BC69F7]">
                  Sign In
                </Link>
              </p>
              <div className="terms support care flex justify-center gap-[20px] mt-[10px]">
                <p className="text-[16px] text-white/30 font-[400] cursor-pointer hover:text-white underline text-center">
                  Terms & Conditions
                </p>
                <p className="text-[16px] text-white/30 font-[400] cursor-pointer hover:text-white underline text-center">
                  Support
                </p>
                <p className="text-[16px] text-white/30 font-[400] cursor-pointer hover:text-white underline text-center">
                  Customer Care
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
