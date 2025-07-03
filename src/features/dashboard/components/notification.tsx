'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Notification } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { Bell, X } from 'lucide-react';
import { useState } from 'react';
import { getNotifications } from '../db/dashboard';
import NotificationCard from './notification-card';
import image from '@/app/public/no-notif.svg';
import Image from 'next/image';

export default function Notifications() {
  const [totalCount, setTotalCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const notifications = await getNotifications();
      const newNotification = notifications?.filter((item: Notification) => {
        return item.read === false;
      });
      if (newNotification) {
        setTotalCount(newNotification.length);
      }
      return { newNotification };
    },
    refetchInterval: 240000,
  });

  return (
    <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger asChild>
        <button
          className={`relative size-10 rounded-full flex items-center justify-center cursor-pointer ${
            isOpen ? 'bg-white' : 'bg-muted-foreground/20'
          }`}
        >
          <Bell
            className={`text-gray-600 ${isOpen && 'fill-black'}`}
            size={20}
          />
          {totalCount ? (
            <div className="bg-red-500 absolute -top-1 -right-2 size-5 rounded-full flex items-center justify-center">
              <p className="text-xs text-white">{totalCount}</p>
            </div>
          ) : (
            ''
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={`h-full w-[23rem] space-y-4 shadow-sm rounded-2xl
        }`}
      >
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">Notifications</p>
          <button className="cursor-pointer" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>
        {totalCount > 0 ? (
          <div className="overflow-y-auto no-scrollbar flex-1 max-h-96 space-y-2">
            {data?.newNotification.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-6">
            <Image src={image} alt="notif" height={160} width={160} />
            <p className="text-xs text-center text-balance font-normal text-gray-400">
              Everything is up to date! No new notifications to worry about.
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
