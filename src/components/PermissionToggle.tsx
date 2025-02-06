import React, { useState } from 'react';
import { Shield, ChevronDown } from 'lucide-react';

interface PermissionToggleProps {
  currentLevel: 'owner' | 'admin' | 'member';
  onUpdateLevel: (level: 'admin' | 'member') => void;
  disabled?: boolean;
}

const PermissionToggle: React.FC<PermissionToggleProps> = ({
  currentLevel,
  onUpdateLevel,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (currentLevel === 'owner') return null;

  const isAdmin = currentLevel === 'admin';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isAdmin 
            ? 'bg-[#c15329] text-white hover:bg-[#a84723]' 
            : 'border border-[#c15329] text-[#c15329] hover:bg-[#c15329] hover:text-white'}
        `}
      >
        <Shield className="w-4 h-4 mr-1.5" />
        {isAdmin ? 'Admin' : 'Member'}
        <ChevronDown className="w-4 h-4 ml-1.5" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
          <button
            onClick={() => {
              onUpdateLevel('admin');
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm ${
              isAdmin 
                ? 'bg-[#c15329]/10 text-[#c15329]' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </div>
            <p className="text-xs text-gray-500 ml-6">Can edit tree and manage members</p>
          </button>
          <button
            onClick={() => {
              onUpdateLevel('member');
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm ${
              !isAdmin 
                ? 'bg-[#c15329]/10 text-[#c15329]' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Member
            </div>
            <p className="text-xs text-gray-500 ml-6">Can view and interact with tree</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default PermissionToggle;