import React from "react";

// Base skeleton component
export const Skeleton = ({
  className = "",
  variant = "rectangular",
}: {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
}) => {
  const baseClass = "animate-pulse bg-gray-200";
  const variantClass = {
    rectangular: "rounded",
    circular: "rounded-full",
    text: "rounded h-4",
  }[variant];

  return <div className={`${baseClass} ${variantClass} ${className}`} />;
};

// Page skeleton with TopNav and Footer structure
export const PageSkeleton = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* TopNav Skeleton */}
      <div className="w-full border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <Skeleton className="h-12 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer Skeleton */}
      <div className="w-full px-6 lg:px-12 py-6 mt-20 border-t-2 bg-[#C8E5ED]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Hero Banner Skeleton
export const HeroBannerSkeleton = () => {
  return (
    <section className="w-full px-6 lg:px-12">
      <div className="rounded-[2.5rem] bg-gray-200 relative min-h-[600px] animate-pulse">
        <div className="relative z-10 px-8 lg:px-16 pt-12 pb-8">
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-64 mx-auto mb-8" />

          {/* Icon Navigation Skeleton */}
          <div className="flex items-center justify-center gap-4 lg:gap-8 mb-8 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton variant="circular" className="w-16 h-16 lg:w-20 lg:h-20" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>

          {/* Booking Card Skeleton */}
          <div className="max-w-7xl mx-auto bg-white rounded-3xl p-6 lg:p-8">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <Skeleton className="lg:col-span-6 h-20" />
              <Skeleton className="lg:col-span-4 h-20" />
              <Skeleton className="lg:col-span-2 h-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Card Carousel Skeleton
export const CarouselSkeleton = () => {
  return (
    <section className="px-6 lg:px-12 mt-5">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-10 w-64" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton variant="circular" className="h-10 w-10" />
          <Skeleton variant="circular" className="h-10 w-10" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl overflow-hidden">
            <Skeleton className="h-80 w-full" />
            <div className="p-4 bg-gray-50">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Content Page Skeleton (for about-us, terms, etc.)
export const ContentPageSkeleton = () => {
  return (
    <PageSkeleton>
      <div className="flex-1 px-6 lg:px-12 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
            <Skeleton className="h-10 w-3/4 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-4/5 mb-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageSkeleton>
  );
};

// Home Page Full Skeleton
export const HomePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* TopNav */}
      <div className="w-full border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <Skeleton className="h-12 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      <main>
        {/* Hero Banner */}
        <HeroBannerSkeleton />

        {/* Carousels */}
        <CarouselSkeleton />
        <CarouselSkeleton />
      </main>

      {/* Footer */}
      <div className="w-full px-6 lg:px-12 py-6 mt-20 border-t-2 bg-[#C8E5ED]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Work in Progress Skeleton
export const WorkInProgressSkeleton = () => {
  return (
    <PageSkeleton>
      <div className="flex-1 px-6 lg:px-12 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center rounded-2xl p-12 max-w-2xl">
              <Skeleton variant="circular" className="w-20 h-20 mx-auto mb-6" />
              <Skeleton className="h-10 w-64 mx-auto mb-4" />
              <Skeleton className="h-8 w-48 mx-auto mb-3" />
              <Skeleton className="h-6 w-96 mx-auto mb-4" />
              <Skeleton className="h-4 w-80 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </PageSkeleton>
  );
};

