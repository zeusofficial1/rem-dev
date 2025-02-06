import React, { useState } from 'react';
import { User, Lock, Bell, GitBranch, CreditCard, Shield, LogOut, Sun, Moon } from 'lucide-react';
import AccountSettings from '../components/settings/AccountSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import TreePreferences from '../components/settings/TreePreferences';
import ThemeSettings from '../components/settings/ThemeSettings';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [currentTheme, setCurrentTheme] = useState('light');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'treePreferences':
        return <TreePreferences />;
      case 'themes':
        return <ThemeSettings currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />;
      default:
        return <AccountSettings />;
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'treePreferences', label: 'Family Tree Preferences', icon: GitBranch },
    { id: 'themes', label: 'Themes', icon: Sun },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === id
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-gray-50 rounded-xl p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;