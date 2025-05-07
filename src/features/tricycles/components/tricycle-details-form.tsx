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
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { TricycleInfoSchema } from '../schemas/tricycle';
import { useCreateTricycle } from './create-tricycle-provider';

export default function TricycleDetailsForm() {
  const { step, nextStep, formData, setData, readonly } = useCreateTricycle();

  const form = useForm<z.infer<typeof TricycleInfoSchema>>({
    resolver: zodResolver(TricycleInfoSchema),
    mode: 'onBlur',
    defaultValues: {
      model: formData.tricycleDetails?.model || '',
      year: formData.tricycleDetails?.year || '',
      registration_number: formData.tricycleDetails?.registration_number || '',
      registration_expiration:
        formData.tricycleDetails?.registration_expiration || undefined,
      body_number: formData.tricycleDetails?.body_number || '',
      seating_capacity: formData.tricycleDetails?.seating_capacity || '',
      fuel_type: formData.tricycleDetails?.fuel_type || '',
    },
  });

  const onSubmit = (values: z.infer<typeof TricycleInfoSchema>) => {
    setData({ tricycleDetails: values });
    nextStep();
  };

  return (
    <div>
      <Card className="min-w-[650px] max-w-[650px] w-full">
        <CardHeader>
          <CardTitle className="text-sm font-normal">Triycle Details</CardTitle>
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
                      <FormControl>
                        <Input
                          placeholder="Model*"
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
                  name="year"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Year*"
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
                name="registration_number"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Registration number*"
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
                name="registration_expiration"
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
                              <span>Registration expiry*</span>
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
                      <FormControl>
                        <Input
                          placeholder="Body number* "
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
                  name="seating_capacity"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Seating capacity*"
                          type="number"
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
                  name="fuel_type"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Select
                        onValueChange={field.onChange}
                        disabled={readonly}
                        defaultValue={formData.tricycleDetails?.fuel_type}
                      >
                        <FormControl>
                          <SelectTrigger className="py-6 w-full">
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
          <Button size={'lg'} type="submit" form="tricycle-form">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
