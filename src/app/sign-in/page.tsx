"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const socialButtons = [
  {
    provider: "Apple",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        className="mr-3"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
          fill="#333"
        />
      </svg>
    ),
  },
  {
    provider: "Facebook",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        className="mr-3"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
          fill="#1877F2"
        />
      </svg>
    ),
  },
  {
    provider: "Google",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        className="mr-3"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
];

function SignInForm() {
  const [email, setEmail] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get redirect parameter from URL
  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate email format
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/guest-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: email }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store email (hashed) and session duration in sessionStorage
        try {
          const { storeUserEmail, storeSessionDuration } = await import("@/lib/sessionManager");
          storeUserEmail(email);
          
          // Extract session duration from response if available
          if (data.data?.sessionDuration) {
            storeSessionDuration(data.data.sessionDuration);
            console.log("[SignIn] Session duration stored:", data.data.sessionDuration);
          }
        } catch (err) {
          console.error("[SignIn] Failed to store session data:", err);
        }
        
        toast.success("Login Successful! Welcome to GoKite! ", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Redirect after a short delay to show toast
        setTimeout(() => {
          router.push(redirectTo);
        }, 1000);
      } else {
        const errorData = await response.json();

        // Check for specific error types
        if (response.status === 401 || response.status === 403) {
          toast.error("Invalid email or credentials. Please try again.", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else if (response.status === 404) {
          toast.error("Email not found. Please check your email address.", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error(
            errorData.message || "Unable to sign in. Please try again.",
            {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        }
      }
    } catch (err) {
      console.error("Network error", err);
      toast.error("Network Error! Unable to connect to the server. 🌐", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="flex min-h-screen font-sans bg-gray-100">
        {/* Left Side - Image with Logo */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden min-h-[560px] bg-gradient-to-br from-blue-600 via-blue-400 to-blue-200">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{ backgroundImage: "url('/landingpage/hero.png')" }}
          />
          <div className="relative z-10 text-center">
            <img
              src="/logo-white.png"
              alt="Go Kite Logo"
              className="max-w-xs mx-auto object-contain"
            />
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-10 md:p-6">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2 leading-tight">
              Sign in
            </h1>
            <p className="text-base text-gray-600 mb-8 leading-relaxed">
              Book your entire trip in one place, with free access to Member
              Prices and points.
            </p>
            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-4">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 bg-white transition-colors"
                />
              </div>
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 text-base cursor-pointer transition
                ${
                  submitting
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {submitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-sm text-gray-600 my-8">
              Don't have an account?{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Create one
              </a>
            </p>

            {/* Social Login Buttons */}
            <div className="flex flex-col gap-3">
              {socialButtons.map(({ provider, icon }) => (
                <Button
                  key={provider}
                  type="button"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white flex items-center justify-start text-gray-800 text-base cursor-pointer transition hover:bg-gray-100 hover:text-black"
                  onClick={() =>
                    toast.info(`${provider} Sign In - Coming Soon! 🚀`, {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                    })
                  }
                >
                  {icon}
                  Continue with {provider}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function GoKiteSignup() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
