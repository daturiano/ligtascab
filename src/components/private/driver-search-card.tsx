import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Driver } from '@/lib/types';
import Link from 'next/link';

type DriverSearchCardProps = {
  driver: Driver;
  resetState: () => void;
};

export default function DriverSearchCard({
  driver,
  resetState,
}: DriverSearchCardProps) {
  return (
    <Link
      className="flex w-full gap-6 items-center p-2 rounded-xl bg-background/60 border-2 border-background hover:bg-background cursor-pointer"
      href={`/drivers/${driver.id}`}
      onClick={resetState}
    >
      <Avatar className="size-14 rounded-full">
        <AvatarImage
          src={driver?.image ?? undefined}
          alt={driver?.first_name ?? undefined}
        />
        <AvatarFallback className="size-14 border-2 border-background rounded-full bg-white flex items-center justify-center text-2xl font-medium">
          <p className="text-muted-foreground">
            {driver.first_name.charAt(0).toUpperCase()}
            {driver.last_name.charAt(0).toUpperCase()}
          </p>
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-between items-start">
        <p className="text-primary font-medium">{`${driver.first_name} ${driver.last_name}`}</p>
        <p className="text-muted-foreground text-sm">Driver</p>
      </div>
    </Link>
  );
}
