"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SEOHead from "@/components/seo/SEOHead";
import { SEO_CONFIG, getCanonicalUrl } from "@/lib/seo/config";

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after a brief moment to allow SEO meta tags to be set
    const timer = setTimeout(() => {
      router.push("/master-landing-page");
    }, 100);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <SEOHead
        title="Sign In - GoKite | Login to Your Account"
        description="Sign in to your GoKite account to access your bookings, manage your travel plans, and enjoy exclusive member benefits."
        keywords={["sign in", "login", "GoKite login", "account login", "travel account"]}
        pageName="Sign In"
        canonical="/sign-in"
        robots="noindex, nofollow"
        openGraph={{
          title: "Sign In - GoKite",
          description: "Sign in to your GoKite account to access your bookings and manage your travel plans.",
          image: getCanonicalUrl("/images/og-default.jpg"),
          url: getCanonicalUrl("/sign-in"),
          type: "website",
        }}
        twitter={{
          title: "Sign In - GoKite",
          description: "Sign in to your GoKite account to access your bookings and manage your travel plans.",
          image: getCanonicalUrl("/images/og-default.jpg"),
        }}
        schema={{
          breadcrumb: [
            { name: "Home", url: SEO_CONFIG.baseDomain },
            { name: "Sign In", url: getCanonicalUrl("/sign-in") },
          ],
        }}
      />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    </>
  );
}
