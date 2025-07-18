import { Skeleton } from '@/components/ui/skeleton';

export default function ShiftPageSkeleton() {
  return (
    <div className="flex flex-col gap-4 space-y-4 mx-auto mb-12">
      <Skeleton className="w-24" />
      <div className="flex flex-col lg:flex-row gap-6">
        <Skeleton className="w-full h-full max-w-[350px] max-h-[650px] lg:max-w-[425px] lg:min-h-[645px] lg:max-h-[645px]" />
        <Skeleton className="w-full min-w-[350px] lg:min-h-[645px] lg:max-h-[645px]" />
      </div>
    </div>
  );
}
