'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
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
import { dial_code } from '@/lib/constants';
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
    mode: 'onBlur',
  });

  useEffect(() => {
    const personalDetails = formData.personalDetails || {};

    form.reset({
      first_name: personalDetails.first_name || '',
      last_name: personalDetails.last_name || '',
      birth_date: personalDetails.birth_date,
      dial_code: personalDetails.dial_code || '',
      phone_number: personalDetails.phone_number || '',
    });

    setTimeout(() => {
      form.trigger().then(() => {
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
    <Card className="w-full max-w-[28rem]">
      <CardHeader>
        <CardTitle className="text-2xl">Personal Details</CardTitle>
        <CardDescription>
          Please provide your personal details, they will be used to complete
          your profile on ligtascab.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6 w-full">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="First name"
                      type="text"
                      {...field}
                      value={field.value || ''}
                      className="h-12 placeholder:text-sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Last name"
                      type="text"
                      {...field}
                      value={field.value || ''}
                      className="h-12 placeholder:text-sm"
                    />
                  </FormControl>
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
                </FormItem>
              )}
            />

            <div className="flex items-center gap-6 w-full">
              <FormField
                control={form.control}
                name="dial_code"
                render={({ field }) => (
                  <FormItem className="min-w-24">
                    <Select
                      onValueChange={field.onChange}
                      value={formData.personalDetails?.dial_code || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="py-6 w-full">
                          <SelectValue placeholder="Dail code" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="min-w-24">
                        {dial_code.map((item) => (
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
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Phone number"
                        type="text"
                        {...field}
                        value={field.value || ''}
                        maxLength={10}
                        minLength={10}
                        className="h-12 placeholder:text-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="min-h-5 text-sm font-medium text-red-500">
              {(Object.values(form.formState.errors)[0]?.message as string) ||
                ' '}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
