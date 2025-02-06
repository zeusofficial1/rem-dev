import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, Plus, Users, Trash, Clock, MapPin } from 'lucide-react';
import { useFamilyTree } from '../contexts/FamilyTreeContext';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const FamilyTreesPage: React.FC = () => {
  const { trees, addTree, deleteTree } = useFamilyTree();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTreeName, setNewTreeName] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    treeId: string;
    treeName: string;
  }>({
    isOpen: false,
    treeId: '',
    treeName: '',
  });

  const handleAddTree = async () => {
    if (!newTreeName.trim()) {
      toast.error('Please enter a tree name');
      return;
    }

    setIsLoading(true);
    try {
      await addTree(newTreeName.trim());
      setNewTreeName('');
      setIsAddModalOpen(false);
      toast.success('Family tree created successfully!');
    } catch (error) {
      console.error('Failed to add tree:', error);
      toast.error('Failed to create family tree');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (treeId: string, treeName: string) => {
    setDeleteConfirmation({
      isOpen: true,
      treeId,
      treeName,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTree(deleteConfirmation.treeId);
      toast.success('Family tree deleted successfully');
    } catch (error) {
      console.error('Failed to delete tree:', error);
      toast.error('Failed to delete family tree');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#c15329] to-[#ff853f] rounded-2xl p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <GitBranch className="w-8 h-8 mr-3" />
              Your Family Trees
            </h1>
            <p className="text-white/80">
              {trees.length} {trees.length === 1 ? 'tree' : 'trees'} in your collection
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-white text-[#c15329] rounded-lg hover:bg-white/90 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Tree
          </button>
        </div>
      </div>

      {/* Trees Grid */}
      {trees.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Family Trees Yet</h2>
          <p className="text-gray-500 mb-8">Create your first family tree to get started!</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-[#c15329] text-white rounded-lg hover:bg-[#a84723] transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Tree
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trees.map((tree, index) => (
            <motion.div
              key={tree.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#c15329]/10 rounded-xl flex items-center justify-center">
                      <GitBranch className="w-6 h-6 text-[#c15329]" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-semibold text-gray-900">{tree.name}</h2>
                      <p className="text-sm text-gray-500">
                        Created {new Date(tree.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(tree.id, tree.name)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete tree"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{tree.members?.length || 0} members</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                    <span>
                      {new Set(tree.members?.map(m => m.livingIn).filter(Boolean)).size} locations
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3 text-gray-400" />
                    <span>Last updated {new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/tree/${tree.id}`}
                    className="flex-1 text-center py-2 bg-[#c15329] text-white rounded-lg hover:bg-[#a84723] transition-colors"
                  >
                    View Tree
                  </Link>
                  <Link
                    to={`/tree/${tree.id}/details`}
                    className="flex-1 text-center py-2 border border-[#c15329] text-[#c15329] rounded-lg hover:bg-[#c15329] hover:text-white transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Tree Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Family Tree</h2>
            <div className="mb-4">
              <label htmlFor="treeName" className="block text-sm font-medium text-gray-700 mb-1">
                Tree Name
              </label>
              <input
                type="text"
                id="treeName"
                value={newTreeName}
                onChange={(e) => setNewTreeName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c15329]"
                placeholder="Enter tree name..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setNewTreeName('');
                  setIsAddModalOpen(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTree}
                disabled={isLoading || !newTreeName.trim()}
                className="px-4 py-2 bg-[#c15329] text-white rounded-md hover:bg-[#a84723] transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Tree'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, treeId: '', treeName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Family Tree"
        message={`Are you sure you want to delete "${deleteConfirmation.treeName}"? This action cannot be undone and all associated data will be permanently deleted.`}
        confirmText="Delete Tree"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default FamilyTreesPage;