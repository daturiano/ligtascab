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
import { ComplianceSchema } from '../schemas/tricycle';
import { useCreateTricycle } from './create-tricycle-provider';

export default function TricycleComplianceForm() {
  const { step, nextStep, formData, setData, prevStep, readonly } =
    useCreateTricycle();

  const form = useForm<z.infer<typeof ComplianceSchema>>({
    resolver: zodResolver(ComplianceSchema),
    mode: 'onBlur',
    defaultValues: {
      or_number: formData.complianceDetails?.or_number || '',
      cr_number: formData.complianceDetails?.cr_number || '',
      franchise_number: formData.complianceDetails?.franchise_number || '',
      franchise_expiry:
        formData.complianceDetails?.franchise_expiry || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof ComplianceSchema>) => {
    setData({ complianceDetails: values });
    nextStep();
  };

  return (
    <div>
      <Card className="min-w-[650px] max-w-[650px] w-full">
        <CardHeader>
          <CardTitle className="text-sm font-normal">
            Triycle Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
              id="compliance-form"
            >
              <FormField
                control={form.control}
                name="or_number"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Official Receipt number*"
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
                name="cr_number"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Certificate of Registration number*"
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
                name="franchise_number"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Franchise number*"
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
                name="franchise_expiry"
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
                              <span>Franchise expiry*</span>
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
          <Button
            variant={'outline'}
            size={'lg'}
            disabled={step === 1}
            onClick={prevStep}
          >
            <ArrowLeft />
            Back
          </Button>
          <Button
            size={'lg'}
            type="submit"
            onClick={() => onSubmit}
            form="compliance-form"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
