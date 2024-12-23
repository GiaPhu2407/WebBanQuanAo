import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onChange: (url: string | null) => void;
  value?: string;
  onRemove?: () => void;
}

export function FileUpload({
  onChange,
  value,
  onRemove
}: FileUploadProps) {
  if (value) {
    return (
      <div className="relative h-48 w-full">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-md object-cover"
        />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
}