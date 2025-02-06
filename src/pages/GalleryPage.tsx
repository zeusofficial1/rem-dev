import React, { useState, useEffect } from 'react';
import { Image, Upload, Plus, Search } from 'lucide-react';
import { useFamilyTree } from '../contexts/FamilyTreeContext';
import { FamilyMember } from '../types/FamilyTree';
import MediaUploadModal from '../components/gallery/MediaUploadModal';
import MediaGrid from '../components/gallery/MediaGrid';
import MediaFilters from '../components/gallery/MediaFilters';
import toast from 'react-hot-toast';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  memberName: string;
  memberId: string;
  date: string;
}

const GalleryPage: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'images' | 'videos'>('all');
  const { getAllFamilyMembers, updateMember, currentTree } = useFamilyTree();

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const allMembers = await getAllFamilyMembers();
        setMembers(allMembers);
      } catch (error) {
        console.error('Failed to load family members:', error);
        toast.error('Failed to load family members');
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [getAllFamilyMembers]);

  const handleUploadComplete = async (urls: string[]) => {
    try {
      if (!currentTree) {
        toast.error('No family tree selected');
        return;
      }

      // Update all members with the new photos
      const updatedMembers = members.map(member => ({
        ...member,
        photos: [...(member.photos || []), ...urls]
      }));

      // Update each member in the database
      await Promise.all(
        updatedMembers.map(member =>
          updateMember(currentTree.id, member.id, { photos: member.photos })
        )
      );

      // Update local state
      setMembers(updatedMembers);
      setIsUploadModalOpen(false);
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Failed to update member photos:', error);
      toast.error('Failed to update photos');
    }
  };

  const allMedia: MediaItem[] = members.flatMap(member => 
    member.photos?.map((photo, index) => ({
      id: `${member.id}-${index}`,
      url: photo,
      type: 'image',
      memberName: `${member.firstName} ${member.lastName}`,
      memberId: member.id,
      date: new Date().toISOString(),
    })) || []
  );

  const filteredMedia = allMedia.filter(item => {
    const matchesSearch = item.memberName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || activeFilter === item.type;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Family Gallery</h1>
            <p className="text-gray-600">
              {filteredMedia.length} {filteredMedia.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Media
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-grow md:max-w-md">
            <input
              type="text"
              placeholder="Search by family member..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <MediaFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Media Grid */}
        {filteredMedia.length === 0 ? (
          <div className="text-center py-16">
            <Image className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No media found</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Start adding photos and videos to create your family gallery'}
            </p>
          </div>
        ) : (
          <MediaGrid media={filteredMedia} />
        )}
      </div>

      <MediaUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
};

export default GalleryPage;