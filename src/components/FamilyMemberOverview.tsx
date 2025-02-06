import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FamilyMember } from '../types/FamilyMember';
import { FamilyTree } from '../types/FamilyTree';
import { Edit, MapPin, Flag, User, FileText, Calendar, Users, Phone, Mail, Cake, X } from 'lucide-react';

interface FamilyMemberOverviewProps {
  trees: FamilyTree[];
}

const FamilyMemberOverview: React.FC<FamilyMemberOverviewProps> = ({ trees }) => {
  const { memberId } = useParams<{ memberId: string }>();
  const [isEditMode, setIsEditMode] = useState(false);
  const member = trees.flatMap(tree => tree.members).find(m => m.id === memberId);

  if (!member) {
    return <div className="text-center mt-8">Member not found</div>;
  }

  const getRelatives = (type: 'children' | 'parents' | 'siblings' | 'spouses') => {
    const tree = trees.find(t => t.members.some(m => m.id === memberId));
    if (!tree) return [];

    switch (type) {
      case 'children':
        return tree.members.filter(m => member.childrenIds?.includes(m.id) ?? false);
      case 'parents':
        return tree.members.filter(m => member.parentIds?.includes(m.id) ?? false);
      case 'siblings':
        return tree.members.filter(m => 
          m.id !== member.id && 
          ((m.parentIds?.some(pid => member.parentIds?.includes(pid) ?? false)) ?? false)
        );
      case 'spouses':
        return tree.members.filter(m => member.spouseIds?.includes(m.id) ?? false);
      default:
        return [];
    }
  };

  const children = getRelatives('children');
  const parents = getRelatives('parents');
  const siblings = getRelatives('siblings');
  const spouses = getRelatives('spouses');

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const renderRelativesList = (relatives: FamilyMember[], relationshipType: string) => (
    <div className="mb-4">
      <h3 className="text-xl font-medium mb-2">{relationshipType}</h3>
      {relatives.length > 0 ? (
        <ul className="list-disc list-inside">
          {relatives.map(relative => (
            <li key={relative.id}>
              <Link to={`/member/${relative.id}`} className="text-blue-600 hover:underline">
                {relative.firstName} {relative.lastName}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No {relationshipType.toLowerCase()} found</p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="relative mb-8">
        <img
          src={member.profilePicture || "https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"}
          alt="Cover"
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <h1 className="text-4xl font-bold text-white">{member.firstName} {member.lastName}</h1>
          <p className="text-xl text-gray-300">{member.birthDate} - {member.deathDate || 'Present'}</p>
        </div>
        <button
          onClick={toggleEditMode}
          className="absolute top-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-full flex items-center shadow-md hover:bg-gray-100"
        >
          {isEditMode ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel Edit
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Family Member
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Family Relations</h2>
          {renderRelativesList(parents, "Parents")}
          {renderRelativesList(siblings, "Siblings")}
          {renderRelativesList(spouses, "Spouses")}
          {renderRelativesList(children, "Children")}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Profile Info</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-gray-500" />
              <span>Living in: {member.livingIn || 'Unknown'}</span>
            </div>
            <div className="flex items-center">
              <Flag className="w-5 h-5 mr-2 text-gray-500" />
              <span>Nationality: {member.nationality || 'Unknown'}</span>
            </div>
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 text-gray-500" />
              <span>Gender: {member.gender}</span>
            </div>
            <div className="flex items-center">
              <Cake className="w-5 h-5 mr-2 text-gray-500" />
              <span>Birth Date: {member.birthDate || 'Unknown'}</span>
            </div>
            {member.deathDate && (
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                <span>Death Date: {member.deathDate}</span>
              </div>
            )}
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-gray-500" />
              <span>Family Member Type: {member.type}</span>
            </div>
            {member.phone && (
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-gray-500" />
                <span>Phone: {member.phone}</span>
              </div>
            )}
            {member.email && (
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-gray-500" />
                <span>Email: {member.email}</span>
              </div>
            )}
            {member.bio && (
              <div className="flex items-start">
                <FileText className="w-5 h-5 mr-2 text-gray-500 mt-1" />
                <p>{member.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {member.photos && member.photos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Photo Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {member.photos.map((photo, index) => (
              <img key={index} src={photo} alt={`${member.firstName} ${member.lastName}`} className="w-full h-40 object-cover rounded-lg" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyMemberOverview;