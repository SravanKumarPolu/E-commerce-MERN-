import React from 'react';

const AuthDebug: React.FC = () => {
  const token = localStorage.getItem('token');
  
  const testAuth = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/analytics/paypal', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Auth Test Response:', response.status, response.statusText);
      const data = await response.text();
      console.log('Auth Test Data:', data);
      
      if (response.ok) {
        alert('✅ Authentication successful!');
      } else {
        alert(`❌ Authentication failed: ${response.status} ${data}`);
      }
    } catch (error) {
      console.error('Auth test error:', error);
      alert('❌ Network error during auth test');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-neutral-200 z-50">
      <h3 className="font-bold text-sm mb-2">🔍 Auth Debug</h3>
      <div className="text-xs space-y-1 mb-3">
        <div>Token: {token ? '✅ Present' : '❌ Missing'}</div>
        <div>Length: {token?.length || 0}</div>
      </div>
      <button 
        onClick={testAuth}
        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
      >
        Test Auth
      </button>
    </div>
  );
};

export default AuthDebug; 