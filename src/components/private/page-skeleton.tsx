import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonPage() {
  return (
    <div className="space-y-4 gap-4 mx-auto mb-12">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-end">
          <Skeleton className="w-32 h-10" />
        </div>
        <div className="w-full flex flex-col gap-2 items-center lg:flex-row lg:gap-6">
          <Skeleton className="w-full h-12 rounded-4xl" />
          <Skeleton className="w-full h-12" />
        </div>
      </div>
      <Skeleton className="min-w-full rounded-2xl min-h-[37rem] max-h-[37rem]" />
    </div>
  );
}
