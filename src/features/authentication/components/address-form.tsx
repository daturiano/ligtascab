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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { citiesAndMunicipalities, province } from '@/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AddressSchema } from '../schemas/authentication';
import { useProgress } from './progress-provider';

export default function AddressForm() {
  const { formData, updateData, setFormValid } = useProgress();
  const [isReady, setIsReady] = useState(false);

  const form = useForm<z.infer<typeof AddressSchema>>({
    resolver: zodResolver(AddressSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    const addressDetails = formData.addressDetails || {};

    form.reset({
      province: addressDetails.province || '',
      municipality: addressDetails.municipality || '',
      address: addressDetails.address || '',
      postal_code: addressDetails.postal_code || '',
    });

    setTimeout(() => {
      form.trigger().then(() => {
        setFormValid(form.formState.isValid);
        setIsReady(true);
      });
    }, 0);
  }, [formData, form, setFormValid]);

  // Second useEffect to sync form changes back to context, but only after initial load
  useEffect(() => {
    if (!isReady) return;

    const subscription = form.watch((values) => {
      if (
        values &&
        Object.keys(values).some((key) => values[key] !== undefined)
      ) {
        updateData({ addressDetails: values as any });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, updateData, setFormValid, isReady]);

  useEffect(() => {
    setFormValid(form.formState.isValid);
  }, [form.formState.isValid, setFormValid]);

  return (
    <Card className="w-full max-w-[28rem]">
      <CardHeader>
        <CardTitle className="text-2xl">Your work address</CardTitle>
        <CardDescription>
          Please provide the location where you primarily operate your fleet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6 w-full">
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    value={formData.addressDetails?.province || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full py-6">
                        <SelectValue placeholder="Province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {province.map((item) => (
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
              name="municipality"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    value={formData.addressDetails?.municipality || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full py-6">
                        <SelectValue placeholder="I'm a citizen of" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {citiesAndMunicipalities.map((item) => (
                        <SelectItem value={item} key={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage>
                    {form.formState.errors.municipality?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Street name, building, barangay"
                      type="text"
                      {...field}
                      value={field.value || ''}
                      className="h-12 placeholder:text-sm"
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.address?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Postal code"
                      type="text"
                      {...field}
                      value={field.value || ''}
                      className="h-12 placeholder:text-sm"
                      maxLength={5}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.postal_code?.message}
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
  );
}
