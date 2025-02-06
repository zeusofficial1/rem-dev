import React, { useState, useCallback } from 'react';
import { X, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadToWasabi, validateFileType, validateFileSize, getFileSize } from '../../services/wasabiService';
import toast from 'react-hot-toast';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (urls: string[]) => void;
  currentPhotos: string[];
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  currentPhotos,
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<Array<{ 
    file: File; 
    progress: number; 
    error?: string;
    status: 'pending' | 'uploading' | 'completed' | 'error';
  }>>([]);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = useCallback((file: File): string | null => {
    if (!validateFileType(file)) {
      return 'Invalid file type. Please upload a valid image file.';
    }
    if (!validateFileSize(file)) {
      return 'File size exceeds 10MB limit.';
    }
    return null;
  }, []);

  const handleFiles = useCallback(async (files: File[]) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Please select valid image files');
      return;
    }

    const newUploadingFiles = imageFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);
    const uploadedUrls: string[] = [];

    for (const fileData of newUploadingFiles) {
      const validationError = validateFile(fileData.file);
      if (validationError) {
        setUploadingFiles(prev =>
          prev.map(f =>
            f.file === fileData.file
              ? { ...f, error: validationError, status: 'error' }
              : f
          )
        );
        continue;
      }

      try {
        setUploadingFiles(prev =>
          prev.map(f =>
            f.file === fileData.file
              ? { ...f, status: 'uploading' }
              : f
          )
        );

        const url = await uploadToWasabi(fileData.file, (progress) => {
          setUploadingFiles(prev => 
            prev.map(f => 
              f.file === fileData.file ? { ...f, progress } : f
            )
          );
        });

        uploadedUrls.push(url);
        setUploadingFiles(prev =>
          prev.map(f =>
            f.file === fileData.file
              ? { ...f, status: 'completed', progress: 100 }
              : f
          )
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setUploadingFiles(prev =>
          prev.map(f =>
            f.file === fileData.file
              ? { ...f, error: errorMessage, status: 'error' }
              : f
          )
        );
        toast.error(`Failed to upload ${fileData.file.name}`);
      }
    }

    if (uploadedUrls.length > 0) {
      onUpload(uploadedUrls);
      toast.success(`Successfully uploaded ${uploadedUrls.length} ${uploadedUrls.length === 1 ? 'image' : 'images'}`);
    }
  }, [onUpload, validateFile]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  }, [handleFiles]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleFiles(files);
  }, [handleFiles]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="inline-block w-full max-w-3xl overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Gallery</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop your images here, or{' '}
                  <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Maximum file size: 10MB. Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>
            </div>

            {uploadingFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadingFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-gray-50 rounded-lg"
                  >
                    <ImageIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.file.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {getFileSize(file.file.size)}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                        <div
                          className={`h-1 rounded-full transition-all duration-300 ${
                            file.status === 'error' 
                              ? 'bg-red-500' 
                              : file.status === 'completed'
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                      {file.error && (
                        <div className="flex items-center mt-1 text-xs text-red-500">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {file.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentPhotos.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Current Photos ({currentPhotos.length})
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {currentPhotos.map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        src={photo}
                        alt={`Gallery item ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GalleryModal;