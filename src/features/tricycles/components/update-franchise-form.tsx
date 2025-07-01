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
import DocumentCard from '@/features/authentication/components/document-card';
import { AttachmentDetails, DocumentType } from '@/lib/types';
import { cn, getErrorMessage } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import {
  updateTricycleInformation,
  uploadTricycleDocument,
} from '../actions/tricycles';
import {
  TricycleFranchiseSchema,
  TricycleUpdateSchema,
} from '../schemas/tricycle';

const MAX_FILE_SIZE_MB = 5;

const document_type: DocumentType[] = [
  {
    id: 'certificate-of-franchise',
    title: 'Franchise Certificate',
    description: 'Upload the tricycles Franchise Certificate',
    required: true,
  },
];

export default function UpdateFranchiseForm() {
  const { tricycleId } = useParams();
  const tricycle_id = tricycleId as string;
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({});
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateFranchiseMutation = useMutation({
    mutationFn: async (data: z.infer<typeof TricycleUpdateSchema>) =>
      updateTricycleInformation(data, tricycle_id),
  });

  const onSubmit = async (values: z.infer<typeof TricycleFranchiseSchema>) => {
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
      const { data: tricycle } = await updateFranchiseMutation.mutateAsync({
        compliance_details: {
          franchise_number: values.franchise_number,
        },
        franchise_expiration: values.franchise_expiration,
      });
      await uploadTricycleDocument(tricycleId as string, attachmentDetails);
      queryClient.invalidateQueries({ queryKey: ['tricycles'] });
      toast.success(`${tricycle.plate_number} franchise updated successfully!`);
      router.push(`/tricycles/${tricycle_id}`);
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

  const form = useForm<z.infer<typeof TricycleFranchiseSchema>>({
    resolver: zodResolver(TricycleFranchiseSchema),
    mode: 'onBlur',
    defaultValues: {
      franchise_number: '',
      franchise_expiration: undefined,
    },
  });

  return (
    <div className="flex flex-col gap-6 flex-1 max-w-screen-xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="lg:text-3xl text-xl font-semibold">
          Update your Tricycle&apos;s franchise details.
        </h1>
        <p className="text-muted-foreground text-sm lg:text-lg">
          Update your Tricycle&apos;s franchise for operational use.
        </p>
      </div>
      <Card className="min-w-[350px] lg:min-w-[650px] lg:max-w-[650px] w-full mb-24">
        <CardHeader>
          <CardTitle className="text-base font-bold">
            Tricycle&apos;s Franchise Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
              id="update-franchise-form"
            >
              <FormField
                control={form.control}
                name="franchise_number"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Franchise number*"
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
                name="franchise_expiration"
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
                                Franchise expiration*
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
            disabled={!areRequiredDocumentsUploaded()}
            form="update-franchise-form"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
