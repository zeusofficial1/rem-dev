import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, ChevronRight, ChevronLeft, Filter } from 'lucide-react';
import { FamilyMember } from '../types/FamilyMember';
import { motion, AnimatePresence } from 'framer-motion';

interface FamilyMembersSidebarProps {
  members: FamilyMember[];
  onMemberSelect: (member: FamilyMember) => void;
}

const FamilyMembersSidebar: React.FC<FamilyMembersSidebarProps> = ({ members, onMemberSelect }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'blood' | 'spouse' | 'adopted'>('all');

  const filteredMembers = members.filter(member => {
    const matchesSearch = `${member.firstName} ${member.lastName}`.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || member.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div
      className={`fixed right-0 top-0 h-screen bg-white border-l border-gray-200 shadow-lg transition-all duration-300 z-20 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
      >
        {isCollapsed ? (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        )}
      </button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col p-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Family Members
              </h2>
              <span className="text-sm text-gray-500">
                {filteredMembers.length} members
              </span>
            </div>

            <div className="space-y-4 mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c15329] focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                  className="flex-1 border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#c15329] focus:border-transparent"
                >
                  <option value="all">All Members</option>
                  <option value="blood">Blood Relatives</option>
                  <option value="spouse">Spouses</option>
                  <option value="adopted">Adopted</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {filteredMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <button
                      onClick={() => onMemberSelect(member)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          {member.photo ? (
                            <img
                              src={member.photo}
                              alt={member.firstName}
                              className="w-full h-full rounded-lg object-cover"
                            />
                          ) : (
                            <Users className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#c15329]">
                              {member.firstName} {member.lastName}
                            </p>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#c15329]" />
                          </div>
                          <p className="text-xs text-gray-500 capitalize">{member.type}</p>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}

                {filteredMembers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      {searchTerm
                        ? 'No members found'
                        : 'No family members added yet'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FamilyMembersSidebar;