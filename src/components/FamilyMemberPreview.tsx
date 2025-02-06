import React from 'react';
import { FamilyMember } from '../types/FamilyMember';
import { X, User, Calendar, Users, MapPin, FileText } from 'lucide-react';

interface FamilyMemberPreviewProps {
  member: FamilyMember | null;
  onClose: () => void;
}

const FamilyMemberPreview: React.FC<FamilyMemberPreviewProps> = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-6 overflow-y-auto z-50">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <X size={24} />
      </button>
      <div className="mb-6 text-center">
        {member.profilePicture ? (
          <img src={member.profilePicture} alt={`${member.firstName} ${member.lastName}`} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
            <User size={48} className="text-gray-400" />
          </div>
        )}
        <h2 className="text-2xl font-bold">{member.firstName} {member.lastName}</h2>
        <p className="text-gray-600">{member.type}</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-gray-500" />
          <span>Born: {member.birthDate || 'Unknown'}</span>
        </div>
        {member.deathDate && (
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-gray-500" />
            <span>Died: {member.deathDate}</span>
          </div>
        )}
        <div className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-gray-500" />
          <span>{member.gender}</span>
        </div>
        {member.bio && (
          <div className="flex items-start">
            <FileText className="w-5 h-5 mr-2 text-gray-500 mt-1" />
            <p className="text-sm">{member.bio}</p>
          </div>
        )}
        {member.events.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Events</h3>
            <ul className="space-y-2">
              {member.events.map((event, index) => (
                <li key={index} className="flex items-start">
                  <MapPin className="w-5 h-5 mr-2 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">{event.type}</p>
                    <p className="text-sm text-gray-600">{event.date} - {event.place}</p>
                    <p className="text-sm">{event.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyMemberPreview;