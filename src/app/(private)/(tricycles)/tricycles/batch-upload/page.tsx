import TricycleBatchUpload from "@/features/batch-upload/components/tricycle-batch-upload";

export default function TricycleBatchUploadPage() {
  return (
    <div className="mx-auto mb-12 gap-4 space-y-4">
      <div>
        <h1 className="text-3xl font-semibold">Batch Upload Tricycles</h1>
        <p className="text-muted-foreground">
          Import multiple tricycles at once using a CSV file
        </p>
      </div>
      <TricycleBatchUpload />
    </div>
  );
}
