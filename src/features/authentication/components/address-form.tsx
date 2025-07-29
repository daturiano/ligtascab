'use client';
import FormBottomNavigation from '@/components/private/form-bottom-navigation';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { citiesAndMunicipalities, province } from '@/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AddressSchema } from '../schemas/authentication';
import { useCreateOperator } from './create-operator-provider';

export default function AddressForm() {
  const { step, nextStep, formData, prevStep, setData, readonly } =
    useCreateOperator();

  const form = useForm<z.infer<typeof AddressSchema>>({
    resolver: zodResolver(AddressSchema),
    mode: 'onBlur',
    defaultValues: {
      province: formData.addressDetails?.province || '',
      municipality: formData.addressDetails?.municipality || '',
      address: formData.addressDetails?.address || '',
      postal_code: formData.addressDetails?.postal_code || '',
    },
  });

  const onSubmit = (values: z.infer<typeof AddressSchema>) => {
    setData({ addressDetails: values });
    nextStep();
  };

  return (
    <>
      <Card className="w-full lg:max-w-[650px]">
        <CardHeader>
          <CardTitle className="text-2xl">Your work address</CardTitle>
          <CardDescription>
            Please provide the location where you primarily operate your fleet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
              id="address-form"
            >
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      disabled={readonly}
                      defaultValue={formData.addressDetails?.province}
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
                    <FormLabel>Municipality*</FormLabel>
                    <Select
                      disabled={readonly}
                      onValueChange={field.onChange}
                      defaultValue={formData.addressDetails?.municipality}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Street name, building, barangay"
                        type="text"
                        {...field}
                        className="h-12"
                        readOnly={readonly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Postal code"
                        type="tel"
                        {...field}
                        className="h-12"
                        maxLength={4}
                        readOnly={readonly}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
      <FormBottomNavigation
        onSubmit={() => onSubmit}
        step={step}
        prevStep={prevStep}
        formName="address-form"
      />
    </>
  );
}
