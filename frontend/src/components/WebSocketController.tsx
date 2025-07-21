import React, { useState } from 'react';
import { useShopContext } from '../context/ShopContext';

const WebSocketController: React.FC = () => {
  const { webSocket } = useShopContext();
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleWebSocket = () => {
    if (isMuted) {
      // Reconnect WebSocket
      webSocket.connect();
      setIsMuted(false);
      console.log('🔌 WebSocket reconnected');
    } else {
      // Disconnect WebSocket
      webSocket.disconnect();
      setIsMuted(true);
      console.log('🔇 WebSocket muted (disconnected)');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-3 border">
        <div className="flex items-center space-x-3">
          {/* Connection Status Indicator */}
          <div className="flex items-center space-x-2">
            <div 
              className={`w-3 h-3 rounded-full ${
                webSocket.isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm font-medium">
              {webSocket.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Toggle Button */}
          <button
            onClick={handleToggleWebSocket}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              isMuted
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
            title={isMuted ? 'Reconnect WebSocket' : 'Disconnect WebSocket'}
          >
            {isMuted ? '🔌 Connect' : '🔇 Mute'}
          </button>
        </div>

        {/* Error Message */}
        {webSocket.connectionError && (
          <div className="mt-2 text-xs text-red-600">
            Error: {webSocket.connectionError}
          </div>
        )}

        {/* Info */}
        <div className="mt-2 text-xs text-gray-500">
          Real-time order updates & notifications
        </div>
      </div>
    </div>
  );
};

export default WebSocketController; 