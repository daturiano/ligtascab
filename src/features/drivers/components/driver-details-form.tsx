'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { DriverInfoSchema } from '../schemas/drivers';
import { useCreateDriver } from './create-driver-provider';

export default function DriverDetailsForm() {
  const { step, nextStep, formData, setData, readonly } = useCreateDriver();

  const form = useForm<z.infer<typeof DriverInfoSchema>>({
    resolver: zodResolver(DriverInfoSchema),
    mode: 'onBlur',
    defaultValues: {
      first_name: formData.driverDetails?.first_name || '',
      last_name: formData.driverDetails?.last_name || '',
      date_of_birth: formData.driverDetails?.date_of_birth || undefined,
      contact_number: formData.driverDetails?.contact_number || '',
      address: formData.driverDetails?.address || '',
      emergency_contact_name:
        formData.driverDetails?.emergency_contact_name || '',
      emergency_contact_number:
        formData.driverDetails?.emergency_contact_number || '',
    },
  });

  const onSubmit = (values: z.infer<typeof DriverInfoSchema>) => {
    setData({ driverDetails: values });
    nextStep();
  };

  return (
    <div>
      <Card className="min-w-[650px] max-w-[650px] w-full">
        <CardHeader>
          <CardTitle className="text-sm font-normal">Driver Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
              id="driver-form"
            >
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="First name*"
                          type="text"
                          {...field}
                          readOnly={readonly}
                          className="h-12 placeholder:text-sm"
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
                      <FormControl>
                        <Input
                          placeholder="Last name*"
                          type="text"
                          {...field}
                          readOnly={readonly}
                          className="h-12 placeholder:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contact_number"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Phone number*"
                        type="text"
                        {...field}
                        readOnly={readonly}
                        className="h-12 placeholder:text-sm"
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
                    <FormControl>
                      <Input
                        placeholder="Current address*"
                        type="text"
                        {...field}
                        readOnly={readonly}
                        className="h-12 placeholder:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
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
                              <span>Date of birth*</span>
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
                      <FormControl>
                        <Input
                          placeholder="Emergency contact name* "
                          type="text"
                          {...field}
                          readOnly={readonly}
                          className="h-12 placeholder:text-sm"
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
                      <FormControl>
                        <Input
                          placeholder="Emergency contact number*"
                          type="text"
                          {...field}
                          readOnly={readonly}
                          className="h-12 placeholder:text-sm"
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
      <div
        className={`w-full bg-card h-16 flex items-center absolute bottom-0 left-0 ${
          readonly && 'hidden'
        }`}
      >
        <div className="max-w-screen-lg w-full mx-auto flex justify-between">
          <Button variant={'outline'} size={'lg'} disabled={step === 1}>
            <ArrowLeft />
            Back
          </Button>
          <Button size={'lg'} type="submit" form="Driver-form">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
