"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createAuthorityUserAction } from "../actions/user-management";
import { getErrorMessage, getFormattedDate } from "@/lib/utils";
import { z } from "zod";

const CreateAuthoritySchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().optional(),
});

type CreateAuthority = z.infer<typeof CreateAuthoritySchema>;

export default function CreateAuthorityDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<CreateAuthority>({
    resolver: zodResolver(CreateAuthoritySchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: CreateAuthority) => {
    setIsPending(true);
    try {
      const { error, tempPassword } = await createAuthorityUserAction(data);
      if (error) {
        toast.error(getErrorMessage(error), { description: getFormattedDate() });
      } else {
        if (tempPassword) {
          toast.success(
            `Authority user created. Temporary password: ${tempPassword}`,
            { duration: 10000 }
          );
        } else {
          toast.success("Authority user created successfully");
        }
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      toast.error(getErrorMessage(error), { description: getFormattedDate() });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Add Authority
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Authority User</DialogTitle>
          <DialogDescription>
            Create a new authority user account. Leave password blank to generate
            a temporary password.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="authority@example.com" {...field} />
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
                  <FormLabel>Password (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Leave blank for auto-generated"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Spinner /> : "Create Authority"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
