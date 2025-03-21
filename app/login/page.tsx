"use client"; // Ensure this component runs only on the client side

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import useUserStore from "@/stores/userStore";
import { BASE_URL } from "@/utils/baseUrl";
import LoginBackground from "@/public/Login_bg.png";
import TelescopeLogo from "@/public/Telescopelogo.png";
import ClosedEye from "@/public/closed_eye.png";
import FilledCheckbox from "@/public/filled_checkbox.png";
import Shield from "@/public/attention_logo.png";
import Image from "next/image";
import { Eye } from "lucide-react";

interface ApiResponse {
  access_token: string;
  user: {
    email: string;
    username: string;
  };
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const { setUser, setAccessToken, user, fetchUser } = useUserStore();
  const router = useRouter();
  
  // Verification states for unverified users
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(""));
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  useEffect(() => {
    // Preload the background image
    const img = new (window.Image as any)();
    img.src = LoginBackground.src;
    img.onload = () => setBgLoaded(true);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Handle verification code input
  const handleVerificationCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]; // Only take the first character if multiple are pasted
    }

    if (!/^\d*$/.test(value)) {
      return; // Only allow digits
    }

    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);

    // Move to next input if value is entered
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key press in verification input
  const handleVerificationKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      codeInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      // Move to previous input on left arrow
      codeInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      // Move to next input on right arrow
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste in verification input
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    
    if (!/^\d+$/.test(pastedData)) {
      return; // Only allow digits
    }
    
    const digits = pastedData.slice(0, 6).split("");
    const newVerificationCode = [...verificationCode];
    
    digits.forEach((digit, index) => {
      if (index < 6) {
        newVerificationCode[index] = digit;
      }
    });
    
    setVerificationCode(newVerificationCode);
    
    // Focus the appropriate input after paste
    if (digits.length < 6) {
      codeInputRefs.current[digits.length]?.focus();
    } else {
      codeInputRefs.current[5]?.focus();
    }
  };

  const verifyEmail = async () => {
    setVerificationError(null);
    setIsVerifying(true);
    
    const code = verificationCode.join("");
    
    if (code.length !== 6) {
      setVerificationError("Please enter the complete 6-digit code");
      setIsVerifying(false);
      return;
    }
    
    try {
      const response = await fetch(`${BASE_URL}/verify_email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          verification_code: code,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Verification failed");
      }
      
      // Store user and token
      const { user: userData, access_token } = data;
      setUser(userData);
      setAccessToken(access_token);
      
      // Close modal and redirect to dashboard
      setShowVerificationModal(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationError(
        error instanceof Error ? error.message : "An error occurred during verification"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const resendVerificationCode = async () => {
    setVerificationError(null);
    setIsResending(true);
    
    try {
      const response = await fetch(`${BASE_URL}/resend_verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Failed to resend verification code");
      }
      
      // Reset verification code inputs
      setVerificationCode(Array(6).fill(""));
      
      // Focus first input
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 100);
      
    } catch (error) {
      console.error("Failed to resend code:", error);
      setVerificationError(
        error instanceof Error ? error.message : "Failed to resend verification code"
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoggingIn(true);

    try {
      const response = await fetch(`${BASE_URL}/authorize_account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check for specific error about unverified account
        if (response.status === 401 && data.detail === "Invalid email or password") {
          // Check if the user exists but isn't verified
          const checkUserResponse = await fetch(`${BASE_URL}/check_user_verification`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
          
          const checkUserData = await checkUserResponse.json();
          
          if (checkUserResponse.ok && checkUserData.exists && !checkUserData.is_verified) {
            // Show verification modal if user exists but isn't verified
            setShowVerificationModal(true);
            setIsLoggingIn(false);
            return;
          }
        }
        
        throw new Error(data.detail || "Login failed");
      }

      const apiResponse: ApiResponse = data;
      setUser(apiResponse.user);
      setAccessToken(apiResponse.access_token);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full justify-center overflow-hidden"
      style={{
        backgroundColor: "#06002C", // Base background color always visible
        backgroundImage: bgLoaded ? `url(${LoginBackground.src})` : 'none',
        backgroundSize: "cover",
        backgroundPosition: "left center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        transition: "background-image 0.3s ease-in-out",
      }}
    >
      {!bgLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-white/30 border-t-[#A958E3] rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className={`p-[100px] flex items-center justify-between w-full h-full ${bgLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
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
          <div className="text-[35px] xl:text-[45px] font-[500]">
            Ahead of Cyber Threats
          </div>
          <div className="xl:mt-[80px] mt-[40px] flex flex-col justify-center gap-y-[50px]">
            <div className="flex items-center gap-x-[10px]">
              <Image src={Shield} alt="Shield" width={45} height={45} />
              <p className="xl:text-[18px] text-[16px] text-white font-[400] cursor-pointer text-left">
                Track 10,000+ sources – Real-time monitoring of cyber threats
                and intelligence.
              </p>
            </div>
            <div className="flex items-center gap-x-[10px]">
              <Image src={Shield} alt="Shield" width={45} height={45} />
              <p className="xl:text-[18px] text-[16px] text-white font-[400] cursor-pointer text-left">
                Raw, noise-free data – Direct mentions of brands, threats, and
                entities.
              </p>
            </div>
            <div className="flex items-center gap-x-[10px]">
              <Image src={Shield} alt="Shield" width={45} height={45} />
              <p className="xl:text-[18px] text-[16px] text-white font-[400] cursor-pointer text-left">
                Automated insights – AI-driven filtering and categorization for
                action-ready intelligence.
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
              <p className="text-[36px] font-[500] text-center">Welcome Back</p>
              <p className="text-[16px] font-[400] text-center">
                Enter your email to sign in to your account
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-[25px]">
                <input
                  id="email"
                  placeholder="Email address"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-[16px] py-[10px] bg-transparent focus:ring-0 focus:outline-none w-full"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.30)",
                    borderRadius: "12px",
                  }}
                />
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
              {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
              <div className="remember-me mt-[15px] flex items-center gap-[10px]">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 border border-white/30 rounded cursor-pointer flex items-center justify-center overflow-hidden ${
                    rememberMe ? "p-0" : "bg-transparent"
                  }`}
                  role="checkbox"
                  aria-checked={rememberMe}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      setRememberMe(!rememberMe);
                    }
                  }}
                >
                  {rememberMe && (
                    <Image
                      src={FilledCheckbox}
                      alt="Checked"
                      className="object-cover w-[24px] h-[24px] rounded"
                      style={{ display: "block" }}
                    />
                  )}
                </div>
                <label
                  onClick={() => setRememberMe(!rememberMe)}
                  className="cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <button
                type="submit"
                className="w-full text-white mt-[25px] flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(89deg, #A958E3 -2.61%, #8B0EE5 53.73%, #6908AE 116.23%)",
                  borderRadius: "12px",
                  padding: "10px",
                  fontSize: "20px",
                  fontWeight: "500",
                }}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                ) : null}
                Sign In
              </button>
              <div
                className="flex justify-center"
                style={{ marginBottom: "50px", marginTop: "10px" }}
              >
                <Link
                  href="/forgot-password"
                  className="forgot-password text-white text-center text-[16px] font-[400]"
                >
                  Forgot Password?
                </Link>
              </div>
              <p className="text-center text-[20px] text-white font-[500]">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-[#BC69F7]">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-[#0D0640] text-white p-8 rounded-xl max-w-md w-full relative"
            style={{
              background: "linear-gradient(321deg, rgba(191, 191, 191, 0.06) 5.98%, rgba(0, 0, 0, 0.00) 66.28%), rgba(13, 6, 64, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">Email Verification Required</h2>
            <p className="text-center mb-6">
              Your account needs to be verified before logging in. We&apos;ve sent a 6-digit verification code to <span className="text-[#BC69F7] font-medium">{email}</span>. 
              Please enter it below.
            </p>
            
            <div className="flex justify-center gap-2 mb-6">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    codeInputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleVerificationKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-14 text-center text-xl bg-[#1A123A] border border-[#A958E3]/30 rounded-lg focus:border-[#A958E3] focus:ring-1 focus:ring-[#A958E3] focus:outline-none"
                  style={{
                    caretColor: "transparent",
                  }}
                />
              ))}
            </div>
            
            {verificationError && (
              <p className="text-red-400 text-sm text-center mb-4">
                {verificationError}
              </p>
            )}
            
            <button
              onClick={verifyEmail}
              className="w-full flex items-center justify-center py-3 mb-4"
              style={{
                background: "linear-gradient(89deg, #A958E3 -2.61%, #8B0EE5 53.73%, #6908AE 116.23%)",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "500",
              }}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              ) : null}
              Verify Email
            </button>
            
            <div className="text-center">
              <button
                onClick={resendVerificationCode}
                className="text-[#BC69F7] text-sm font-medium hover:underline disabled:opacity-50 disabled:hover:no-underline"
                disabled={isResending}
              >
                {isResending ? "Sending..." : "Didn't receive the code? Resend"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
