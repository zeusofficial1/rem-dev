import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className="fixed bottom-6 right-6 flex gap-2 z-[1000]">
      <button 
        onClick={onZoomIn}
        className="p-2.5 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        aria-label="Zoom in"
      >
        <ZoomIn className="w-5 h-5 text-gray-700" />
      </button>
      <button 
        onClick={onZoomOut}
        className="p-2.5 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        aria-label="Zoom out"
      >
        <ZoomOut className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
};

export default ZoomControls;