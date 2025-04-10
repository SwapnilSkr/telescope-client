"use client"; // Ensure this component runs only on the client side

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import useUserStore from "@/stores/userStore";
import { BASE_URL } from "@/utils/baseUrl";
import LoginBackground from "@/public/Login_bg.png";
import TelescopeLogo from "@/public/Telescopelogo.png";
import ClosedEye from "@/public/closed_eye.png";
import Shield from "@/public/attention_logo.png";
import Image from "next/image";
import { Eye } from "lucide-react";
import TermsAndAgreementModal from "@/components/Terms";
import disposableDomains from "disposable-email-domains";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const { user, fetchUser } = useUserStore();
  const router = useRouter();
  
  // Verification states
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(""));
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // List of blocked email domains
  const blockedEmailDomains = [
    // Personal email providers
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "aol.com",
    "icloud.com",
    "protonmail.com",
    "mail.com",
    "zoho.com",
    "yandex.com",
    "gmx.com",
    "live.com",
    "msn.com",

    // Temporary/disposable email providers
    "temp-mail.org",
    "tempmail.com",
    "guerrillamail.com",
    "mailinator.com",
    "10minutemail.com",
    "throwawaymail.com",
    "yopmail.com",
    "getnada.com",
    "dispostable.com",
    "sharklasers.com",
    "trashmail.com",
    "maildrop.cc",
    "tempr.email",
    "fakeinbox.com",
    "tempinbox.com",
    "burpcollaborator.net",
  ];

  // Validate username
  const validateUsername = (username: string): boolean => {
    if (!username.trim()) {
      setUsernameError("Username is required");
      return false;
    }
    
    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters long");
      return false;
    }
    
    if (username.length > 20) {
      setUsernameError("Username cannot exceed 20 characters");
      return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError("Username can only contain letters, numbers, and underscores");
      return false;
    }
    
    setUsernameError(null);
    return true;
  };

  // Validate password
  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    
    if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    
    if (!/[a-z]/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter");
      return false;
    }
    
    if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
      setPasswordError("Password must contain at least one special character");
      return false;
    }
    
    setPasswordError(null);
    return true;
  };

  // Handle username change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    if (newUsername) validateUsername(newUsername);
  };

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword) validatePassword(newPassword);
  };

  // Email validation function
  const validateEmail = (email: string): boolean => {
    if (!email) return false;

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }

    // Extract domain from email
    const domain = email.split("@")[1].toLowerCase();
    
    // Check if domain is in blocked list
    if (blockedEmailDomains.includes(domain)) {
      setEmailError(
        "Please use a work email. Personal and temporary emails are not allowed."
      );
      return false;
    }
    
    // Check if domain is in disposable email domains list from package
    if (disposableDomains.includes(domain)) {
      setEmailError(
        "Please use a work email. Disposable email addresses are not allowed."
      );
      return false;
    }

    // Check for common patterns of disposable emails
    if (/temp|fake|disposable|trash|throw|junk/.test(domain)) {
      setEmailError(
        "Please use a work email. Temporary emails are not allowed."
      );
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    
    // Validate all fields before submission
    const isEmailValid = validateEmail(email);
    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isUsernameValid || !isPasswordValid) {
      return;
    }
    
    if (!acceptedTerms) {
      setError("Please accept the Terms and Conditions to continue");
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/register_account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      // Show verification modal
      setShowVerificationModal(true);
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async () => {
    setVerificationError(null);
    setLoading(true);
    
    const code = verificationCode.join("");
    
    if (code.length !== 6) {
      setVerificationError("Please enter the complete 6-digit code");
      setLoading(false);
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
      useUserStore.getState().setUser(userData);
      useUserStore.getState().setAccessToken(access_token);
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationError(
        error instanceof Error ? error.message : "An error occurred during verification"
      );
    } finally {
      setLoading(false);
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
      
      <div className={`px-[100px] py-[40px] flex items-center justify-between w-full h-full ${bgLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
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
              <p className="text-[36px] font-[500] text-center">
                Create an Account
              </p>
              <p className="text-[16px] font-[400] text-center">
                Enter your details to create your account
              </p>
            </div>
            <form onSubmit={handleSubmit} autoComplete="new-password" spellCheck="false">
              {/* Hidden fields to trick browser autofill */}
              <div style={{ display: 'none' }}>
                <input type="text" name="fakeusernameremembered" />
                <input type="email" name="fakeemailremembered" />
                <input type="password" name="fakepasswordremembered" />
              </div>
              
              <div className="mb-[25px]">
                <input
                  id="username"
                  name="username_prevent_autofill"
                  placeholder="Username"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  value={username}
                  onChange={handleUsernameChange}
                  className={`px-[16px] py-[10px] bg-transparent focus:ring-0 focus:outline-none w-full ${
                    usernameError
                      ? "border-red-400"
                      : "border-[rgba(255,255,255,0.30)]"
                  }`}
                  style={{
                    border: usernameError
                      ? "1px solid rgba(255, 100, 100, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.30)",
                    borderRadius: "12px",
                  }}
                />
                {usernameError && (
                  <p className="text-sm text-red-400 mt-[5px]">{usernameError}</p>
                )}
              </div>
              <div className="mb-[25px]">
                <input
                  id="email"
                  name="email_prevent_autofill"
                  placeholder="Work email address"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  value={email}
                  onChange={handleEmailChange}
                  className={`px-[16px] py-[10px] bg-transparent focus:ring-0 focus:outline-none w-full ${
                    emailError
                      ? "border-red-400"
                      : "border-[rgba(255,255,255,0.30)]"
                  }`}
                  style={{
                    border: emailError
                      ? "1px solid rgba(255, 100, 100, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.30)",
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
                  name="pass_prevent_autofill"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`px-[16px] py-[10px] bg-transparent focus:ring-0 focus:outline-none w-full ${
                    passwordError
                      ? "border-red-400"
                      : "border-[rgba(255,255,255,0.30)]"
                  }`}
                  style={{
                    border: passwordError
                      ? "1px solid rgba(255, 100, 100, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.30)",
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
                {passwordError && (
                  <p className="text-sm text-red-400 mt-[5px]">{passwordError}</p>
                )}
                <div className="text-xs text-white/60 mt-2 space-y-1">
                  <p>Password requirements:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li className={password.length >= 8 ? "text-green-400" : ""}>At least 8 characters</li>
                    <li className={/[A-Z]/.test(password) ? "text-green-400" : ""}>At least one uppercase letter</li>
                    <li className={/[a-z]/.test(password) ? "text-green-400" : ""}>At least one lowercase letter</li>
                    <li className={/[0-9]/.test(password) ? "text-green-400" : ""}>At least one number</li>
                    <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-400" : ""}>At least one special character</li>
                  </ul>
                </div>
              </div>
              <div className="mt-[25px] flex items-center gap-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-white/30 bg-transparent focus:ring-[#A958E3] focus:ring-offset-0"
                />
                <label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-[#BC69F7] hover:underline"
                  >
                    Terms and Conditions
                  </button>
                </label>
              </div>
              {error && (
                <p className="text-sm text-red-400 mt-[15px]">{error}</p>
              )}
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
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                ) : null}
                Sign Up
              </button>
              <p className="text-center text-[20px] text-white font-[500] mt-[30px]">
                Already have an account?{" "}
                <Link href="/" className="text-[#BC69F7]">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Add Terms Modal */}
      <TermsAndAgreementModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setAcceptedTerms(true);
          setShowTermsModal(false);
        }}
      />

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
            <button
              onClick={() => setShowVerificationModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center">Verify Your Email</h2>
            <p className="text-center mb-6">
              We&apos;ve sent a 6-digit verification code to <span className="text-[#BC69F7] font-medium">{email}</span>. 
              Please enter it below to verify your account.
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
                  autoComplete="new-password"
                  name={`code_${index}_prevent_autofill`}
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
              disabled={loading}
            >
              {loading ? (
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
