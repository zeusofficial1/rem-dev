import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Pet } from '../types/FamilyMember';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (pet: Omit<Pet, 'id'>) => void;
}

const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<Pet['type']>('dog');
  const [birthDate, setBirthDate] = useState('');
  const [photo, setPhoto] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      type,
      birthDate,
      photo,
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setType('dog');
    setBirthDate('');
    setPhoto(undefined);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Pet</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Pet Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Pet Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as Pet['type'])}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Birth Date</label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Photo</label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="pet-photo"
              />
              <label
                htmlFor="pet-photo"
                className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50"
              >
                <Upload className="w-5 h-5 inline-block mr-2" />
                Upload Photo
              </label>
              {photo && <img src={photo} alt="Preview" className="ml-3 h-16 w-16 object-cover rounded-full" />}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Add Pet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal;