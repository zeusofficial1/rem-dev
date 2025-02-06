import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Settings, Share, ChevronDown } from 'lucide-react';
import { FamilyTree } from '../types/FamilyTree';

interface FamilyTreeNavBarProps {
  treeName: string;
  treeId: string;
  trees: FamilyTree[];
}

const FamilyTreeNavBar: React.FC<FamilyTreeNavBarProps> = ({ treeName, treeId, trees }) => {
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateSidebarWidth = () => {
      const sidebar = document.querySelector('nav');
      if (sidebar) {
        setSidebarWidth(sidebar.clientWidth);
      }
    };

    updateSidebarWidth();
    window.addEventListener('resize', updateSidebarWidth);

    return () => {
      window.removeEventListener('resize', updateSidebarWidth);
    };
  }, []);

  const handleTreeChange = (selectedTreeId: string) => {
    setIsDropdownOpen(false);
    navigate(`/tree/${selectedTreeId}`);
  };

  return (
    <div 
      className="fixed top-16 left-0 right-0 z-10"
      style={{ 
        marginLeft: `${sidebarWidth}px`,
        width: `calc(100% - ${sidebarWidth}px)`,
        backgroundColor: '#f8f9fa',
      }}
    >
      <div 
        className="flex items-center justify-between bg-white"
        style={{
          margin: '20px',
          border: '1px solid #e5e7eb',
          padding: '10px',
        }}
      >
        <div className="flex items-center">
          <Link to="/family-trees" className="text-gray-600 hover:text-gray-800 mr-4">
            <ChevronLeft size={20} />
          </Link>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span>🌳</span>
              <span>{treeName}</span>
              <ChevronDown size={16} />
            </button>
            {isDropdownOpen && (
              <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  {trees.map((tree) => (
                    <button
                      key={tree.id}
                      onClick={() => handleTreeChange(tree.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      {tree.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link to={`/tree-dashboard/${treeId}`} className="text-gray-600 hover:text-gray-800">
            <Users size={20} />
          </Link>
          <button className="text-gray-600 hover:text-gray-800">
            <Settings size={20} />
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <Share size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilyTreeNavBar;