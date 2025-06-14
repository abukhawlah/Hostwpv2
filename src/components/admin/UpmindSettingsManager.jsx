import React from 'react';

console.log('=== UpmindSettingsManager module loading ===');

export default function UpmindSettingsManager() {
  console.log('=== UpmindSettingsManager function called ===');
  console.log('=== About to return JSX ===');
  
  return React.createElement('div', {
    style: { 
      padding: '30px', 
      backgroundColor: 'orange',
      border: '5px solid red',
      fontSize: '20px',
      fontWeight: 'bold',
      margin: '20px'
    }
  }, 
    React.createElement('h1', null, '🔥 ULTRA BASIC COMPONENT 🔥'),
    React.createElement('p', null, 'If you see this orange box, the component is working!'),
    React.createElement('p', null, 'Using React.createElement instead of JSX'),
    React.createElement('p', null, 'Check console for logs')
  );
} 