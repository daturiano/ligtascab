'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { citiesAndMunicipalities, province } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PersonalDetailsSchema } from '../schemas/authentication';
import { useProgress } from './progress-provider';

export default function PersonalDetailsForm() {
  const { formData, updateData, setFormValid } = useProgress();
  const [isReady, setIsReady] = useState(false);

  const form = useForm<z.infer<typeof PersonalDetailsSchema>>({
    resolver: zodResolver(PersonalDetailsSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    const personalDetails = formData.personalDetails || {};

    form.reset({
      province: personalDetails.province || '',
      municipality: personalDetails.municipality || '',
      address: personalDetails.address || '',
      birth_date: personalDetails.birth_date,
      phone_number: personalDetails.phone_number || '',
    });

    setTimeout(() => {
      form.trigger().then(() => {
        setFormValid(form.formState.isValid);
        setIsReady(true);
      });
    }, 0);
  }, [formData, form, setFormValid]);

  // Second useEffect to sync form changes back to context, but only after initial load
  useEffect(() => {
    if (!isReady) return;

    const subscription = form.watch((values) => {
      if (
        values &&
        Object.keys(values).some((key) => values[key] !== undefined)
      ) {
        updateData({ personalDetails: values as any });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, updateData, setFormValid, isReady]);

  useEffect(() => {
    setFormValid(form.formState.isValid);
  }, [form.formState.isValid, setFormValid]);

  return (
    <Form {...form}>
      <form className="space-y-6 w-full">
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={field.onChange}
                value={formData.personalDetails?.province || ''}
              >
                <FormControl>
                  <SelectTrigger className="w-full py-6">
                    <SelectValue placeholder="Province" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {province.map((item) => (
                    <SelectItem value={item} key={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="municipality"
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={field.onChange}
                value={formData.personalDetails?.municipality || ''}
              >
                <FormControl>
                  <SelectTrigger className="w-full py-6">
                    <SelectValue placeholder="I'm a citizen of" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {citiesAndMunicipalities.map((item) => (
                    <SelectItem value={item} key={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage>
                {form.formState.errors.municipality?.message}
              </FormMessage>
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
                  placeholder="Street name, building, barangay"
                  type="text"
                  {...field}
                  value={field.value || ''}
                  className="h-12 placeholder:text-sm"
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.address?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild className="h-12">
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
                        <span>Date of birth</span>
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
                    toYear={2007}
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage>
                {form.formState.errors.birth_date?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Phone number"
                  type="text"
                  {...field}
                  value={field.value || ''}
                  className="h-12 placeholder:text-sm"
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.phone_number?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <div className="text-sm font-medium text-red-500">
            <p>{form.formState.errors.root.message}</p>
          </div>
        )}
      </form>
    </Form>
  );
}
