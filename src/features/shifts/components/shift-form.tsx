"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Driver } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  createNewShiftLog,
  fetchAllAvailableTricyclesFromOperator,
} from "../actions/shifts";
import { ShiftSchema } from "../schemas/shifts";
import DriverDetailsCard from "./driver-details-card";

type LogFormProps = {
  driver: Driver;
  setIsScanning: (isScanning: boolean) => void;
};

export default function ShiftForm({ driver, setIsScanning }: LogFormProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof ShiftSchema>>({
    resolver: zodResolver(ShiftSchema),
    defaultValues: {
      driver_name: `${driver.first_name} ${driver.last_name}`,
      plate_number: "",
      shift_type: `${driver.status === "active" ? "Time-out" : "Time-in"}`,
      operator_id: driver.operator_id,
      driver_id: driver.id,
      tricycle_id: "",
      revenue_collected: undefined,
      shift_description: "",
    },
  });

  const { data: availableTricycles } = useQuery({
    queryKey: ["available_vehicles"],
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
        queryKey: ["shift_logs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["available_vehicles"],
      });
      queryClient.invalidateQueries({
        queryKey: ["active_shifts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["recent_logs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["active_drivers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["active_tricycles"],
      });
      queryClient.invalidateQueries({
        queryKey: ["shifts_today"],
      });
      toast.success(
        `${log.shift_type} of ${log.driver_name} in tricycle ${log.plate_number} completed.`,
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
      {driver.status === "inactive" && <DriverDetailsCard driver={driver} />}
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {driver.status === "active" ? (
            <div className="flex-1 space-y-4">
              <FormField
                control={form.control}
                name="revenue_collected"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base">
                      Revenue Collected
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Revenue collected"
                        type="text"
                        {...field}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shift_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base">
                      Reported issues or incidents(if any)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Vehicle condition report, leave blank if none"
                        className="resize-none text-sm md:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="plate_number"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm md:text-base">
                      Select Tricycle
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      disabled={driver.status === "active"}
                      value={field.value}
                      onOpenChange={() => setIsOpen(true)}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select tricycle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[100] max-h-[300px]">
                        {availableTricycles?.map((tricycle) => (
                          <SelectItem value={tricycle} key={tricycle}>
                            {tricycle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <FormField
              control={form.control}
              name="plate_number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm md:text-base">
                    Select Tricycle
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    onOpenChange={() => setIsOpen(true)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select tricycle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-[100] max-h-[300px]">
                      {availableTricycles?.map((tricycle) => (
                        <SelectItem value={tricycle} key={tricycle}>
                          {tricycle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {form.formState.errors.root && (
            <div className="text-sm font-medium text-red-500">
              {form.formState.errors.root.message}
            </div>
          )}
          <div className="flex gap-4">
            <Button
              onClick={() => setIsScanning(false)}
              variant={"outline"}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={
                (form.watch("plate_number") === "" &&
                  form.watch("shift_type") !== "Time-out") ||
                form.watch("driver_id") === "" ||
                createLogMutation.isPending
              }
            >
              {!createLogMutation.isPending ? "Continue" : "Pending"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
