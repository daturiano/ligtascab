import DriverBatchUpload from "@/features/batch-upload/components/driver-batch-upload";

export default function DriverBatchUploadPage() {
  return (
    <div className="mx-auto mb-12 gap-4 space-y-4">
      <div>
        <h1 className="text-3xl font-semibold">Batch Upload Drivers</h1>
        <p className="text-muted-foreground">
          Import multiple drivers at once using a CSV file
        </p>
      </div>
      <DriverBatchUpload />
    </div>
  );
}
