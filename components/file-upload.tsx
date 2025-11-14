"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileIcon } from 'lucide-react';
import { uploadFile, validateFileSize, validateFileType } from "@/lib/firebase/storage";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  path: string;
  allowedTypes?: string[];
  maxSizeMB?: number;
  accept?: string;
}

export function FileUpload({
  onUploadComplete,
  path,
  allowedTypes = ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
  maxSizeMB = 10,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file size
    if (!validateFileSize(file, maxSizeMB)) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    if (!validateFileType(file, allowedTypes)) {
      setError(`File type not allowed. Allowed types: ${allowedTypes.join(", ")}`);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const url = await uploadFile(selectedFile, `${path}/${selectedFile.name}`, (prog) => {
        setProgress(prog.progress);
      });

      onUploadComplete(url);
      setSelectedFile(null);
      setProgress(0);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          onChange={handleFileSelect}
          accept={accept}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <label htmlFor="file-upload">
          <Button type="button" variant="outline" disabled={uploading} asChild>
            <span className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </span>
          </Button>
        </label>

        {selectedFile && (
          <div className="flex items-center gap-2 flex-1">
            <FileIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate">{selectedFile.name}</span>
            {!uploading && (
              <Button type="button" variant="ghost" size="icon" onClick={handleRemove}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {selectedFile && !uploading && (
        <Button type="button" onClick={handleUpload} className="w-full">
          Upload File
        </Button>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground text-center">{Math.round(progress)}%</p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
