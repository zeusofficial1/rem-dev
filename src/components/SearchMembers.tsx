import React, { useState } from 'react';
import { FamilyMember } from '../types/FamilyMember';
import { FamilyTree } from '../types/FamilyTree';
import { Search } from 'lucide-react';

interface SearchMembersProps {
  trees: FamilyTree[];
  onSelectMember: (treeId: string, memberId: string) => void;
}

const SearchMembers: React.FC<SearchMembersProps> = ({ trees, onSelectMember }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const allMembers = trees.flatMap(tree => tree.members);

  const filteredMembers = allMembers.filter(member =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search family members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md pr-10"
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" />
      </div>
      {searchTerm && filteredMembers.length > 0 && (
        <ul className="mt-2 bg-white border rounded-md shadow-lg">
          {filteredMembers.map(member => (
            <li
              key={member.id}
              onClick={() => {
                const tree = trees.find(t => t.members.some(m => m.id === member.id));
                if (tree) {
                  onSelectMember(tree.id, member.id);
                }
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {member.firstName} {member.lastName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchMembers;