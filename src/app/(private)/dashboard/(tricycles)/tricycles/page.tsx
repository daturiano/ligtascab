import { Button } from '@/components/ui/button';
import Image from 'next/image';
import emptyImage from '@/assets/image/empty.svg';

export default function TricyclesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Tricycles</h1>
      <div className="min-w-full border-[0.3px] rounded-2xl min-h-96 bg-card flex flex-col items-center justify-center">
        <Image src={emptyImage} alt="empty image" className="size-36" />
        <div className="flex flex-col space-y-4 text-center mb-8">
          <h2 className="text-xl font-medium">
            Your tricycles will appear here
          </h2>
          <h3 className="text-md text-muted-foreground">
            After you create a new vehicle, you will see it here.
          </h3>
        </div>
        <Button className="p-5">Create a vehicle</Button>
      </div>
    </div>
  );
}
