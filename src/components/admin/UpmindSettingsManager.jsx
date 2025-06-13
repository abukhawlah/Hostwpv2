import React from 'react';
import { Settings } from 'lucide-react';

const UpmindSettingsManager = () => {
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Settings className="w-6 h-6 text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900">Upmind API Settings</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">API Configuration</h2>
        <p className="text-gray-600">
          This is a test version of the Upmind Settings Manager. 
          If you can see this message, the routing and basic component loading is working.
        </p>
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Test Status</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>✅ Component loaded successfully</li>
            <li>✅ React rendering working</li>
            <li>✅ Lucide icons working</li>
            <li>✅ Tailwind CSS styling working</li>
          </ul>
        </div>
        
        <div className="mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpmindSettingsManager; 