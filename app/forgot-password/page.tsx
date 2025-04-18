"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { BASE_URL } from "@/utils/baseUrl";
import LoginBackground from "@/public/Login_bg.png";
import TelescopeLogo from "@/public/Telescopelogo.png";
import ClosedEye from "@/public/closed_eye.png";
import Image from "next/image";
import { Eye } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  
  // Reset code states
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetCode, setResetCode] = useState<string[]>(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  // Resend Code states
  const [resendCooldown, setResendCooldown] = useState(0);
  const [canResend, setCanResend] = useState(false); // Start as false, only allow resend after initial send + cooldown

  useEffect(() => {
    // Preload the background image
    const img = new (window.Image as any)();
    img.src = LoginBackground.src;
    img.onload = () => setBgLoaded(true);
  }, []);

  // Cooldown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    } else if (showResetForm) { // Only allow resend if the form is shown
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [resendCooldown, showResetForm]);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }

    setEmailError(null);
    return true;
  };

  // Password validation function
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

  // Confirm password validation
  const validateConfirmPassword = (confirmPassword: string): boolean => {
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    }
    
    if (confirmPassword !== newPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    
    setConfirmPasswordError(null);
    return true;
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail) validateEmail(newEmail);
  };

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    if (newPass) validatePassword(newPass);
    if (confirmPassword) validateConfirmPassword(confirmPassword);
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPass = e.target.value;
    setConfirmPassword(confirmPass);
    if (confirmPass) validateConfirmPassword(confirmPass);
  };

  // Handle reset code input
  const handleResetCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]; // Only take the first character if multiple are pasted
    }

    if (!/^\d*$/.test(value)) {
      return; // Only allow digits
    }

    const newResetCode = [...resetCode];
    newResetCode[index] = value;
    setResetCode(newResetCode);

    // Move to next input if value is entered
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key press in reset code input
  const handleResetKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !resetCode[index] && index > 0) {
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

  // Handle paste in reset code input
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    
    if (!/^\d+$/.test(pastedData)) {
      return; // Only allow digits
    }
    
    const digits = pastedData.slice(0, 6).split("");
    const newResetCode = [...resetCode];
    
    digits.forEach((digit, index) => {
      if (index < 6) {
        newResetCode[index] = digit;
      }
    });
    
    setResetCode(newResetCode);
    
    // Focus the appropriate input after paste
    if (digits.length < 6) {
      codeInputRefs.current[digits.length]?.focus();
    } else {
      codeInputRefs.current[5]?.focus();
    }
  };

  // Send reset password request
  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    
    // Validate email
    if (!validateEmail(email)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setMessage("Password reset code sent. Please check your email.");
        setShowResetForm(true);
        setCanResend(false); // Disable resend initially
        setResendCooldown(60); // Start 60-second cooldown
      } else {
        const errorData = await response.json();
        setEmailError(errorData.detail || "Failed to send reset code");
      }
    } catch (error) {
      console.error("Forgot password request failed:", error);
      setMessage(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend reset code request
  const handleResendCode = async () => {
    setMessage(null); // Clear previous messages
    setEmailError(null);
    setResetError(null);
    setIsSubmitting(true); // Show loading state on resend button if needed (optional)

    try {
      const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("New password reset code sent. Please check your email.");
        setCanResend(false); // Disable resend button again
        setResendCooldown(60); // Restart 60-second cooldown
      } else {
        const errorData = await response.json();
        setResetError(errorData.detail || "Failed to resend code. Please try again.");
      }
    } catch (error) {
      setResetError("An error occurred while resending the code. Please try again.");
      console.error("Resend code error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset password with code
  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setResetError(null);
    
    // Validate inputs
    const isPasswordValid = validatePassword(newPassword);
    const isConfirmValid = validateConfirmPassword(confirmPassword);
    
    if (!isPasswordValid || !isConfirmValid) {
      return;
    }
    
    // Check if reset code is complete
    const code = resetCode.join("");
    if (code.length !== 6) {
      setResetError("Please enter the complete 6-digit reset code");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reset_code: code,
          new_password: newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Password reset failed");
      }
      
      // Success, redirect to login page
      setMessage("Password reset successful. You can now log in with your new password.");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Password reset failed:", error);
      setResetError(error instanceof Error ? error.message : "An error occurred during password reset");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "#06002C", // Base background color always visible
        backgroundImage: bgLoaded ? `url(${LoginBackground.src})` : 'none',
        backgroundSize: "cover",
        backgroundPosition: "center",
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
      
      <div className={`w-full max-w-md mx-auto px-6 ${bgLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        <div
          className="p-8 rounded-lg"
          style={{
            background:
              "linear-gradient(321deg, rgba(191, 191, 191, 0.06) 5.98%, rgba(0, 0, 0, 0.00) 66.28%), rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.24)",
            borderRadius: "20px",
            backdropFilter: "blur(26.5px)",
          }}
        >
          <div className="mb-6 text-center">
            <Image
              src={TelescopeLogo}
              alt="Telescope Logo"
              width={140}
              height={35}
              className="mx-auto mb-6"
            />
            <h1 className="text-2xl font-medium text-white mb-2">Reset Password</h1>
            <p className="text-sm text-white/70">
              {!showResetForm 
                ? "Enter your email to receive a password reset code" 
                : "Enter the code sent to your email and your new password"}
            </p>
          </div>
          
          {message && (
            <div className="mb-5 p-3 bg-[#2b1d4e] text-white rounded-lg text-center text-sm">
              {message}
            </div>
          )}
          
          {!showResetForm ? (
            <form onSubmit={handleForgotPassword} autoComplete="new-password" spellCheck="false">
              {/* Hidden fields to trick browser autofill */}
              <div style={{ display: 'none' }}>
                <input type="email" name="fakeemailremembered" />
              </div>
              
              <div className="mb-5">
                <input
                  id="email"
                  placeholder="Email address"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  value={email}
                  onChange={handleEmailChange}
                  className={`px-4 py-3 bg-transparent focus:ring-0 focus:outline-none w-full ${
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
                  <p className="text-xs text-red-400 mt-2">{emailError}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full text-white mt-2 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(89deg, #A958E3 -2.61%, #8B0EE5 53.73%, #6908AE 116.23%)",
                  borderRadius: "12px",
                  padding: "10px",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                ) : null}
                Send Reset Code
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} autoComplete="new-password" spellCheck="false">
              {/* Hidden fields to trick browser autofill */}
              <div style={{ display: 'none' }}>
                <input type="password" name="fakepasswordremembered" />
                <input type="password" name="fakepasswordconfirmremembered" />
              </div>
              
              <div className="mb-5">
                <label className="block text-xs font-medium mb-2 text-white/80">Reset Code</label>
                <div className="flex justify-center gap-1 mb-2">
                  {resetCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        codeInputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      autoComplete="off"
                      value={digit}
                      onChange={(e) => handleResetCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleResetKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-10 h-12 text-center text-lg bg-[#1A123A] border border-[#A958E3]/30 rounded-lg focus:border-[#A958E3] focus:ring-1 focus:ring-[#A958E3] focus:outline-none text-white"
                      style={{
                        caretColor: "transparent",
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Resend Code Button/Timer */}
              <div className="mt-4 text-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isSubmitting} // Optional: disable while submitting
                    className="text-sm text-indigo-400 hover:text-indigo-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    Resend Code
                  </button>
                ) : (
                  <p className="text-sm text-gray-500">
                    Resend code in {resendCooldown}s
                  </p>
                )}
              </div>
              
              <div className="mb-5">
                <label className="block text-xs font-medium mb-2 text-white/80">New Password</label>
                <div className="relative">
                  <input
                    id="new-password"
                    placeholder="Enter new password"
                    type={showPassword ? "text" : "password"}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className={`px-4 py-3 bg-transparent focus:ring-0 focus:outline-none w-full ${
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <Eye size={18} color="white" />
                    ) : (
                      <Image
                        src={ClosedEye}
                        alt="Show password"
                        width={18}
                        height={18}
                      />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-red-400 mt-2">{passwordError}</p>
                )}
                <div className="text-[10px] text-white/60 mt-2 grid grid-cols-2 gap-1">
                  <div className={`flex items-center gap-1 ${newPassword.length >= 8 ? "text-green-400" : ""}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1 ${/[A-Z]/.test(newPassword) ? "text-green-400" : ""}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>Uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1 ${/[a-z]/.test(newPassword) ? "text-green-400" : ""}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>Lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1 ${/[0-9]/.test(newPassword) ? "text-green-400" : ""}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>Number</span>
                  </div>
                  <div className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(newPassword) ? "text-green-400" : ""}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>Special character</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-5">
                <label className="block text-xs font-medium mb-2 text-white/80">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    placeholder="Confirm new password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`px-4 py-3 bg-transparent focus:ring-0 focus:outline-none w-full ${
                      confirmPasswordError
                        ? "border-red-400"
                        : "border-[rgba(255,255,255,0.30)]"
                    }`}
                    style={{
                      border: confirmPasswordError
                        ? "1px solid rgba(255, 100, 100, 0.5)"
                        : "1px solid rgba(255, 255, 255, 0.30)",
                      borderRadius: "12px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <Eye size={18} color="white" />
                    ) : (
                      <Image
                        src={ClosedEye}
                        alt="Show password"
                        width={18}
                        height={18}
                      />
                    )}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="text-xs text-red-400 mt-2">{confirmPasswordError}</p>
                )}
              </div>
              
              {resetError && (
                <p className="text-xs text-red-400 mb-4">{resetError}</p>
              )}
              
              <button
                type="submit"
                className="w-full text-white mt-2 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(89deg, #A958E3 -2.61%, #8B0EE5 53.73%, #6908AE 116.23%)",
                  borderRadius: "12px",
                  padding: "10px",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                ) : null}
                Reset Password
              </button>
            </form>
          )}
          
          <div className="mt-5 text-center">
            <Link href="/" className="text-[#BC69F7] text-sm hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 