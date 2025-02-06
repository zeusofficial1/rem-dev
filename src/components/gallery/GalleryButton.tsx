import React from 'react';
import { Image } from 'lucide-react';

interface GalleryButtonProps {
  onClick: () => void;
  photoCount: number;
}

const GalleryButton: React.FC<GalleryButtonProps> = ({ onClick, photoCount }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-3 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
    >
      <Image className="w-5 h-5 text-gray-600 mr-2" />
      <span className="text-sm font-medium text-gray-700">
        Gallery {photoCount > 0 && `(${photoCount})`}
      </span>
    </button>
  );
};

export default GalleryButton;