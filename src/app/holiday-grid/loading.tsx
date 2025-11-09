import { PageSkeleton, CarouselSkeleton } from "@/components/common/SkeletonLoader";

export default function Loading() {
  return (
    <PageSkeleton>
      <div className="px-6 lg:px-12 py-8">
        <CarouselSkeleton />
      </div>
    </PageSkeleton>
  );
}

