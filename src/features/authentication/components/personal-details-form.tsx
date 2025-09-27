"use client";
import FormBottomNavigation from "@/components/private/form-bottom-navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dial_code } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PersonalDetailsSchema } from "../schemas/authentication";
import { useCreateOperator } from "./create-operator-provider";

export default function PersonalDetailsForm() {
  const { step, nextStep, formData, setData, readonly } = useCreateOperator();

  const form = useForm<z.infer<typeof PersonalDetailsSchema>>({
    resolver: zodResolver(PersonalDetailsSchema),
    mode: "onBlur",
    defaultValues: {
      first_name: formData.personalDetails?.first_name || "",
      last_name: formData.personalDetails?.last_name || "",
      birth_date: formData.personalDetails?.birth_date || undefined,
      coop_name: formData.personalDetails?.coop_name || "",
      phone_number: formData.personalDetails?.phone_number || "",
      dial_code: formData.personalDetails?.dial_code || "",
    },
  });

  const onSubmit = (values: z.infer<typeof PersonalDetailsSchema>) => {
    setData({ personalDetails: values });
    nextStep();
  };

  return (
    <>
      <Card className="w-full lg:max-w-[650px]">
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
              className="w-full space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
              id="personal-form"
            >
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        type="text"
                        {...field}
                        readOnly={readonly}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        type="text"
                        {...field}
                        readOnly={readonly}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coop_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Cooperation Name (leave blank if none)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        readOnly={readonly}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger
                        asChild
                        className="border-muted-foreground/40 h-12 rounded-md border bg-transparent shadow-xs outline-none hover:bg-transparent"
                        disabled={readonly}
                      >
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full items-center gap-6">
                <FormField
                  control={form.control}
                  name="dial_code"
                  render={({ field }) => (
                    <FormItem className="min-w-24">
                      <FormLabel>Dial Code*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        disabled={readonly}
                        defaultValue={formData.personalDetails?.dial_code}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full py-6">
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
                      <FormLabel>Phone Number*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="9391234567"
                          type="text"
                          {...field}
                          maxLength={10}
                          minLength={10}
                          className="h-12"
                          disabled={readonly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
    </>
  );
}
