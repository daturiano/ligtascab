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
import { getFormattedDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { WarningCircle } from "@phosphor-icons/react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { CredentialsSchema } from "../schemas/authentication";
import { signInWithCredentials } from "../actions/authentication";

export default function SignInForm() {
  const [isPending, startTransition] = useTransition();

  const loginCredentials = async (data: z.infer<typeof CredentialsSchema>) => {
    const response = await signInWithCredentials(data);
    if (response?.error) {
      toast.error(response.error, {
        description: getFormattedDate(),
      });
      return;
    }
    if (response?.message) {
      toast.success(response.message, {
        description: getFormattedDate(),
      });
      return;
    }
  };

  function onSubmit(data: z.infer<typeof CredentialsSchema>) {
    startTransition(() => {
      loginCredentials(data);
    });
  }

  const form = useForm<z.infer<typeof CredentialsSchema>>({
    resolver: zodResolver(CredentialsSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
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
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@example.com"
                  type="text"
                  {...field}
                  className="h-12"
                >
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Password"
                  type="password"
                  {...field}
                  className="h-12"
                >
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
          {!isPending ? "Log in" : <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
