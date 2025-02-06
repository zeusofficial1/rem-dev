import React, { useState, useCallback, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Film, AlertCircle, RefreshCw } from 'lucide-react';
import { uploadToWasabi, validateFileType, getFileType, getFileSize } from '../../services/wasabiService';
import toast from 'react-hot-toast';

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (urls: string[]) => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  error?: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
}

const MediaUploadModal: React.FC<MediaUploadModalProps> = ({ isOpen, onClose, onUploadComplete }) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFiles = async (files: File[]) => {
    const newFiles = files.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const
    }));

    setUploadingFiles(prev => [...prev, ...newFiles]);
    const uploadedUrls: string[] = [];

    for (const fileData of newFiles) {
      if (!validateFileType(fileData.file)) {
        setUploadingFiles(prev => prev.map(f => 
          f.file === fileData.file 
            ? { ...f, status: 'error', error: 'Invalid file type' }
            : f
        ));
        continue;
      }

      try {
        setUploadingFiles(prev => prev.map(f => 
          f.file === fileData.file 
            ? { ...f, status: 'uploading', error: undefined }
            : f
        ));

        const url = await uploadToWasabi(fileData.file, (progress) => {
          setUploadingFiles(prev => prev.map(f => 
            f.file === fileData.file 
              ? { ...f, progress }
              : f
          ));
        });

        uploadedUrls.push(url);
        setUploadingFiles(prev => prev.map(f => 
          f.file === fileData.file 
            ? { ...f, status: 'completed', progress: 100, url }
            : f
        ));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        console.error('Failed to upload', fileData.file.name, error);
        setUploadingFiles(prev => prev.map(f => 
          f.file === fileData.file 
            ? { ...f, status: 'error', error: errorMessage }
            : f
        ));
      }
    }

    if (uploadedUrls.length > 0) {
      onUploadComplete(uploadedUrls);
      toast.success(`Successfully uploaded ${uploadedUrls.length} files`);
    }
  };

  const handleRetry = async (fileData: UploadingFile) => {
    await handleFiles([fileData.file]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upload Media</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors
            ${isDragging ? 'border-black bg-gray-50' : 'border-gray-300'}
            ${uploadingFiles.length > 0 ? 'border-none p-0' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadingFiles.length === 0 ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="w-12 h-12 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium">Drag and drop your files here</p>
                <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Upload className="w-5 h-5 mr-2" />
                Choose Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-sm text-gray-500">
                Supported formats: JPG, PNG, GIF, WebP
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {uploadingFiles.map((fileData, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4"
                >
                  <div className="flex-shrink-0">
                    {getFileType(fileData.file) === 'image' ? (
                      <ImageIcon className="w-8 h-8 text-blue-500" />
                    ) : (
                      <Film className="w-8 h-8 text-purple-500" />
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium truncate">{fileData.file.name}</p>
                        <p className="text-xs text-gray-500">{getFileSize(fileData.file.size)}</p>
                      </div>
                      {fileData.status === 'error' && (
                        <button
                          onClick={() => handleRetry(fileData)}
                          className="ml-2 p-1 text-gray-500 hover:text-black rounded-full hover:bg-gray-200 transition-colors"
                          title="Retry upload"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {fileData.status === 'error' ? (
                      <div className="flex items-center text-red-500 text-sm mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {fileData.error}
                      </div>
                    ) : (
                      <div className="relative mt-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              fileData.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${fileData.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-sm">
                    {fileData.status === 'completed' ? (
                      <span className="text-green-500">Complete</span>
                    ) : fileData.status === 'error' ? (
                      <span className="text-red-500">Failed</span>
                    ) : (
                      <span>{Math.round(fileData.progress)}%</span>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-black hover:border-black transition-colors"
              >
                <Upload className="w-5 h-5 mx-auto" />
                <span className="text-sm mt-1">Add More Files</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaUploadModal;