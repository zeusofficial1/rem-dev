import React from 'react';
import { Image, Film } from 'lucide-react';

interface MediaFiltersProps {
  activeFilter: 'all' | 'images' | 'videos';
  onFilterChange: (filter: 'all' | 'images' | 'videos') => void;
}

const MediaFilters: React.FC<MediaFiltersProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onFilterChange('all')}
        className={`px-4 py-2 rounded-lg flex items-center ${
          activeFilter === 'all'
            ? 'bg-black text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      <button
        onClick={() => onFilterChange('images')}
        className={`px-4 py-2 rounded-lg flex items-center ${
          activeFilter === 'images'
            ? 'bg-black text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Image className="w-4 h-4 mr-2" />
        Images
      </button>
      <button
        onClick={() => onFilterChange('videos')}
        className={`px-4 py-2 rounded-lg flex items-center ${
          activeFilter === 'videos'
            ? 'bg-black text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Film className="w-4 h-4 mr-2" />
        Videos
      </button>
    </div>
  );
};

export default MediaFilters;