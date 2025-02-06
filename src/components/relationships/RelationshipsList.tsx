import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Plus, Heart, UserPlus, ChevronRight, Filter } from 'lucide-react';
import { FamilyMember } from '../../types/FamilyMember';

interface RelationshipsListProps {
  member: FamilyMember;
  allMembers: FamilyMember[];
  onAddRelationship: (memberId: string, type: string) => void;
  onRemoveRelationship: (memberId: string) => void;
}

type RelationshipCategory = {
  title: string;
  types: string[];
};

const categories: RelationshipCategory[] = [
  {
    title: 'Immediate Family',
    types: ['parent', 'child', 'sibling', 'spouse']
  },
  {
    title: 'Extended Family',
    types: ['grandparent', 'grandchild', 'aunt', 'uncle', 'cousin']
  },
  {
    title: 'In-Laws',
    types: ['parent-in-law', 'sibling-in-law', 'child-in-law']
  }
];

const RelationshipsList: React.FC<RelationshipsListProps> = ({
  member,
  allMembers,
  onAddRelationship,
  onRemoveRelationship
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingRelationship, setIsAddingRelationship] = useState(false);
  const [newRelationType, setNewRelationType] = useState('');
  const [newRelationMemberId, setNewRelationMemberId] = useState('');

  const getRelationshipsByType = (type: string) => {
    return member.relationships?.filter(rel => rel.type === type) || [];
  };

  const getMemberById = (id: string) => {
    return allMembers.find(m => m.id === id);
  };

  const handleAddRelationship = () => {
    if (newRelationType && newRelationMemberId) {
      onAddRelationship(newRelationMemberId, newRelationType);
      setIsAddingRelationship(false);
      setNewRelationType('');
      setNewRelationMemberId('');
    }
  };

  const filteredCategories = categories.filter(category => {
    if (selectedCategory !== 'all' && category.title !== selectedCategory) {
      return false;
    }

    const hasRelationships = category.types.some(type => {
      const relationships = getRelationshipsByType(type);
      if (searchTerm) {
        return relationships.some(rel => {
          const relatedMember = getMemberById(rel.personId);
          return relatedMember && 
            `${relatedMember.firstName} ${relatedMember.lastName}`.toLowerCase()
              .includes(searchTerm.toLowerCase());
        });
      }
      return relationships.length > 0;
    });

    return hasRelationships;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search relationships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c15329] focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#c15329] focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.title} value={cat.title}>{cat.title}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setIsAddingRelationship(true)}
          className="inline-flex items-center px-4 py-2 bg-[#c15329] text-white rounded-lg hover:bg-[#a84723] transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Relationship
        </button>
      </div>

      {/* Relationships List */}
      <div className="space-y-8">
        {filteredCategories.map(category => (
          <div key={category.title}>
            <h3 className="text-lg font-semibold mb-4">{category.title}</h3>
            <div className="space-y-3">
              {category.types.map(type => {
                const relationships = getRelationshipsByType(type);
                if (relationships.length === 0) return null;

                return relationships.map(rel => {
                  const relatedMember = getMemberById(rel.personId);
                  if (!relatedMember) return null;

                  if (searchTerm && !`${relatedMember.firstName} ${relatedMember.lastName}`
                    .toLowerCase().includes(searchTerm.toLowerCase())) {
                    return null;
                  }

                  return (
                    <motion.div
                      key={rel.personId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        {relatedMember.photo ? (
                          <img
                            src={relatedMember.photo}
                            alt={relatedMember.firstName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="ml-4">
                          <h4 className="font-medium">
                            {relatedMember.firstName} {relatedMember.lastName}
                          </h4>
                          <p className="text-sm text-gray-500 capitalize">{type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onRemoveRelationship(rel.personId)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                        <Link
                          to={`/member/${rel.personId}`}
                          className="p-2 text-gray-400 hover:text-[#c15329] rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                });
              })}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No relationships found</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Start adding family relationships using the button above'}
            </p>
          </div>
        )}
      </div>

      {/* Add Relationship Modal */}
      {isAddingRelationship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-6">Add New Relationship</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship Type
                </label>
                <select
                  value={newRelationType}
                  onChange={(e) => setNewRelationType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#c15329] focus:border-[#c15329]"
                >
                  <option value="">Select type...</option>
                  {categories.map(category => (
                    <optgroup key={category.title} label={category.title}>
                      {category.types.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Family Member
                </label>
                <select
                  value={newRelationMemberId}
                  onChange={(e) => setNewRelationMemberId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#c15329] focus:border-[#c15329]"
                >
                  <option value="">Select member...</option>
                  {allMembers
                    .filter(m => m.id !== member.id)
                    .map(m => (
                      <option key={m.id} value={m.id}>
                        {m.firstName} {m.lastName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsAddingRelationship(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRelationship}
                  disabled={!newRelationType || !newRelationMemberId}
                  className="px-4 py-2 bg-[#c15329] text-white rounded-md hover:bg-[#a84723] transition-colors disabled:opacity-50"
                >
                  Add Relationship
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelationshipsList;