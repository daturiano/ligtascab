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
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { MaintenanceSchema } from '../schemas/tricycle';
import { useCreateTricycle } from './create-tricycle-provider';
import FormBottomNavigation from './form-bottom-navigation';

export default function TricycleMaintenanceForm() {
  const { nextStep, formData, setData, readonly } = useCreateTricycle();

  const form = useForm<z.infer<typeof MaintenanceSchema>>({
    resolver: zodResolver(MaintenanceSchema),
    mode: 'onBlur',
    defaultValues: {
      last_maintenance_date:
        formData.maintenanceDetails?.last_maintenance_date || undefined,
      maintenance_status: formData.maintenanceDetails?.maintenance_status,
      mileage: formData.maintenanceDetails?.mileage || '',
    },
  });

  const onSubmit = (values: z.infer<typeof MaintenanceSchema>) => {
    setData({ maintenanceDetails: values });
    nextStep();
  };

  return (
    <div>
      <Card className="min-w-[350px] lg:min-w-[650px] lg:max-w-[650px] w-full">
        <CardHeader>
          <CardTitle className="text-sm font-normal">
            Tricycle Meintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
              id="maintenance-form"
            >
              <FormField
                control={form.control}
                name="last_maintenance_date"
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
                              <span>Last maintenance date*</span>
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
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maintenance_status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={
                        formData.maintenanceDetails?.maintenance_status
                      }
                      disabled={readonly}
                    >
                      <FormControl>
                        <SelectTrigger className="py-6 w-full">
                          <SelectValue placeholder="Maintenance status*" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={'ok'}>Ok</SelectItem>
                        <SelectItem value={'due'}>Due</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Mileage"
                        type="text"
                        {...field}
                        readOnly={readonly}
                        className="h-12 placeholder:text-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
      <FormBottomNavigation
        onSubmit={() => onSubmit}
        formName="maintenance-form"
      />
    </div>
  );
}
