import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFamilyTree } from '../contexts/FamilyTreeContext';
import RelationshipsList from './relationships/RelationshipsList';
import { User, Mail, Phone, MapPin, Calendar, Heart, Users, Image as ImageIcon, Edit2, Dog } from 'lucide-react';
import toast from 'react-hot-toast';

const FamilyMemberProfile: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { getAllFamilyMembers, updateMember } = useFamilyTree();
  const [activeTab, setActiveTab] = useState<'info' | 'relationships' | 'gallery'>('info');
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [allMembers, setAllMembers] = useState<FamilyMember[]>([]);

  React.useEffect(() => {
    const loadMember = async () => {
      if (!memberId) return;
      
      try {
        const members = await getAllFamilyMembers();
        const foundMember = members.find(m => m.id === memberId);
        if (foundMember) {
          setMember(foundMember);
          setAllMembers(members);
        } else {
          toast.error('Member not found');
          navigate('/family-members');
        }
      } catch (error) {
        console.error('Failed to load member:', error);
        toast.error('Failed to load member details');
      }
    };

    loadMember();
  }, [memberId, getAllFamilyMembers, navigate]);

  const handleAddRelationship = async (relatedMemberId: string, type: string) => {
    if (!member) return;

    try {
      const updatedRelationships = [
        ...(member.relationships || []),
        { type, personId: relatedMemberId }
      ];

      await updateMember(member.id, { relationships: updatedRelationships });
      setMember({ ...member, relationships: updatedRelationships });
      toast.success('Relationship added successfully');
    } catch (error) {
      console.error('Failed to add relationship:', error);
      toast.error('Failed to add relationship');
    }
  };

  const handleRemoveRelationship = async (relatedMemberId: string) => {
    if (!member) return;

    try {
      const updatedRelationships = member.relationships?.filter(
        rel => rel.personId !== relatedMemberId
      ) || [];

      await updateMember(member.id, { relationships: updatedRelationships });
      setMember({ ...member, relationships: updatedRelationships });
      toast.success('Relationship removed successfully');
    } catch (error) {
      console.error('Failed to remove relationship:', error);
      toast.error('Failed to remove relationship');
    }
  };

  if (!member) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c15329]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold">
                {member.firstName} {member.lastName}
              </h1>
              <div className="flex items-center mt-2 text-gray-600">
                <Heart className="w-5 h-5 mr-2" />
                <span className="capitalize">{member.type}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-[#c15329] text-[#c15329]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Information
            </button>
            <button
              onClick={() => setActiveTab('relationships')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'relationships'
                  ? 'border-[#c15329] text-[#c15329]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Relationships
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'gallery'
                  ? 'border-[#c15329] text-[#c15329]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gallery
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="space-y-4">
                  {member.birthDate && (
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Birth Date</p>
                        <p className="font-medium">{member.birthDate}</p>
                      </div>
                    </div>
                  )}
                  {member.livingIn && (
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{member.livingIn}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {member.email && (
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <span>{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {member.bio && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Biography</h3>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'relationships' && (
          <RelationshipsList
            member={member}
            allMembers={allMembers}
            onAddRelationship={handleAddRelationship}
            onRemoveRelationship={handleRemoveRelationship}
          />
        )}

        {activeTab === 'gallery' && (
          <div>
            {member.photos && member.photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {member.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                  >
                    <img
                      src={photo}
                      alt={`${member.firstName}'s photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No photos available</h3>
                <p className="mt-2 text-gray-500">
                  Start adding photos to create a gallery
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyMemberProfile;