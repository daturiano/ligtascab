'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getErrorMessage, getFormattedDate } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { WarningCircle } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { registerDriverWithPhone } from '../actions/drivers';
import { DriverCredentialsSchema } from '../schemas/drivers';
import { useCreateDriver } from './create-driver-provider';
import FormBottomNavigation from './form-bottom-navigation';

export default function DriverSignUpForm() {
  const { step, driver } = useCreateDriver();
  const router = useRouter();

  const form = useForm<z.infer<typeof DriverCredentialsSchema>>({
    resolver: zodResolver(DriverCredentialsSchema),
    mode: 'onBlur',
    defaultValues: {
      phone: '',
      password: '',
      confirm_password: '',
    },
  });

  if (!driver) return null;

  const onSubmit = async (data: z.infer<typeof DriverCredentialsSchema>) => {
    try {
      const user = await registerDriverWithPhone(data, driver.id);
      if (user) {
        router.push('/drivers');
      }
    } catch (error) {
      toast.error(getErrorMessage(error), {
        description: getFormattedDate(),
      });
    }
  };

  return (
    <div>
      <Card className="min-w-[350px] lg:min-w-[650px] lg:max-w-[650px] w-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Driver Details</CardTitle>
          <CardDescription>
            Create the driver account that can be accessed with their registered
            phone number.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 max-w-3xl mx-auto"
              id="driver-sign-up-form"
            >
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address*</FormLabel>
                    <FormControl>
                      <Input placeholder="+639391234567" type="text" {...field}>
                        {form.formState.errors.phone?.message && (
                          <WarningCircle size={24} color="#fb2c36" />
                        )}
                      </Input>
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.phone?.message}
                    </FormMessage>
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
                      <Input type="password" {...field}>
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
                      <Input type="password" {...field}>
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
            </form>
          </Form>
        </CardContent>
      </Card>
      <FormBottomNavigation
        onSubmit={() => onSubmit}
        step={step}
        formName="driver-sign-up-form"
      />
    </div>
  );
}
