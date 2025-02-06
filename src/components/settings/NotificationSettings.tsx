import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Calendar, Users, Gift } from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    email: {
      birthdays: true,
      newMembers: true,
      updates: false,
    },
    push: {
      birthdays: true,
      newMembers: true,
      updates: true,
    },
    sms: {
      birthdays: false,
      newMembers: false,
      updates: false,
    }
  });

  const NotificationGroup = ({ title, icon: Icon, type }: { title: string; icon: any; type: 'email' | 'push' | 'sms' }) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Icon className="w-5 h-5 text-gray-500" />
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="ml-7 space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-600">Birthday Reminders</span>
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings[type].birthdays}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                [type]: { ...prev[type], birthdays: e.target.checked }
              }))}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
          </div>
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-600">New Family Members</span>
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings[type].newMembers}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                [type]: { ...prev[type], newMembers: e.target.checked }
              }))}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
          </div>
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-600">Tree Updates</span>
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings[type].updates}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                [type]: { ...prev[type], updates: e.target.checked }
              }))}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
          </div>
        </label>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Notification Settings</h2>
      <div className="space-y-8">
        <NotificationGroup title="Email Notifications" icon={Mail} type="email" />
        <NotificationGroup title="Push Notifications" icon={Bell} type="push" />
        <NotificationGroup title="SMS Notifications" icon={Smartphone} type="sms" />
      </div>
    </div>
  );
};

export default NotificationSettings;