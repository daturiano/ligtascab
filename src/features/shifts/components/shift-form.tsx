'use client';

import { Button } from '@/components/ui/button';
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
import { Driver } from '@/features/drivers/schemas/drivers';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronsUpDown } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  createNewShiftLog,
  fetchAllAvailableTricyclesFromOperator,
} from '../actions/shifts';
import { ShiftSchema } from '../schemas/shifts';
import DriverDetailsCard from './driver-details-card';

type LogFormProps = {
  driver: Driver;
};

export default function ShiftForm({ driver }: LogFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);

  const form = useForm<z.infer<typeof ShiftSchema>>({
    resolver: zodResolver(ShiftSchema),
    defaultValues: {
      driver_name: `${driver.first_name} ${driver.last_name}`,
      plate_number: '',
      shift_type: 'Time-in',
      operator_id: driver.operator_id,
      driver_id: driver.id,
      tricycle_id: '',
    },
  });

  const { data: availableTricycles } = useQuery({
    queryKey: ['available_vehicles'],
    queryFn: fetchAllAvailableTricyclesFromOperator,
    enabled: isOpen,
  });

  const queryClient = useQueryClient();

  const useCreateNewLog = useMutation({
    mutationFn: createNewShiftLog,
  });

  const onSubmit = async (data: z.infer<typeof ShiftSchema>) => {
    startTransition(() => {
      useCreateNewLog.mutate(data, {
        onSuccess: (response) => {
          queryClient.invalidateQueries({
            queryKey: ['shift_logs'],
          });
          queryClient.invalidateQueries({
            queryKey: ['available_vehicles'],
          });
          if (response?.message) {
            toast.success(response.message);
            form.reset();
          }
          if (response?.error) {
            toast.error(response.error);
          }
        },
      });
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <DriverDetailsCard driver={driver} />
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="plate_number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Select Available Tricycle</FormLabel>
                  <Popover onOpenChange={() => setIsOpen(true)}>
                    <PopoverTrigger asChild disabled={isTimeOut}>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
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
                    <PopoverContent align="center" className="w-[195px]">
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
              name="shift_type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Log Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      if (value === 'Time-out') {
                        form.setValue('shift_type', value);
                        form.setValue('plate_number', '');
                        setIsTimeOut(true);
                        return;
                      }
                      form.setValue('shift_type', value);
                      setIsTimeOut(false);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue defaultValue={'Time-in'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Time-in">Time-in</SelectItem>
                      <SelectItem value="Time-out">Time-out</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {form.formState.errors.root && (
            <div className="text-sm font-medium text-red-500">
              {form.formState.errors.root.message}
            </div>
          )}
          <Button
            className="p-1 w-full"
            disabled={
              (form.watch('plate_number') === '' &&
                form.watch('shift_type') !== 'Time-out') ||
              form.watch('driver_id') === '' ||
              isPending
            }
          >
            {!isPending ? 'Continue' : 'Pending'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
