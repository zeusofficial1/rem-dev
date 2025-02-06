import React, { useState } from 'react';
import { GitBranch, Eye, EyeOff, Layout, Lock } from 'lucide-react';

const TreePreferences: React.FC = () => {
  const [preferences, setPreferences] = useState({
    showLivingOnly: false,
    defaultView: 'tree',
    privacyLevel: 'friends',
    autoArrange: true,
    showDates: true,
    showLocations: true,
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Family Tree Preferences</h2>
      
      <div className="space-y-6">
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.showLivingOnly}
              onChange={(e) => setPreferences(prev => ({ ...prev, showLivingOnly: e.target.checked }))}
              className="form-checkbox h-5 w-5 text-black rounded border-gray-300 focus:ring-black"
            />
            <span className="text-sm text-gray-700">Show only living family members by default</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Default View</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="tree"
                checked={preferences.defaultView === 'tree'}
                onChange={(e) => setPreferences(prev => ({ ...prev, defaultView: e.target.value }))}
                className="form-radio h-4 w-4 text-black border-gray-300 focus:ring-black"
              />
              <span className="text-sm text-gray-700">Tree</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="list"
                checked={preferences.defaultView === 'list'}
                onChange={(e) => setPreferences(prev => ({ ...prev, defaultView: e.target.value }))}
                className="form-radio h-4 w-4 text-black border-gray-300 focus:ring-black"
              />
              <span className="text-sm text-gray-700">List</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Level</label>
          <select
            value={preferences.privacyLevel}
            onChange={(e) => setPreferences(prev => ({ ...prev, privacyLevel: e.target.value }))}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-lg"
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="family">Family Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.autoArrange}
              onChange={(e) => setPreferences(prev => ({ ...prev, autoArrange: e.target.checked }))}
              className="form-checkbox h-5 w-5 text-black rounded border-gray-300 focus:ring-black"
            />
            <span className="text-sm text-gray-700">Auto-arrange tree layout</span>
          </label>
        </div>

        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.showDates}
              onChange={(e) => setPreferences(prev => ({ ...prev, showDates: e.target.checked }))}
              className="form-checkbox h-5 w-5 text-black rounded border-gray-300 focus:ring-black"
            />
            <span className="text-sm text-gray-700">Show birth and death dates</span>
          </label>
        </div>

        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.showLocations}
              onChange={(e) => setPreferences(prev => ({ ...prev, showLocations: e.target.checked }))}
              className="form-checkbox h-5 w-5 text-black rounded border-gray-300 focus:ring-black"
            />
            <span className="text-sm text-gray-700">Show locations</span>
          </label>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button type="button" className="btn btn-primary">
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default TreePreferences;