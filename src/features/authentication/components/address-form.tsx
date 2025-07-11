'use client';
import FormBottomNavigation from '@/components/form-bottom-navigation';
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
      province: formData.addressDetails?.province || 'Camarines Sur',
      municipality: formData.addressDetails?.municipality || 'Naga City',
      address: formData.addressDetails?.address || 'Zone 1, Brgy. Triangulo',
      postal_code: formData.addressDetails?.postal_code || '4400',
    },
  });

  const onSubmit = (values: z.infer<typeof AddressSchema>) => {
    setData({ addressDetails: values });
    nextStep();
  };

  return (
    <div>
      <Card className="min-w-[350px] lg:min-w-[650px] lg:max-w-[650px] w-full">
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
                    <Select
                      onValueChange={field.onChange}
                      disabled={readonly}
                      value={field.value}
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
                    <Select
                      disabled={readonly}
                      value={field.value}
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
                        className="h-12"
                        readOnly={readonly}
                      />
                    </FormControl>
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
    </div>
  );
}
