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
import { CalendarIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { DriverComplianceSchema } from '../schemas/drivers';
import { useCreateDriver } from './create-driver-provider';
import DriverDocumentsUpload from './driver-documents-upload';
import FormBottomNavigation from './form-bottom-navigation';

export default function DriverLicenseForm() {
  const { nextStep, formData, setData, readonly } = useCreateDriver();

  const form = useForm<z.infer<typeof DriverComplianceSchema>>({
    resolver: zodResolver(DriverComplianceSchema),
    mode: 'onBlur',
    defaultValues: {
      license_number: formData.complianceDetails?.license_number || '',
      license_expiration:
        formData.complianceDetails?.license_expiration || undefined,
    },
  });

  // Check if both required documents are uploaded
  const canContinue = useMemo(() => {
    const attachmentDetails = formData.attachmentDetails || {};
    const hasLicenseFront =
      attachmentDetails['license-front']?.file instanceof File;
    const hasLicenseBack =
      attachmentDetails['license-back']?.file instanceof File;
    return hasLicenseFront && hasLicenseBack;
  }, [formData.attachmentDetails]);

  const onSubmit = (values: z.infer<typeof DriverComplianceSchema>) => {
    if (!canContinue) return;
    setData({ complianceDetails: values });
    nextStep();
  };

  return (
    <div>
      <Card className="min-w-[350px] lg:min-w-[650px] lg:max-w-[650px] w-full">
        <CardHeader>
          <CardTitle className="text-sm font-normal">
            Driver&apos;s License Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
              id="driver-license-form"
            >
              <FormField
                control={form.control}
                name="license_number"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="License number*"
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
                name="license_expiration"
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
                              <span className="text-xs lg:text-sm">
                                License expiration*
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
            </form>
          </Form>
        </CardContent>
        <DriverDocumentsUpload />
      </Card>
      <FormBottomNavigation
        onSubmit={() => onSubmit}
        formName="driver-license-form"
      />
    </div>
  );
}
