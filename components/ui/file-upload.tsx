import React from 'react';
import { UploadDropzone } from "@/components/ui/upload-dropzone";
// import { toast } from "sonner";
import { X } from "lucide-react";

interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  onRemove: () => void;
}

export function FileUpload({ value, onChange, onRemove }: FileUploadProps) {
  return (
    <div className="space-y-4 w-full">
      {!value ? (
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            onChange(res?.[0]?.url);
            // toast.success("Upload completed");
          }}
          onUploadError={(error: Error) => {
            // toast.error(`ERROR! ${error.message}`);
          }}
        />
      ) : (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Upload"
            className="h-24 w-24 object-cover rounded-md"
          />
          <button
            onClick={() => {
              onRemove();
              onChange(undefined);
            }}
            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}