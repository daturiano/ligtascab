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
import Spinner from "@/components/ui/spinner";
import { UserSchema } from "@/features/authentication/schemas/authentication";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { registerUser } from "../actions/authentication";
import { getFormattedDate } from "@/lib/utils";
import { WarningCircle } from "@phosphor-icons/react";

export default function SignUpForm() {
  const [isPending, startTransition] = useTransition();

  const registerCredentials = async (data: z.infer<typeof UserSchema>) => {
    const response = await registerUser(data);
    if (response?.error) {
      toast.error(response.error, {
        description: getFormattedDate(),
      });
      return;
    }
  };

  function onSubmit(data: z.infer<typeof UserSchema>) {
    startTransition(() => {
      registerCredentials(data);
    });
  }

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-3xl mx-auto"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address*</FormLabel>
              <FormControl>
                <Input placeholder="example@example.com" type="text" {...field}>
                  {form.formState.errors.email?.message && (
                    <WarningCircle size={24} color="#fb2c36" />
                  )}
                </Input>
              </FormControl>
              <FormMessage>{form.formState.errors.email?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password*</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field}>
                  {form.formState.errors.password?.message && (
                    <WarningCircle size={24} color="#fb2c36" />
                  )}
                </Input>
              </FormControl>
              <FormMessage>
                {form.formState.errors.password?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password*</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field}>
                  {form.formState.errors.confirm_password?.message && (
                    <WarningCircle size={24} color="#fb2c36" />
                  )}
                </Input>
              </FormControl>
              <FormMessage>
                {form.formState.errors.confirm_password?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <div className="text-sm font-medium text-red-500">
            <p>{form.formState.errors.root.message}</p>
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid || isPending}
        >
          {!isPending ? "Continue" : <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
