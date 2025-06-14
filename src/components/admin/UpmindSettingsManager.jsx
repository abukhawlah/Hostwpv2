import React from 'react';

export default function UpmindSettingsManager() {
  console.log('UpmindSettingsManager rendering...');
  
  try {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'lightblue',
        border: '2px solid blue',
        margin: '10px'
      }}>
        <h1>✅ UpmindSettingsManager Loaded Successfully</h1>
        <p>✅ Component is rendering without errors</p>
        <p>✅ Current time: {new Date().toLocaleString()}</p>
        <p>✅ No arrays or objects being accessed</p>
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'white' }}>
          <h3>Debug Info:</h3>
          <p>Component: UpmindSettingsManager</p>
          <p>Status: Working</p>
          <p>Error: None</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in UpmindSettingsManager:', error);
    return (
      <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
        <h1>❌ Error in UpmindSettingsManager</h1>
        <p>Error: {error.message}</p>
      </div>
    );
  }
} 