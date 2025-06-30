'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn, getErrorMessage } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { DriverComplianceSchema } from '../schemas/drivers';
import { useState } from 'react';
import DocumentCard from '@/features/authentication/components/document-card';
import { AttachmentDetails, DocumentType } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { updateDriverLicense, uploadDriverDocument } from '../actions/drivers';

const MAX_FILE_SIZE_MB = 5;

const document_type: DocumentType[] = [
  {
    id: 'license-front',
    title: "Driver's License Front",
    description: "Upload the front part of driver's license",
    required: true,
  },
  {
    id: 'license-back',
    title: "Driver's License Back",
    description: "Upload the back part of driver's license",
    required: true,
  },
];

type UpdateLicenseParams = {
  driver_id: string;
  data: z.infer<typeof DriverComplianceSchema>;
};

export default function UpdateLicenseForm({
  driver_id,
}: {
  driver_id: string;
}) {
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({});
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateLicenseMutation = useMutation({
    mutationFn: async ({ driver_id, data }: UpdateLicenseParams) => {
      const { data: driver } = await updateDriverLicense(driver_id, data);
      return driver;
    },
  });

  const onSubmit = async (values: z.infer<typeof DriverComplianceSchema>) => {
    const attachmentDetails: AttachmentDetails = {};

    Object.entries(selectedFiles).forEach(([docId, file]) => {
      const docType = document_type.find((doc) => doc.id === docId);
      attachmentDetails[docId] = {
        file: file,
        documentId: docId,
        documentTitle: docType?.title || 'Unknown Document',
      };
    });

    try {
      const driver = await updateLicenseMutation.mutateAsync({
        driver_id: driver_id,
        data: values,
      });
      await uploadDriverDocument(driver_id, attachmentDetails);
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success(
        `${driver.first_name} ${driver.last_name} license updated successfully!`
      );
      router.push('/drivers');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleFileSelect = (docId: string, file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`"${file.name}" exceeds the 5MB file size limit.`);
      return;
    }

    setSelectedFiles((prev) => ({
      ...prev,
      [docId]: file,
    }));
  };

  const areRequiredDocumentsUploaded = () => {
    const requiredDocs = document_type.filter((doc) => doc.required);
    return requiredDocs.every(
      (doc) =>
        selectedFiles[doc.id] !== null && selectedFiles[doc.id] !== undefined
    );
  };

  const form = useForm<z.infer<typeof DriverComplianceSchema>>({
    resolver: zodResolver(DriverComplianceSchema),
    mode: 'onBlur',
    defaultValues: {
      license_number: '',
      license_expiration: undefined,
    },
  });

  return (
    <div>
      <Card className="min-w-[350px] lg:min-w-[650px] lg:max-w-[650px] w-full mb-24">
        <CardHeader>
          <CardTitle className="text-base font-bold">
            Driver&apos;s License Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
              id="update-license-form"
            >
              <FormField
                control={form.control}
                name="license_number"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="License number*"
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
                name="license_expiration"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger
                        asChild
                        className="h-12 bg-transparent rounded-md border shadow-xs outline-none border-muted-foreground/40 hover:bg-transparent"
                      >
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span className="text-xs lg:text-sm">
                                License expiration*
                              </span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="end">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          fromYear={2020}
                          toYear={2050}
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <div className="min-w-[350px] lg:min-w-[650px] lg:max-w-[650px] w-full px-6">
          <div className="flex flex-col gap-4 w-full">
            {document_type.map((docType) => (
              <DocumentCard
                readonly={false}
                key={docType.id}
                document={docType}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFiles[docType.id] || null}
              />
            ))}
          </div>
        </div>
      </Card>
      <div
        className={`min-w-screen px-4 bg-card h-16 flex items-center fixed bottom-0 left-0`}
      >
        <div className="mx-auto flex justify-end max-w-screen-xl w-full">
          <Button
            size={'lg'}
            className="text-xs lg:text-sm"
            disabled={
              !areRequiredDocumentsUploaded() || updateLicenseMutation.isPending
            }
            form="update-license-form"
          >
            {updateLicenseMutation.isPending ? (
              <div className="p-4 text-center text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
              </div>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
