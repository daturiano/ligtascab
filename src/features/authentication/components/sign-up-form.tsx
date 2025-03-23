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
import { UserSchema } from "@/features/authentication/schemas/authentication";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { registerUser } from "../actions/authentication";
import Spinner from "@/components/ui/spinner";

export default function SignUpForm() {
  const [isPending, startTransition] = useTransition();

  const registerCredentials = async (data: z.infer<typeof UserSchema>) => {
    const response = await registerUser(data);
    if (response?.error) {
      toast(response.error);
      return;
    }
    if (response?.message) {
      toast(response.message, {
        description: "",
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
    defaultValues: {
      phone_number: "",
      first_name: "",
      last_name: "",
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
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number*</FormLabel>
              <FormControl>
                <Input placeholder="Phone number" type="text" {...field} />
              </FormControl>
              <FormMessage />
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
                <Input placeholder="Password*" type="password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Legal first name*</FormLabel>
              <FormControl>
                <Input placeholder="Legal first name" type="text" {...field} />
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
              <FormLabel>Legal last name*</FormLabel>
              <FormControl>
                <Input placeholder="Legal last name" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <div className="text-sm font-medium text-red-500">
            <p>{form.formState.errors.root.message}</p>
          </div>
        )}
        <Button type="submit" className="w-full" disabled={isPending}>
          {`${isPending ? <Spinner /> : "Continue"}`}
        </Button>
      </form>
    </Form>
  );
}
