import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

// For development, we'll use a mock storage service
const isDevelopment = import.meta.env.DEV;

// Get file type category
export const getFileType = (file: File): 'image' | 'video' | null => {
  if (!file.type) return null;
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  return null;
};

// Validate file type
export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/heic',
    'image/heif'
  ];
  
  return allowedTypes.includes(file.type.toLowerCase());
};

// Validate file size (max 10MB)
export const validateFileSize = (file: File): boolean => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return file.size <= maxSize;
};

// Clean filename
const sanitizeFileName = (fileName: string): string => {
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  const extension = cleanName.split('.').pop();
  return `${timestamp}_${cleanName.split('.')[0]}.${extension}`;
};

// Mock storage for development
const mockUpload = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) onProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        // Create a temporary URL for development
        const url = URL.createObjectURL(file);
        resolve(url);
      }
    }, 200);
  });
};

// Upload file with progress callback
export const uploadToWasabi = async (
  file: File, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  // Validate file before upload
  if (!validateFileType(file)) {
    throw new Error('Invalid file type. Please upload a valid image file.');
  }

  if (!validateFileSize(file)) {
    throw new Error('File size exceeds 10MB limit.');
  }

  // Use mock storage in development
  if (isDevelopment) {
    return mockUpload(file, onProgress);
  }

  // Production Wasabi configuration
  const WASABI_ENDPOINT = 'https://s3.wasabisys.com';
  const REGION = 'us-east-1';
  const BUCKET_NAME = import.meta.env.VITE_WASABI_BUCKET_NAME;
  const ACCESS_KEY = import.meta.env.VITE_WASABI_ACCESS_KEY_ID;
  const SECRET_KEY = import.meta.env.VITE_WASABI_SECRET_ACCESS_KEY;

  if (!BUCKET_NAME || !ACCESS_KEY || !SECRET_KEY) {
    throw new Error('Wasabi configuration is incomplete');
  }

  const s3Client = new S3Client({
    endpoint: WASABI_ENDPOINT,
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
    forcePathStyle: true,
    maxAttempts: 3
  });

  const sanitizedFileName = sanitizeFileName(file.name);
  const key = `uploads/${sanitizedFileName}`;

  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: file.type,
        ACL: 'public-read',
        ContentDisposition: 'inline',
        CacheControl: 'max-age=31536000',
      },
      queueSize: 1,
      partSize: 5 * 1024 * 1024,
      leavePartsOnError: false,
    });

    upload.on('httpUploadProgress', (progress) => {
      if (onProgress && progress.loaded && progress.total) {
        const percentage = (progress.loaded / progress.total) * 100;
        onProgress(Math.round(percentage));
      }
    });

    await upload.done();
    
    return `https://${BUCKET_NAME}.s3.wasabisys.com/${key}`;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file. Please try again.');
  }
};

// Get formatted file size
export const getFileSize = (bytes: number): string => {
  if (typeof bytes !== 'number' || isNaN(bytes)) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = Math.abs(bytes);
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${Number(size).toFixed(1)} ${units[unitIndex]}`;
};