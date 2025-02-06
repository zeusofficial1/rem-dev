import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, MapPin, Heart, Users, ChevronRight, Mail, Phone } from 'lucide-react';

interface FamilyMemberListProps {
  members: FamilyMember[];
}

const FamilyMemberList: React.FC<FamilyMemberListProps> = ({ members }) => {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'blood':
        return 'bg-red-50 text-red-600 ring-red-500/10';
      case 'spouse':
        return 'bg-blue-50 text-blue-600 ring-blue-500/10';
      case 'adopted':
        return 'bg-purple-50 text-purple-600 ring-purple-500/10';
      case 'step':
        return 'bg-green-50 text-green-600 ring-green-500/10';
      case 'foster':
        return 'bg-orange-50 text-orange-600 ring-orange-500/10';
      default:
        return 'bg-gray-50 text-gray-600 ring-gray-500/10';
    }
  };

  if (members.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No family members yet</h3>
        <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
          Get started by adding your first family member using the button above.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {members.map((member) => (
        <li key={member.id} className="relative group">
          <Link 
            to={`/member/${member.id}`}
            className="block hover:bg-gray-50 transition-all duration-200"
          >
            <div className="flex items-center px-6 py-5">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0">
                {member.photo ? (
                  <img 
                    className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-sm" 
                    src={member.photo} 
                    alt={`${member.firstName} ${member.lastName}`}
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ring-4 ring-white shadow-sm">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <span 
                  className={`absolute -bottom-1 right-0 px-2.5 py-0.5 rounded-full text-xs font-medium ring-2 ring-white ${getTypeStyles(member.type)}`}
                >
                  {member.type}
                </span>
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0 ml-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {member.firstName} {member.lastName}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-4">
                      {member.birthDate && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{member.birthDate}</span>
                        </div>
                      )}
                      {member.livingIn && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{member.livingIn}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <Heart className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>{member.relationships?.length || 0} connections</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-3">
                    {member.email && (
                      <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                        <Mail className="w-5 h-5" />
                      </button>
                    )}
                    {member.phone && (
                      <button className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-full transition-colors">
                        <Phone className="w-5 h-5" />
                      </button>
                    )}
                    <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default FamilyMemberList;