import cover from '@/app/public/home-header-cover.jpg';
import CopyButton from '@/components/private/copy-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Operator } from '@/lib/types';
import { HelpCircle, House } from 'lucide-react';

export default function Header({ operator }: { operator: Operator }) {
  return (
    <div className="p-2 bg-primary/20 rounded-md">
      <Card
        className="shadow-none rounded-md"
        style={{
          backgroundImage: `url(${cover.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <CardContent className="flex flex-col gap-10">
          <div className="flex flex-row justify-between">
            <div className="flex items-center gap-2 text-white font-medium text-sm">
              <House size={16} />
              <p>Home</p>
              <p>/</p>
              <p>{operator?.coop_name}</p>
            </div>
            <div className="flex items-center gap-2 text-white text-sm font-medium">
              <HelpCircle />
              <p>Help & Feedback</p>
            </div>
          </div>
          <Card className="shadow-none rounded-md py-4 max-w-min">
            <CardContent className="text-sm px-0 flex flex-col space-y-2">
              <div className="flex flex-col px-4 gap-2">
                <h1 className="text-nowrap font-medium">
                  {operator?.coop_name}
                </h1>
                <Badge className="text-xs px-4">Verified</Badge>
              </div>
              <Separator />
              <div className="flex text-xs gap-2 px-4">
                <div className="max-w-[70px]">
                  <CopyButton id={operator.id} />
                  <p className="text-muted-foreground">Account ID</p>
                </div>
                <div className="bg-border border-[0.9px]"></div>
                <div className="flex flex-col justify-between">
                  <p className="text-nowrap font-medium">
                    {operator.address.address}
                  </p>
                  <p className="text-muted-foreground">Location</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
