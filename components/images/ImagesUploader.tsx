// components/images/ImagesUploader.tsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useImageManagement } from '@/hooks/useImageManagement';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png']
};

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export function ImagesUploader() {
  const { uploadImages } = useImageManagement();
  const { toast } = useToast();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadingFiles(prev => [...prev, ...newFiles]);

    for (const fileData of newFiles) {
      try {
        await uploadImages([fileData.file], (progress) => {
          setUploadingFiles(prev =>
            prev.map(f =>
              f.id === fileData.id
                ? { ...f, progress: Math.round(progress) }
                : f
            )
          );
        });

        setUploadingFiles(prev =>
          prev.map(f =>
            f.id === fileData.id
              ? { ...f, status: 'success', progress: 100 }
              : f
          )
        );

        toast({
          title: "Upload successful",
          description: `${fileData.file.name} has been uploaded.`,
        });

        // Remove successful upload from list after 2 seconds
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== fileData.id));
        }, 2000);

      } catch (error) {
        setUploadingFiles(prev =>
          prev.map(f =>
            f.id === fileData.id
              ? { ...f, status: 'error', error: 'Upload failed' }
              : f
          )
        );

        toast({
          variant: "destructive",
          title: "Upload failed",
          description: `Failed to upload ${fileData.file.name}. Please try again.`,
        });
      }
    }
  }, [uploadImages, toast]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true
  });

  const removeFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-4">
      {fileRejections.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            {fileRejections.map(({ file, errors }) => (
              <div key={file.name}>
                {file.name}: {errors.map(e => e.message).join(', ')}
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200 ease-in-out hover:border-primary/50 hover:bg-primary/5
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600">
          {isDragActive
            ? "Drop your images here..."
            : "Drag 'n' drop images here, or click to select"}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Maximum file size: 5MB | Supported formats: JPEG, PNG
        </p>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          {uploadingFiles.map((file) => (
            <div key={file.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {file.status === 'uploading' && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  {file.status === 'success' && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {file.file.name}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Progress value={file.progress} className="h-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}