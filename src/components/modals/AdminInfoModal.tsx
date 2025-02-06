import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Check } from 'lucide-react';

interface AdminInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminInfoModal: React.FC<AdminInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const adminCapabilities = [
    'Edit and manage the family tree',
    'Add and remove family members',
    'Manage member permissions',
    'Access tree settings',
    'Invite new members',
    'Moderate content and photos',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/25 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#c15329]/10 mb-4">
                <Shield className="h-6 w-6 text-[#c15329]" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                Admin Permissions
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Admins have special permissions to help manage the family tree
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Admin capabilities:</h4>
              <ul className="space-y-3">
                {adminCapabilities.map((capability, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{capability}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Only tree owners can add or remove admin permissions.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-[#c15329] text-white rounded-lg hover:bg-[#a84723] transition-colors"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default AdminInfoModal;