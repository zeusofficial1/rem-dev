import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, GitBranch, Search, Settings, HelpCircle, LogOut, Image, UserPlus, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useFamilyTree } from '../contexts/FamilyTreeContext';
import { useAuth } from '../contexts/AuthContext';
import TopNavBar from './TopNavBar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTreesExpanded, setIsTreesExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { trees } = useFamilyTree();
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Family Members', path: '/family-members' },
    { icon: Image, label: 'Gallery', path: '/gallery' },
    { icon: Search, label: 'Search Directory', path: '/search-directory' },
    { icon: UserPlus, label: 'Invite Family', path: '/invite-family' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Get Support', path: '/help' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <nav className={`bg-white text-gray-800 h-screen flex flex-col transition-all duration-300 ease-in-out border-r border-gray-200 ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <Link to="/" className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <img 
              src="/logo.svg" 
              alt="REM-ME"
              className={`transition-all duration-300 ${
                isSidebarCollapsed ? 'w-8 h-8' : 'w-36 h-auto'
              }`}
              style={{ 
                objectFit: 'contain',
                objectPosition: 'left center'
              }}
            />
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
        </div>
        <ul className="flex-grow">
          {navItems.map((item, index) => {
            if (index === 0) {
              return (
                <React.Fragment key="trees-section">
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center py-2 px-4 transition-colors duration-200 ${
                        location.pathname === item.path
                          ? 'bg-gray-100 text-black'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isSidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                      <span className={isSidebarCollapsed ? 'hidden' : 'block'}>{item.label}</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => !isSidebarCollapsed && setIsTreesExpanded(!isTreesExpanded)}
                      className={`w-full flex items-center py-2 px-4 transition-colors duration-200 ${
                        location.pathname.startsWith('/tree/')
                          ? 'bg-gray-100 text-black'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                      }`}
                    >
                      <GitBranch className={`w-5 h-5 ${isSidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                      {!isSidebarCollapsed && (
                        <>
                          <span className="flex-grow text-left">Family Trees</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${isTreesExpanded ? 'transform rotate-180' : ''}`}
                          />
                        </>
                      )}
                    </button>
                    {!isSidebarCollapsed && isTreesExpanded && (
                      <ul className="ml-9 mt-1 space-y-1">
                        {trees.map(tree => (
                          <li key={tree.id}>
                            <Link
                              to={`/tree/${tree.id}`}
                              className={`block py-2 px-3 text-sm rounded-md transition-colors duration-200 ${
                                location.pathname === `/tree/${tree.id}`
                                  ? 'bg-gray-100 text-black'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                              }`}
                            >
                              {tree.name}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            to="/family-trees"
                            className="block py-2 px-3 text-sm text-[#c15329] hover:bg-gray-50 rounded-md transition-colors duration-200"
                          >
                            + New Tree
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                </React.Fragment>
              );
            }
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center py-2 px-4 transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isSidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  <span className={isSidebarCollapsed ? 'hidden' : 'block'}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full py-2 px-4 text-gray-700 hover:bg-gray-50 hover:text-black rounded-lg transition-colors duration-200"
          >
            <LogOut className={`w-5 h-5 ${isSidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>Logout</span>
          </button>
        </div>
      </nav>
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavBar isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;