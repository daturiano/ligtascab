import { fetchTricycleDetails } from '@/features/tricycles/actions/tricycles';
import TricycleProfileCard from '@/features/tricycles/components/tricycle-profile-card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function TricycleProfilePage({
  params,
}: {
  params: Promise<{ tricycleId: string }>;
}) {
  const tricycleId = (await params).tricycleId;
  const { data: tricycle } = await fetchTricycleDetails(tricycleId);
  console.log(tricycle);
  if (!tricycle) return null;

  return (
    <div className="flex flex-col space-y-6">
      <Link href={'/tricycles'}>
        <ArrowLeft size={28} />
      </Link>
      <div>
        <TricycleProfileCard tricycle={tricycle} />
      </div>
    </div>
  );
}
