import { Badge } from '@/components/ui/badge';
import { isPastDue, isTwoMonthFromNow } from '@/lib/utils';
import React from 'react';

type DocumentStatusBadgeProps = {
  date: Date;
};

export default function DocumentStatusBadge({
  date,
}: DocumentStatusBadgeProps) {
  const Status = () => {
    if (!isPastDue(date)) return <Badge>Valid</Badge>;
    if (isTwoMonthFromNow(date))
      return <Badge variant={'secondary'}>Approaching Expiration</Badge>;
    if (isPastDue(date)) return <Badge variant={'destructive'}>Expired</Badge>;
  };

  return <Status />;
}
