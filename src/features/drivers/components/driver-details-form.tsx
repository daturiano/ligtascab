'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { DriverInfoSchema } from '../schemas/drivers';
import { useCreateDriver } from './create-driver-provider';
import FormBottomNavigation from './form-bottom-navigation';

export default function DriverDetailsForm() {
  const { step, nextStep, formData, setData, readonly } = useCreateDriver();

  const form = useForm<z.infer<typeof DriverInfoSchema>>({
    resolver: zodResolver(DriverInfoSchema),
    mode: 'onBlur',
    defaultValues: {
      first_name: formData.driverDetails?.first_name || 'Daniel Joshua',
      last_name: formData.driverDetails?.last_name || 'Turiano',
      birth_date: formData.driverDetails?.birth_date || new Date('2026-01-01'),
      phone_number: formData.driverDetails?.phone_number || '+6393933483',
      address: formData.driverDetails?.address || 'Naga City',
      emergency_contact_name:
        formData.driverDetails?.emergency_contact_name || 'Daniel Turiano',
      emergency_contact_number:
        formData.driverDetails?.emergency_contact_number || '+6326972483',
    },
  });

  const onSubmit = (values: z.infer<typeof DriverInfoSchema>) => {
    setData({ driverDetails: values });
    nextStep();
  };

  return (
    <div>
      <Card className="min-w-[350px] lg:min-w-[650px] lg:max-w-[650px] w-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Driver Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
              id="driver-details-form"
            >
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First name*"
                          type="text"
                          {...field}
                          readOnly={readonly}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Last name*"
                          type="text"
                          {...field}
                          readOnly={readonly}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone number*"
                        type="text"
                        {...field}
                        readOnly={readonly}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Current address*"
                        type="text"
                        {...field}
                        readOnly={readonly}
                        className="h-12"
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Birth Date</FormLabel>
                    <Popover>
                      <PopoverTrigger
                        asChild
                        className="h-12 bg-transparent rounded-md border shadow-xs outline-none border-muted-foreground/40 hover:bg-transparent"
                        disabled={readonly}
                      >
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span className="text-xs lg:text-sm">
                                Date of birth*
                              </span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="end">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          fromYear={1970}
                          toYear={2005}
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="emergency_contact_name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Emergency Contact Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Emergency contact name* "
                          type="text"
                          {...field}
                          readOnly={readonly}
                          className="h-12"
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
                    <FormItem className="w-full">
                      <FormLabel>Emergency Contact Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Emergency contact number*"
                          type="text"
                          {...field}
                          readOnly={readonly}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FormBottomNavigation
        onSubmit={() => onSubmit}
        step={step}
        formName="driver-details-form"
      />
    </div>
  );
}
