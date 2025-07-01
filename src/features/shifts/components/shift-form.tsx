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
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  createNewShiftLog,
  fetchAllAvailableTricyclesFromOperator,
} from '../actions/shifts';
import { ShiftSchema } from '../schemas/shifts';
import DriverDetailsCard from './driver-details-card';
import { Driver } from '@/lib/types';

type LogFormProps = {
  driver: Driver;
  setIsScanning: (isScanning: boolean) => void;
};

export default function ShiftForm({ driver, setIsScanning }: LogFormProps) {
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

  const createLogMutation = useMutation({
    mutationFn: async (data: z.infer<typeof ShiftSchema>) => {
      const { data: log } = await createNewShiftLog(data);
      return log;
    },
    onSuccess: (log) => {
      queryClient.invalidateQueries({
        queryKey: ['shift_logs'],
      });
      queryClient.invalidateQueries({
        queryKey: ['available_vehicles'],
      });
      toast.success(
        `${log.shift_type} of ${log.driver_name} in tricycle ${log.plate_number} completed.`
      );
      form.reset();
      setIsScanning(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: z.infer<typeof ShiftSchema>) => {
    createLogMutation.mutate(data);
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
                  <FormLabel className="text-sm md:text-base">
                    Select Tricycle
                  </FormLabel>
                  <Popover onOpenChange={() => setIsOpen(true)}>
                    <PopoverTrigger asChild disabled={isTimeOut}>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between text-sm',
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
                  <FormLabel className="text-sm md:text-base">
                    Log Type
                  </FormLabel>
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
          <div className="flex gap-4">
            <Button
              onClick={() => setIsScanning(false)}
              variant={'outline'}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={
                (form.watch('plate_number') === '' &&
                  form.watch('shift_type') !== 'Time-out') ||
                form.watch('driver_id') === '' ||
                createLogMutation.isPending
              }
            >
              {!createLogMutation.isPending ? 'Continue' : 'Pending'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
