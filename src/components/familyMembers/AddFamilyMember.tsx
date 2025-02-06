import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FamilyMember } from '../../types/FamilyTree';

interface AddFamilyMemberProps {
  onAdd: (member: Omit<FamilyMember, 'id'>) => void;
  onClose: () => void;
}

const AddFamilyMember: React.FC<AddFamilyMemberProps> = ({ onAdd, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [type, setType] = useState<FamilyMember['type']>('blood');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: Omit<FamilyMember, 'id'> = {
      firstName,
      lastName,
      birthDate,
      type,
      relationships: [],
      events: [],
      photos: [],
    };
    onAdd(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Family Member</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Birth Date</label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Member Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as FamilyMember['type'])}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="blood">Blood</option>
              <option value="adopted">Adopted</option>
              <option value="step">Step</option>
              <option value="foster">Foster</option>
              <option value="spouse">Spouse</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFamilyMember;