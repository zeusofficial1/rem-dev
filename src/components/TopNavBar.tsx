import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, User, UserPlus, PhoneCall, LogOut, Shield, CreditCard, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TopNavBarProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ isSidebarCollapsed, toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className={`bg-white shadow-md py-4 px-6 fixed top-0 right-0 left-0 z-10 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu size={24} />
          </button>
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-800">
            <Bell size={20} />
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
              <ChevronDown size={16} className={`text-gray-600 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <User className="mr-3 h-5 w-5 text-gray-400" /> Profile
                </Link>
                <Link to="/invite-family" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <UserPlus className="mr-3 h-5 w-5 text-gray-400" /> Invite Family
                </Link>
                <Link to="/request-demo" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <PhoneCall className="mr-3 h-5 w-5 text-gray-400" /> Request Demo
                </Link>
                <Link to="/privacy-policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <Shield className="mr-3 h-5 w-5 text-gray-400" /> Privacy Policy
                </Link>
                <Link to="/billing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <CreditCard className="mr-3 h-5 w-5 text-gray-400" /> Billing
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-400" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;