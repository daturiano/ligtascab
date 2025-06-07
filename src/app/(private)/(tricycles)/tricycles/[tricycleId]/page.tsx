import { fetchTricycleDetails } from '@/features/tricycles/actions/tricycles';

export default async function TricycleProfilePage({
  params,
}: {
  params: Promise<{ tricycle_id: string }>;
}) {
  const tricycle_id = (await params).tricycle_id;
  const { data: tricycle } = await fetchTricycleDetails(tricycle_id);
  console.log(tricycle);
  if (!tricycle) return null;

  return (
    <div className="space-y-4 w-full lg:px-20 max-w-screen-2xl mx-auto flex"></div>
  );
}
