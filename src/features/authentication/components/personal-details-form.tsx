'use client';
import FormBottomNavigation from '@/components/form-bottom-navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
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
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PersonalDetailsSchema } from '../schemas/authentication';
import { useCreateOperator } from './create-operator-provider';

export default function PersonalDetailsForm() {
  const { step, nextStep, formData, setData, readonly } = useCreateOperator();

  const form = useForm<z.infer<typeof PersonalDetailsSchema>>({
    resolver: zodResolver(PersonalDetailsSchema),
    mode: 'onBlur',
    defaultValues: {
      first_name: formData.personalDetails?.first_name || 'Daniel Joshua',
      last_name: formData.personalDetails?.last_name || 'Turiano',
      birth_date:
        formData.personalDetails?.birth_date || new Date('2000-01-01'),
      phone_number: formData.personalDetails?.phone_number || '1248392392',
      dial_code: formData.personalDetails?.dial_code || '+63',
    },
  });

  const onSubmit = (values: z.infer<typeof PersonalDetailsSchema>) => {
    setData({ personalDetails: values });
    nextStep();
  };

  return (
    <div>
      <Card className="min-w-[350px] lg:min-w-[650px] lg:max-w-[650px] w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Personal Details</CardTitle>
          <CardDescription>
            Please provide your personal details, they will be used to complete
            your profile on ligtascab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
              id="personal-form"
            >
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
                        readOnly={readonly}
                        className="h-12"
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
                        readOnly={readonly}
                        className="h-12"
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
                        value={field.value}
                        disabled={readonly}
                        defaultValue={formData.personalDetails?.dial_code}
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
                          maxLength={10}
                          minLength={10}
                          className="h-12"
                          disabled={readonly}
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
      <FormBottomNavigation
        onSubmit={() => onSubmit}
        step={step}
        formName="personal-form"
      />
    </div>
  );
}
