import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, MapPin, Calendar, ChevronRight, Users, Filter, SlidersHorizontal } from 'lucide-react';
import { useFamilyTree } from '../contexts/FamilyTreeContext';
import { usePermissions } from '../contexts/PermissionContext';
import { FamilyMember } from '../types/FamilyMember';
import { motion, AnimatePresence } from 'framer-motion';

const SearchDirectoryPage: React.FC = () => {
  const { getAllFamilyMembers } = useFamilyTree();
  const { isMemberVisible } = usePermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'blood' | 'adopted' | 'spouse' | 'pet'>('all');

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const allMembers = await getAllFamilyMembers();
        setMembers(allMembers);
      } catch (error) {
        console.error('Failed to load family members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [getAllFamilyMembers]);

  const isConnectedMember = (memberId: string, treeId: string) => {
    return isMemberVisible(memberId, treeId);
  };

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
            <h1 className="text-3xl font-bold mb-2">Family Directory</h1>
            <p className="text-gray-600">
              {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'} found
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-50 rounded-lg transition-colors">
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Advanced Search
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#ff853f] focus:border-transparent transition-all duration-200"
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
                    ? 'bg-[#ff853f] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff853f] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading directory...</p>
          </div>
        ) : filteredMembers.length > 0 ? (
          <AnimatePresence>
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="group"
                >
                  <Link
                    to={`/member/${member.id}`}
                    className={`block bg-white rounded-xl border transition-all duration-200 p-4 ${
                      member.treeId && isConnectedMember(member.id, member.treeId)
                        ? 'border-[#ff853f]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.firstName}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#ff853f]">
                              {member.firstName} {member.lastName}
                            </h3>
                            <div className="mt-1 flex flex-wrap gap-4">
                              {member.birthDate && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar className="w-4 h-4 mr-1.5" />
                                  <span>{member.birthDate}</span>
                                </div>
                              )}
                              {member.livingIn && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <MapPin className="w-4 h-4 mr-1.5" />
                                  <span>{member.livingIn}</span>
                                </div>
                              )}
                              <div className="flex items-center text-sm text-gray-500">
                                <Users className="w-4 h-4 mr-1.5" />
                                <span>{member.relationships?.length || 0} connections</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#ff853f] transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No results found</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Start adding family members to build your directory'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDirectoryPage;