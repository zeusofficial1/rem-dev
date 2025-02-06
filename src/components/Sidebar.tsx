import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, GitBranch, Search, Settings, HelpCircle, LogOut, Image, UserPlus, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: GitBranch, label: 'Family Trees', path: '/family-trees' },
    { icon: Users, label: 'Family Members', path: '/family-members' },
    { icon: Image, label: 'Gallery', path: '/gallery' },
    { icon: Search, label: 'Search Directory', path: '/search-directory' },
    { icon: UserPlus, label: 'Invite Family', path: '/invite-family' },
    { icon: CreditCard, label: 'Subscription', path: '/subscription' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Get Support', path: '/help' },
  ];

  return (
    <nav className={`bg-gray-900 text-white h-screen flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex justify-between items-center">
        <h1 className={`text-xl font-bold ${isCollapsed ? 'hidden' : 'block'}`}>REM-Me</h1>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>
      <ul className="flex-grow">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `
                flex items-center py-2 px-4 transition-colors duration-200
                ${isActive
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              <span className={isCollapsed ? 'hidden' : 'block'}>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="p-4">
        <NavLink
          to="/logout"
          className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200"
        >
          <LogOut className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
          <span className={isCollapsed ? 'hidden' : 'block'}>Logout</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Sidebar;