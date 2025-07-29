import { Notification } from '@/lib/types';
import React from 'react';
import Image, { StaticImageData } from 'next/image';

// Import all icons
import license from '@/app/public/notification-icons/driver-license.png';
import franchise from '@/app/public/notification-icons/franchise.png';
import maintenance from '@/app/public/notification-icons/maintenance.png';
import registration from '@/app/public/notification-icons/registration.png';
import birthday from '@/app/public/notification-icons/birthday.png';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAsRead } from '@/db/db';

type NotificationCardProps = {
  notification: Notification;
};

// Single configuration object - much cleaner!
const notificationConfig: Record<
  string,
  {
    icon: StaticImageData;
    title: string;
    getMessage: (notification: Notification) => string;
  }
> = {
  license: {
    icon: license,
    title: 'License Expiration',
    getMessage: (notification) =>
      `${notification.driver_name} license is expiring on ${formatDate(
        notification.expiration_date.toLocaleString(),
        'long'
      )}`,
  },
  franchise: {
    icon: franchise,
    title: 'Franchise Expiration',
    getMessage: (notification) =>
      `${notification.plate_number} franchise expires on ${formatDate(
        notification.expiration_date.toLocaleString(),
        'long'
      )}`,
  },
  registration: {
    icon: registration,
    title: 'Registration Expiration',
    getMessage: (notification) =>
      `${notification.plate_number} registration expires on ${formatDate(
        notification.expiration_date.toLocaleString(),
        'long'
      )}`,
  },
  maintenance: {
    icon: maintenance,
    title: 'Maintenance Expiration',
    getMessage: (notification) =>
      `${notification.plate_number} maintenance due on ${formatDate(
        notification.expiration_date.toLocaleString(),
        'long'
      )}`,
  },
  birthday: {
    icon: birthday,
    title: 'Birthday Celebration',
    getMessage: (notification) =>
      `It's ${notification.driver_name}'s birthday today!`,
  },
};

type MarkAsReadProps = {
  id: string;
  read: boolean;
};

export default function NotificationCard({
  notification,
}: NotificationCardProps) {
  const { icon, title, getMessage } =
    notificationConfig[notification.expiration_type];

  const path = notification.driver_id
    ? `/drivers/${notification.driver_id}`
    : `/tricycles/${notification.tricycle_id}`;

  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: async ({ id, read }: MarkAsReadProps) => {
      if (read) return null;
      await markAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return (
    <Link
      className={`flex flex-row text-start items-center justify-between px-4 border-1 rounded-lg gap-4 py-2 min-h-[80px] max-h-[80px] ${
        !notification.read ? 'bg-background/80' : 'bg-background/10'
      }`}
      href={path}
      onClick={() =>
        markAsReadMutation.mutate({
          id: notification.id,
          read: notification.read,
        })
      }
    >
      <div className="size-12 rounded-full bg-primary/40 flex items-center justify-center">
        <Image
          src={icon}
          alt={`${notification.expiration_type} notification`}
          width={28}
          height={28}
        />
      </div>
      <div className="flex flex-col flex-1 justify-between px-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-sm text-pretty">
          {getMessage(notification)}
        </p>
      </div>
    </Link>
  );
}
