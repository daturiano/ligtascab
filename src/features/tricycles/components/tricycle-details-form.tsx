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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { TricycleInfoSchema } from '../schemas/tricycle';
import { useCreateTricycle } from './create-tricycle-provider';
import FormBottomNavigation from './form-bottom-navigation';

export default function TricycleDetailsForm() {
  const { step, nextStep, formData, setData, readonly } = useCreateTricycle();

  const form = useForm<z.infer<typeof TricycleInfoSchema>>({
    resolver: zodResolver(TricycleInfoSchema),
    mode: 'onBlur',
    defaultValues: {
      model: formData.tricycleDetails?.model || 'Yamaha Aerox',
      year: formData.tricycleDetails?.year || '2024',
      registration_number:
        formData.tricycleDetails?.registration_number || 'RN-0239212',
      registration_expiration:
        formData.tricycleDetails?.registration_expiration ||
        new Date('2026-01-01'),
      body_number: formData.tricycleDetails?.body_number || 'BD-0234',
      seating_capacity: formData.tricycleDetails?.seating_capacity || '4',
      fuel_type: formData.tricycleDetails?.fuel_type || 'unleaded',
    },
  });

  const onSubmit = (values: z.infer<typeof TricycleInfoSchema>) => {
    setData({ tricycleDetails: values });
    nextStep();
  };

  return (
    <div>
      <Card className="min-w-[350px] lg:min-w-[650px] lg:max-w-[650px] w-full">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Triycle Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
              id="tricycle-form"
            >
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Model*"
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
                  name="year"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Year*"
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
                name="registration_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Registration number*"
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
                name="registration_expiration"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Registration Expiration</FormLabel>
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
                                Registration expiry*
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
                          fromYear={2020}
                          toYear={2030}
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
                  name="body_number"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Body Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Body number* "
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
                  name="seating_capacity"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Seating Capacity</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Seating capacity*"
                          type="number"
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
                  name="fuel_type"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Fuel Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={readonly}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="py-6 w-full text-xs lg:text-sm">
                            <SelectValue placeholder="Fuel type*" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={'diesel'}>Diesel</SelectItem>
                          <SelectItem value={'unleaded'}>Unleaded</SelectItem>
                        </SelectContent>
                      </Select>
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
        formName="tricycle-form"
      />
    </div>
  );
}
