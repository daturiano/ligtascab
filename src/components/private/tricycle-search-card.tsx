import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tricycle } from '@/lib/types';
import { Motorcycle } from '@phosphor-icons/react';
import Link from 'next/link';

type TricycleSearchCardProps = {
  tricycle: Tricycle;
  resetState: () => void;
};

export default function TricycleSearchCard({
  tricycle,
  resetState,
}: TricycleSearchCardProps) {
  return (
    <Link
      className="flex w-full gap-6 items-center p-2 rounded-xl bg-background/60 border-2 border-background hover:bg-background cursor-pointer"
      href={`/tricycles/${tricycle.id}`}
      onClick={resetState}
    >
      <Avatar className="size-14 rounded-full">
        <AvatarImage
          src={tricycle?.image ?? undefined}
          alt={tricycle?.plate_number ?? undefined}
        />
        <AvatarFallback className="size-14 border-2 border-background rounded-full bg-white flex items-center justify-center text-2xl font-medium">
          <Motorcycle />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-between items-start">
        <p className="text-primary font-medium">{tricycle.plate_number}</p>
        <p className="text-muted-foreground text-sm">{`${tricycle.tricycle_details.model} ${tricycle.tricycle_details.year}`}</p>
      </div>
    </Link>
  );
}
