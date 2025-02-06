import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, MapPin, Calendar, ChevronRight, Users, Filter, Plus } from 'lucide-react';
import { useFamilyTree } from '../contexts/FamilyTreeContext';
import { usePermissions } from '../contexts/PermissionContext';
import { FamilyMember } from '../types/FamilyMember';
import AddFamilyMember from '../components/familyMembers/AddFamilyMember';
import FamilyMemberList from '../components/familyMembers/FamilyMemberList';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const FamilyMembersPage: React.FC = () => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'blood' | 'adopted' | 'spouse' | 'pet'>('all');
  const { getAllFamilyMembers, currentTree } = useFamilyTree();

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const allMembers = await getAllFamilyMembers();
        // If we have a current tree, filter members for that tree
        const relevantMembers = currentTree 
          ? allMembers.filter(member => member.treeIds?.includes(currentTree.id))
          : allMembers;
        setMembers(relevantMembers);
      } catch (error) {
        console.error('Failed to load family members:', error);
        toast.error('Failed to load family members');
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [getAllFamilyMembers, currentTree]);

  const filteredMembers = members.filter(member => {
    const matchesSearch = `${member.firstName} ${member.lastName} ${member.livingIn || ''}`.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || member.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { value: 'all', label: 'All Members' },
    { value: 'blood', label: 'Blood Relatives' },
    { value: 'adopted', label: 'Adopted' },
    { value: 'spouse', label: 'Spouses' },
    { value: 'pet', label: 'Pets' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Family Members</h1>
            <p className="text-gray-600">
              {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'} in your family
            </p>
          </div>
          <button
            onClick={() => setIsAddMemberOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-[#c15329] text-white rounded-lg hover:bg-[#a84723] transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Member
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#c15329] focus:border-transparent transition-all duration-200"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value as typeof activeFilter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === option.value
                    ? 'bg-[#c15329] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Members List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c15329] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading family members...</p>
          </div>
        ) : (
          <FamilyMemberList members={filteredMembers} />
        )}
      </div>

      {/* Add Member Modal */}
      {isAddMemberOpen && (
        <AddFamilyMember
          onAdd={async (newMember) => {
            try {
              if (!currentTree) {
                toast.error('Please select a family tree first');
                return;
              }
              await addMember(currentTree.id, newMember);
              setIsAddMemberOpen(false);
              // Refresh the members list
              const updatedMembers = await getAllFamilyMembers();
              setMembers(updatedMembers.filter(m => m.treeIds?.includes(currentTree.id)));
              toast.success('Family member added successfully');
            } catch (error) {
              console.error('Failed to add family member:', error);
              toast.error('Failed to add family member');
            }
          }}
          onClose={() => setIsAddMemberOpen(false)}
        />
      )}
    </div>
  );
};

export default FamilyMembersPage;