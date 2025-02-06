import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  memberName: string;
  memberId: string;
  date: string;
}

interface MediaGridProps {
  media: MediaItem[];
}

const MediaGrid: React.FC<MediaGridProps> = ({ media }) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleSelectMedia = (item: MediaItem) => {
    setSelectedMedia(item);
    setSelectedIndex(media.findIndex(m => m.id === item.id));
  };

  const handleClose = () => {
    setSelectedMedia(null);
    setSelectedIndex(0);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex > 0) {
      setSelectedIndex(prev => prev - 1);
      setSelectedMedia(media[selectedIndex - 1]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex < media.length - 1) {
      setSelectedIndex(prev => prev + 1);
      setSelectedMedia(media[selectedIndex + 1]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedMedia) return;

    switch (e.key) {
      case 'ArrowLeft':
        if (selectedIndex > 0) {
          setSelectedIndex(prev => prev - 1);
          setSelectedMedia(media[selectedIndex - 1]);
        }
        break;
      case 'ArrowRight':
        if (selectedIndex < media.length - 1) {
          setSelectedIndex(prev => prev + 1);
          setSelectedMedia(media[selectedIndex + 1]);
        }
        break;
      case 'Escape':
        handleClose();
        break;
    }
  };

  React.useEffect(() => {
    if (selectedMedia) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedMedia, selectedIndex]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => handleSelectMedia(item)}
          >
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={`Photo by ${item.memberName}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-75" />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                <p className="text-sm font-medium truncate">{item.memberName}</p>
                <p className="text-xs opacity-75">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedMedia && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              {/* Navigation Controls */}
              {selectedIndex > 0 && (
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              
              {selectedIndex < media.length - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                aria-label="Close preview"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image */}
              <motion.img
                key={selectedMedia.url}
                src={selectedMedia.url}
                alt={`Photo by ${selectedMedia.memberName}`}
                className="w-full h-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />

              {/* Image Info */}
              <div className="absolute bottom-4 left-4 text-white bg-black/50 p-3 rounded-lg backdrop-blur-sm">
                <p className="text-lg font-medium">{selectedMedia.memberName}</p>
                <p className="text-sm opacity-75">
                  {new Date(selectedMedia.date).toLocaleDateString()}
                </p>
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 text-white bg-black/50 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {selectedIndex + 1} / {media.length}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MediaGrid;