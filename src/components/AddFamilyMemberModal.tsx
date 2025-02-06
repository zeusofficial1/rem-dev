import React, { useState } from 'react';
import { X, Upload, User } from 'lucide-react';
import { FamilyMember } from '../types/FamilyTree';
import { useAuth } from '../contexts/AuthContext';

interface AddFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: Omit<FamilyMember, 'id'>) => void;
  existingMembers: FamilyMember[];
}

const AddFamilyMemberModal: React.FC<AddFamilyMemberModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingMembers,
}) => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [type, setType] = useState<FamilyMember['type']>('blood');
  const [photo, setPhoto] = useState<string | null>(null);
  const [relationshipType, setRelationshipType] = useState<'none' | 'spouse'>('none');
  const [relatedMemberId, setRelatedMemberId] = useState('');
  const [livingIn, setLivingIn] = useState('');
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: Omit<FamilyMember, 'id'> = {
      firstName: isCurrentUser && user ? user.displayName?.split(' ')[0] || firstName : firstName,
      lastName: isCurrentUser && user ? user.displayName?.split(' ')[1] || lastName : lastName,
      birthDate,
      gender,
      type,
      photo: isCurrentUser && user?.photoURL ? user.photoURL : photo,
      relationships: type === 'spouse' && relatedMemberId ? [
        { type: 'spouse', personId: relatedMemberId }
      ] : [],
      position: { x: 0, y: 0 },
      livingIn,
      events: [],
      photos: [],
      userId: isCurrentUser ? user?.uid : undefined,
      isCurrentUser: isCurrentUser,
    };

    // If this is a spouse, also update the related member's relationships
    if (type === 'spouse' && relatedMemberId) {
      const relatedMember = existingMembers.find(m => m.id === relatedMemberId);
      if (relatedMember) {
        relatedMember.relationships = [
          ...(relatedMember.relationships || []),
          { type: 'spouse', personId: 'PLACEHOLDER_ID' } // Will be replaced with actual ID after creation
        ];
      }
    }

    onAdd(newMember);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setBirthDate('');
    setGender('male');
    setType('blood');
    setPhoto(null);
    setRelationshipType('none');
    setRelatedMemberId('');
    setLivingIn('');
    setIsCurrentUser(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Family Member</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {user && !isCurrentUser && (
            <div className="mb-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={isCurrentUser}
                  onChange={(e) => setIsCurrentUser(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-[#ff853f] rounded border-gray-300 focus:ring-[#ff853f]"
                />
                <span className="text-sm font-medium text-gray-700">This is me</span>
              </label>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Member Type</label>
              <select
                id="type"
                value={type}
                onChange={(e) => {
                  setType(e.target.value as FamilyMember['type']);
                  if (e.target.value === 'spouse') {
                    setRelationshipType('spouse');
                  } else {
                    setRelationshipType('none');
                    setRelatedMemberId('');
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff853f] focus:ring focus:ring-[#ff853f] focus:ring-opacity-50"
              >
                <option value="blood">Blood Relative</option>
                <option value="adopted">Adopted</option>
                <option value="step">Step-Family</option>
                <option value="foster">Foster Family</option>
                <option value="spouse">Spouse</option>
                <option value="pet">Pet</option>
                <option value="other">Other</option>
              </select>
            </div>

            {!isCurrentUser && (
              <>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff853f] focus:ring focus:ring-[#ff853f] focus:ring-opacity-50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff853f] focus:ring focus:ring-[#ff853f] focus:ring-opacity-50"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Birth Date</label>
              <input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff853f] focus:ring focus:ring-[#ff853f] focus:ring-opacity-50"
              />
            </div>

            {type === 'spouse' && existingMembers.length > 0 && (
              <div>
                <label htmlFor="spouseOf" className="block text-sm font-medium text-gray-700">Spouse Of</label>
                <select
                  id="spouseOf"
                  value={relatedMemberId}
                  onChange={(e) => {
                    setRelatedMemberId(e.target.value);
                    setRelationshipType('spouse');
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff853f] focus:ring focus:ring-[#ff853f] focus:ring-opacity-50"
                  required
                >
                  <option value="">Select a family member</option>
                  {existingMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff853f] focus:ring focus:ring-[#ff853f] focus:ring-opacity-50"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="livingIn" className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                id="livingIn"
                value={livingIn}
                onChange={(e) => setLivingIn(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff853f] focus:ring focus:ring-[#ff853f] focus:ring-opacity-50"
                placeholder="e.g., New York, USA"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#ff853f] text-white px-4 py-2 rounded-md hover:bg-[#e6753a] transition-colors"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFamilyMemberModal;