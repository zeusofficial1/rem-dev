import React, { useState } from 'react';
import { FamilyMember } from '../types/FamilyMember';
import { X, Upload } from 'lucide-react';

interface AddMemberFormProps {
  onAdd: (member: FamilyMember) => Promise<void>;
  onCancel: () => void;
  relatedMemberId: string | null;
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({ onAdd, onCancel, relatedMemberId }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [relationship, setRelationship] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      firstName,
      lastName,
      birthDate,
      placeOfBirth,
      photo,
      position: { x: 0, y: 0 },
      type: 'blood', // Default type, can be adjusted based on the relationship
    };

    if (relatedMemberId) {
      switch (relationship) {
        case 'child':
          newMember.parentIds = [relatedMemberId];
          break;
        case 'parent':
          newMember.childrenIds = [relatedMemberId];
          break;
        case 'spouse':
          newMember.spouseIds = [relatedMemberId];
          break;
        case 'sibling':
          newMember.siblingIds = [relatedMemberId];
          break;
      }
    }

    try {
      await onAdd(newMember);
      onCancel();
    } catch (error) {
      setError('Failed to add family member. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (rest of the component code remains the same)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Family Member</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... (form fields remain the same) */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberForm;