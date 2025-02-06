import React from 'react';
import { Link } from 'react-router-dom';
import { FamilyMember } from '../types/FamilyMember';
import { User } from 'lucide-react';

interface FamilyMemberListProps {
  members: FamilyMember[];
}

const FamilyMemberList: React.FC<FamilyMemberListProps> = ({ members }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Family Members</h2>
      <ul>
        {members.map((member) => (
          <li
            key={member.id}
            className="flex items-center py-2 px-4 hover:bg-gray-100"
          >
            <Link to={`/member/${member.id}`} className="flex items-center w-full">
              <User className="w-5 h-5 mr-2 text-gray-500" />
              <span>{member.firstName} {member.lastName}</span>
              <span className="ml-auto text-sm text-gray-500">{member.type}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FamilyMemberList;