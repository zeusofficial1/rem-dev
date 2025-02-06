import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, MapPin, Link as LinkIcon, Heart, Eye, Dog } from 'lucide-react';
import { FamilyMember } from '../../types/FamilyMember';
import { useDraggable } from '@dnd-kit/core';

interface FamilyMemberCardProps {
  member: FamilyMember;
  onStartConnection?: (memberId: string) => void;
  isConnecting?: boolean;
  isStartMember?: boolean;
  onEndConnection?: (memberId: string) => void;
  onPreviewClick: (member: FamilyMember) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({
  member,
  onStartConnection,
  isConnecting,
  isStartMember,
  onEndConnection,
  onPreviewClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: member.id,
    data: member,
  });

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging) {
      navigate(`/member/${member.id}`);
    }
  };

  const handleConnectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConnecting && onEndConnection) {
      onEndConnection(member.id);
    } else if (onStartConnection) {
      onStartConnection(member.id);
    }
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreviewClick(member);
  };

  const getTypeIcon = () => {
    if (member.type === 'pet') {
      return <Dog className="w-8 h-8 text-gray-400" />;
    }
    return <User className="w-8 h-8 text-gray-400" />;
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`
        absolute bg-white rounded-xl shadow-lg hover:shadow-xl 
        transition-shadow duration-200 cursor-grab select-none
        ${isStartMember ? 'ring-2 ring-[#ff853f] ring-offset-2' : ''}
        ${isDragging ? 'cursor-grabbing shadow-2xl' : ''}
      `}
      style={{
        width: '320px',
        left: `${member.position.x}px`,
        top: `${member.position.y}px`,
        touchAction: 'none',
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.2s ease-in-out',
        zIndex: isDragging ? 1000 : 1,
        ...style,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.firstName}
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {getTypeIcon()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {member.firstName} {member.lastName}
            </h3>
            <div className="mt-1 space-y-1">
              {member.birthDate && (
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{member.birthDate}</span>
                </div>
              )}
              {member.type === 'pet' ? (
                <div className="flex items-center text-sm text-gray-500">
                  <Dog className="w-4 h-4 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{member.species || 'Pet'} {member.breed ? `- ${member.breed}` : ''}</span>
                </div>
              ) : (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{member.livingIn || 'Unknown location'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <button
            onClick={handleViewProfile}
            className="flex-1 px-3 py-1.5 text-sm font-medium text-center rounded-md bg-gray-50 text-gray-900 hover:bg-gray-100"
          >
            View Profile
          </button>
          {onStartConnection && (
            <button
              onClick={handleConnectionClick}
              className={`
                flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md
                ${isConnecting 
                  ? isStartMember
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-[#ff853f] text-white hover:bg-[#e6753a]'
                  : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <LinkIcon className="w-4 h-4 mr-1.5" />
              {isConnecting ? (isStartMember ? 'Cancel' : 'Connect To') : 'Connect'}
            </button>
          )}
          <button
            onClick={handlePreviewClick}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-50 text-gray-900 hover:bg-gray-100"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isStartMember && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-0.5 rounded-full text-xs font-medium shadow-lg">
          Select member to connect
        </div>
      )}
    </div>
  );
};

export default FamilyMemberCard;