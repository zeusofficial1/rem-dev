import React, { useState } from 'react';
import { X, GitBranch, ChevronRight } from 'lucide-react';

interface AddFamilyTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

const AddFamilyTreeModal: React.FC<AddFamilyTreeModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [treeName, setTreeName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (treeName.trim()) {
      onAdd(treeName.trim());
      setTreeName('');
      setError('');
      onClose();
    } else {
      setError('Please enter a valid tree name');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Create New Family Tree</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="mb-6 flex items-center justify-center">
          <div className="bg-green-100 rounded-full p-4">
            <GitBranch size={48} className="text-green-600" />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="treeName" className="block text-sm font-medium text-gray-700 mb-1">
              Tree Name
            </label>
            <input
              type="text"
              id="treeName"
              value={treeName}
              onChange={(e) => setTreeName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              placeholder="Enter your family tree name"
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Create Tree
              <ChevronRight size={20} className="ml-1" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFamilyTreeModal;