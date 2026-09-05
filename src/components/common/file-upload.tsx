import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CloudUpload, CheckCircle, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";

interface UploadDropzoneProps {
  isMulti?: boolean;
  label?: string;
  onChange?: (url: string) => void;
  value?: string;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  isMulti = false,
  label = "Upload file",
  onChange,
  value,
}) => {
  const [droppedFiles, setDroppedFiles] = useState<File[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);

  const startSimulatedProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 150);
    return interval;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles || acceptedFiles.length === 0) return;
      setIsUploading(true);
      const progressInterval = startSimulatedProgress();
      setDroppedFiles(acceptedFiles);

      // Create local preview URL
      const file = acceptedFiles[0];
      const objectUrl = URL.createObjectURL(file);
      
      setTimeout(() => {
        setUploadProgress(100);
        clearInterval(progressInterval);
        setIsUploading(false);
        setPreviewUrl(objectUrl);
        if (onChange) {
          onChange(objectUrl);
        }
        toast.success("File uploaded successfully");
      }, 1000);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: isMulti,
    maxSize: 50 * 1024 * 1024,
  });

  useEffect(() => {
    if (fileRejections.length > 0) {
      toast.error("File rejected. Please upload valid image under 50MB.");
    }
  }, [fileRejections]);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "mt-3 flex flex-col cursor-pointer items-center justify-center rounded-md border border-dashed p-6 py-8 hover:bg-muted/30 transition-colors bg-muted/10",
        isUploading ? "pointer-events-none opacity-80" : ""
      )}
    >
      <input multiple={isMulti} {...getInputProps()} disabled={isUploading} />
      <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
        {previewUrl ? (
          <div className="flex flex-col items-center gap-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-32 w-48 object-cover rounded-md border shadow-sm"
            />
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Image Selected (Click or drag to replace)
            </span>
          </div>
        ) : (
          <>
            <div className="p-3 bg-muted rounded-full">
              <CloudUpload size={32} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                <span className="font-semibold underline text-primary">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs mt-1 text-muted-foreground">
                PNG, JPG, WEBP up to 50MB
              </p>
            </div>
          </>
        )}

        {isUploading ? (
          <div className="mx-auto mt-2 w-full max-w-xs">
            <Progress value={uploadProgress} className="h-1.5 w-full" />
            <p className="text-xs mt-1 text-center">Uploading... {uploadProgress}%</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UploadDropzone;
