import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { getOperator } from '../db/dashboard';

export default function UserProfile() {
  const { data: operator } = useQuery({
    queryKey: ['operator'],
    queryFn: getOperator,
  });

  if (!operator) return null;
  return (
    <Avatar className="size-10 rounded-full bg-muted-foreground/20 flex items-center justify-center">
      <AvatarImage
        src={operator.image ?? undefined}
        alt={operator.first_name}
      />
      <AvatarFallback className="size-10 rounded-full bg-muted-foreground/10 flex items-center justify-center">
        <p className="font-medium">
          {operator.first_name.charAt(0).toUpperCase()}
          {operator.last_name.charAt(0).toUpperCase()}
        </p>
      </AvatarFallback>
    </Avatar>
  );
}
