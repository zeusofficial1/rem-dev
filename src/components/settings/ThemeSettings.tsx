import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeSettingsProps {
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ currentTheme, setCurrentTheme }) => {
  const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Theme Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCurrentTheme(id)}
            className={`
              flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all
              ${currentTheme === id 
                ? 'border-black bg-black text-white' 
                : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <Icon className="w-8 h-8 mb-2" />
            <span className="font-medium">{name}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="font-medium mb-4">Preview</h3>
        <div className="p-6 bg-gray-100 rounded-xl">
          <div className="space-y-4">
            <div className="h-8 bg-white rounded-lg w-3/4"></div>
            <div className="h-8 bg-white rounded-lg w-1/2"></div>
            <div className="h-8 bg-white rounded-lg w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;