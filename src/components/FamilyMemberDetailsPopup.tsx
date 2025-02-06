import React, { useState, useEffect } from 'react';
import { FamilyMember } from '../types/FamilyMember';
import { X, Edit, Trash, Save, Upload } from 'lucide-react';

interface FamilyMemberDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember | null;
  onUpdate: (updatedMember: FamilyMember) => void;
  onRemove: (id: string) => void;
}

const FamilyMemberDetailsPopup: React.FC<FamilyMemberDetailsPopupProps> = ({
  isOpen,
  onClose,
  member,
  onUpdate,
  onRemove,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState<FamilyMember | null>(null);

  useEffect(() => {
    setEditedMember(member);
    setIsEditing(false);
  }, [member]);

  if (!isOpen || !member) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedMember(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedMember(prev => prev ? { ...prev, photo: reader.result as string } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (editedMember) {
      onUpdate(editedMember);
      setIsEditing(false);
    }
  };

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this family member?')) {
      onRemove(member.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Family Member' : 'Family Member Details'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {isEditing ? (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Photo</label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer bg-gray-50 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <Upload className="w-5 h-5 inline-block mr-2" />
                    Upload Photo
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={editedMember?.firstName || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={editedMember?.lastName || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
                />
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                {editedMember?.photo ? (
                  <img
                    src={editedMember.photo}
                    alt={editedMember.firstName}
                    className="w-32 h-32 rounded-full mx-auto object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-medium">{editedMember?.firstName} {editedMember?.lastName}</h3>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                <Save className="w-5 h-5 mr-2 inline-block" />
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                <Edit className="w-5 h-5 mr-2 inline-block" />
                Edit
              </button>
            )}
            <button
              onClick={handleRemove}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              <Trash className="w-5 h-5 mr-2 inline-block" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyMemberDetailsPopup;