import React from 'react';
import { Pet } from '../../types/FamilyMember';
import { Dog, Cat, Bird, Fish, HelpCircle, Calendar, Edit, Trash } from 'lucide-react';

interface PetsListProps {
  pets: Pet[];
  onEdit: (pet: Pet) => void;
  onDelete: (petId: string) => void;
}

const PetsList: React.FC<PetsListProps> = ({ pets, onEdit, onDelete }) => {
  const getPetTypeIcon = (type: Pet['type']) => {
    switch (type) {
      case 'dog':
        return <Dog className="w-5 h-5 text-gray-400" />;
      case 'cat':
        return <Cat className="w-5 h-5 text-gray-400" />;
      case 'bird':
        return <Bird className="w-5 h-5 text-gray-400" />;
      case 'fish':
        return <Fish className="w-5 h-5 text-gray-400" />;
      default:
        return <HelpCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  if (pets.length === 0) {
    return (
      <div className="text-center py-8">
        <Dog className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500">No pets added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pets.map((pet) => (
        <div
          key={pet.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {pet.photo ? (
                <img
                  src={pet.photo}
                  alt={pet.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  {getPetTypeIcon(pet.type)}
                </div>
              )}
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium">{pet.name}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="capitalize">{pet.type}</span>
                {pet.breed && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{pet.breed}</span>
                  </>
                )}
              </div>
              {pet.birthDate && (
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Born {new Date(pet.birthDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(pet)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Edit pet"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(pet.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Delete pet"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetsList;