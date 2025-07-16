'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
import { Textarea } from '@/components/ui/textarea';
import { fetchAllAvailableTricyclesFromOperator } from '@/features/shifts/actions/shifts';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { createNewMaintenanceRecord } from '../actions/tricycles';
import { MaintenanceRecordSchema } from '../schemas/tricycle';

export default function MaintenanceRecordForm() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof MaintenanceRecordSchema>>({
    resolver: zodResolver(MaintenanceRecordSchema),
    mode: 'onBlur',
    defaultValues: {
      plate_number: '',
      type: 'regular',
      issue_description: '',
      service_performed: '',
      cost: '',
      date: new Date(),
    },
  });

  const { data: availableTricycles } = useQuery({
    queryKey: ['available_tricycles'],
    queryFn: fetchAllAvailableTricyclesFromOperator,
    enabled: isOpen,
  });

  const queryClient = useQueryClient();

  const createRecordMutation = useMutation({
    mutationFn: async (data: z.infer<typeof MaintenanceRecordSchema>) => {
      const { createdRecord } = await createNewMaintenanceRecord(data);
      return createdRecord;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['maintenance_records'],
      });
      queryClient.invalidateQueries({
        queryKey: ['available_vehicles'],
      });
      toast.success(`Maintenance record ${data.plate_number} of completed.`);
      form.reset();
      router.push('/tricycle-maintenance');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: z.infer<typeof MaintenanceRecordSchema>) => {
    createRecordMutation.mutate(data);
  };

  return (
    <div className="flex flex-col mx-auto gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="lg:text-3xl text-xl font-semibold">
          Update your Tricycle&apos;s Maintenance Record
        </h1>
        <p className="text-muted-foreground text-sm lg:text-lg">
          Create a new maintenance record for your tricycle.
        </p>
      </div>
      <Card className="min-w-[350px] lg:min-w-[650px] lg:max-w-[650px] w-full mb-24">
        <CardHeader>
          <CardTitle className="text-base font-bold">
            Tricycle&apos;s Maintenance Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
              id="maintenance-record-form"
            >
              <FormField
                control={form.control}
                name="plate_number"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Select Tricycle*</FormLabel>
                    <Popover onOpenChange={() => setIsOpen(true)}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full py-6 justify-between text-sm',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? availableTricycles?.find(
                                  (tricycle) => tricycle === field.value
                                )
                              : 'Select tricycle'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-full">
                        <Command>
                          <CommandInput placeholder="Search tricycle..." />
                          <CommandList>
                            <CommandEmpty>No tricycle found.</CommandEmpty>
                            <CommandGroup>
                              {availableTricycles?.map((tricycle) => (
                                <CommandItem
                                  value={tricycle}
                                  key={tricycle}
                                  onSelect={() => {
                                    form.setValue('plate_number', tricycle);
                                  }}
                                >
                                  {tricycle}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Maintenance*</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="py-6 w-full">
                          <SelectValue placeholder="Type*" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={'regular'}>Regular</SelectItem>
                        <SelectItem value={'repair'}>Repair</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issue_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Reported issues on the tricycle(if any)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Vehicle issue report, leave blank if none"
                        className="resize-none min-h-34"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="service_performed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Performed*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Services that have been performed on the vehicle, leave blank if none"
                        className="resize-none min-h-34"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Cost*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="text"
                        {...field}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Maintenance Date*</FormLabel>
                    <Popover>
                      <PopoverTrigger
                        asChild
                        className="h-12 bg-transparent rounded-md border shadow-xs outline-none border-muted-foreground/40 hover:bg-transparent"
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
                                Maintenance Date*
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
      </Card>
      <div
        className={`min-w-screen bg-card h-16 flex items-center fixed bottom-0 left-0`}
      >
        <div className="mx-auto flex justify-end max-w-screen-xl w-full">
          <Button
            size={'lg'}
            className="text-xs lg:text-sm"
            form="maintenance-record-form"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
