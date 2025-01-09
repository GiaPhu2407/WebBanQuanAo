import { ourFileRouter } from "@/app/api/uploadthing/core";

import React from "react";
import { UploadDropzone } from "./upload-dropzone";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
  showmodal: boolean;
}
const Fileupload = ({ onChange, endpoint, showmodal }: FileUploadProps) => {
  return showmodal ? (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res: { url: string | undefined }[]) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        alert(`ERROR! ${error.message}`);
      }}
    />
  ) : null;
};

export default Fileupload;
