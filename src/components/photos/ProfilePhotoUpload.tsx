import React, { useState, useRef } from 'react';
import { Upload, Camera } from 'lucide-react';
import { uploadToWasabi, validateFileType, validateFileSize } from '../../services/wasabiService';
import toast from 'react-hot-toast';

interface ProfilePhotoUploadProps {
  currentPhoto?: string | null;
  onPhotoUpdate: (url: string) => Promise<void>;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  currentPhoto,
  onPhotoUpdate,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!validateFileType(file)) {
      toast.error('Please select a valid image file (JPG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (!validateFileSize(file)) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const url = await uploadToWasabi(file, (progress) => {
        setUploadProgress(progress);
      });

      await onPhotoUpdate(url);
      toast.success('Profile photo updated successfully');
    } catch (error) {
      console.error('Photo upload error:', error);
      toast.error('Failed to update profile photo');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="absolute -bottom-3 -right-3 group">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="profile-photo-upload"
      />

      {isUploading ? (
        <div className="bg-black text-white rounded-lg px-3 py-2 text-sm font-medium">
          Uploading... {uploadProgress}%
        </div>
      ) : (
        <label
          htmlFor="profile-photo-upload"
          className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full cursor-pointer shadow-lg hover:bg-gray-800 transition-colors"
        >
          <Camera className="w-5 h-5" />
        </label>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;