'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Cake,
  CalendarX,
  IdCard,
  MapPinHouse,
  PencilOff,
  Phone,
  PhoneForwarded,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { updateDriverById } from '../db/drivers';
import { Driver, DriverSchema } from '../schemas/drivers';
import { EditableInput } from './editable-input';

type DriverProfileCardProps = {
  driver: Driver;
};

export default function DriverProfileCard({ driver }: DriverProfileCardProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof DriverSchema>>({
    resolver: zodResolver(DriverSchema),
    mode: 'onSubmit',
    defaultValues: {
      id: driver.id,
      first_name: driver.first_name,
      last_name: driver.last_name,
      birth_date: new Date(driver.birth_date),
      phone_number: driver.phone_number,
      address: driver.address,
      license_number: driver.license_number,
      license_expiration: new Date(driver.license_expiration),
      emergency_contact_name: driver.emergency_contact_name,
      emergency_contact_number: driver.emergency_contact_number,
    },
  });

  const onSubmit = async (values: z.infer<typeof DriverSchema>) => {
    if (!driver.id) return null;
    const { error } = await updateDriverById(driver.id, values);
    queryClient.invalidateQueries({
      queryKey: ['drivers'],
    });
    setIsEditable(false);
    if (!error) {
      return toast.success('Driver updated successfully.');
    }
    toast.error('Error updating driver', error);
  };

  const toogleIsEditable = () => {
    setIsEditable((prev) => !prev);
  };

  return (
    <Form {...form}>
      <form
        className="w-full max-w-[500px] space-y-4 relative"
        id="driver-profile-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card
          className="py-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CardHeader className="w-full relative flex flex-col items-center justify-center bg-muted-foreground/5 rounded-t-xl py-4">
            {isHovered && (
              <div className="absolute top-0 right-0 p-4">
                <PencilOff
                  className="text-muted-foreground cursor-pointer hover:text-foreground"
                  size={22}
                  onClick={() => {
                    form.reset();
                    toogleIsEditable();
                  }}
                />
              </div>
            )}
            <CardTitle>
              <div className="relative">
                <Avatar className="size-36 rounded-full">
                  {/* <AvatarImage
              src={driver?.image ?? undefined}
              alt={driver?.first_name ?? undefined}
            /> */}
                  <AvatarFallback className="size-36 border-1 border-white rounded-full bg-gray-300 flex items-center justify-center text-2xl font-medium">
                    <p>
                      {driver.first_name.charAt(0).toUpperCase()}
                      {driver.last_name.charAt(0).toUpperCase()}
                    </p>
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-1.5 right-1.5 h-8 w-8 rounded-full ${
                    driver.status === 'active' ? 'bg-primary' : 'bg-destructive'
                  }`}
                ></div>
              </div>
            </CardTitle>
            <CardDescription>
              <p className="text-lg text-black">
                {driver.first_name} {driver.last_name}
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold">Driver Details</h1>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="w-full flex items-center">
                    <div className="flex gap-2 items-center">
                      <MapPinHouse
                        className="text-muted-foreground"
                        size={18}
                      />
                      <p className="whitespace-nowrap text-muted-foreground">
                        Address:{' '}
                      </p>
                    </div>
                    <FormControl>
                      <EditableInput
                        {...field}
                        readOnly={!isEditable}
                        isEditable={isEditable}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="w-full flex items-center">
                    <div className="flex gap-2 items-center">
                      <Phone className="text-muted-foreground" size={18} />
                      <p className="whitespace-nowrap text-muted-foreground">
                        Phone Number:{' '}
                      </p>
                    </div>
                    <FormControl>
                      <EditableInput
                        {...field}
                        readOnly={!isEditable}
                        isEditable={isEditable}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <div className="flex gap-2 items-center">
                      <Cake className="text-muted-foreground" size={18} />
                      <p className="whitespace-nowrap text-muted-foreground">
                        Birthday:{' '}
                      </p>
                    </div>
                    <Popover>
                      <PopoverTrigger
                        asChild
                        className={`bg-transparent shadow-none outline-none hover:bg-transparent text-md w-full text-start ${
                          isEditable
                            ? 'border-b'
                            : 'border-none border-muted-foreground'
                        }`}
                      >
                        <FormControl>
                          <button disabled={!isEditable}>
                            <p className="py-1">{format(field.value, 'PPP')}</p>
                          </button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          fromYear={1970}
                          toYear={2008}
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold">License Details</h1>
              <FormField
                control={form.control}
                name="license_number"
                render={({ field }) => (
                  <FormItem className="w-full flex items-center">
                    <div className="flex gap-2 items-center">
                      <IdCard className="text-muted-foreground" size={18} />
                      <p className="whitespace-nowrap text-muted-foreground">
                        License Number:{' '}
                      </p>
                    </div>
                    <FormControl>
                      <EditableInput
                        {...field}
                        readOnly={!isEditable}
                        isEditable={isEditable}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="license_expiration"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <div className="flex gap-2 items-center">
                      <CalendarX className="text-muted-foreground" size={18} />
                      <p className="whitespace-nowrap text-muted-foreground">
                        License Expiration:{' '}
                      </p>
                    </div>
                    <Popover>
                      <PopoverTrigger
                        asChild
                        className={`bg-transparent shadow-none outline-none hover:bg-transparent text-md w-full text-start ${
                          isEditable
                            ? 'border-b'
                            : 'border-none border-muted-foreground'
                        }`}
                      >
                        <FormControl>
                          <button disabled={!isEditable}>
                            <p className="py-1">{format(field.value, 'PPP')}</p>
                          </button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          fromYear={2020}
                          toYear={2050}
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="font-semibold">Emergency Details</h1>
              <FormField
                control={form.control}
                name="emergency_contact_name"
                render={({ field }) => (
                  <FormItem className="w-full flex items-center">
                    <div className="flex gap-2 items-center">
                      <User className="text-muted-foreground" size={18} />
                      <p className="whitespace-nowrap text-muted-foreground">
                        Contact Name:{' '}
                      </p>
                    </div>
                    <FormControl>
                      <EditableInput
                        {...field}
                        readOnly={!isEditable}
                        isEditable={isEditable}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergency_contact_number"
                render={({ field }) => (
                  <FormItem className="w-full flex items-center">
                    <div className="flex gap-2 items-center">
                      <PhoneForwarded
                        className="text-muted-foreground"
                        size={18}
                      />
                      <p className="whitespace-nowrap text-muted-foreground">
                        Contact Number:{' '}
                      </p>
                    </div>
                    <FormControl>
                      <EditableInput
                        {...field}
                        readOnly={!isEditable}
                        isEditable={isEditable}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="pb-4">
            {isEditable && (
              <Button type="submit" id="driver-profile-form" className="w-full">
                Update Driver Profile
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
