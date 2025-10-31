// SocketContext.jsx
import React, { createContext, useMemo } from 'react';
import { io } from 'socket.io-client';

// Create the context
export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  // Use environment variable with fallback to undefined
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || undefined;

  // Memoize the socket instance
  const socket = useMemo(() => {
    const instance = io(SOCKET_URL, { autoConnect: true });
    console.log('🔌 Socket connecting to:', SOCKET_URL || '(same origin)');
    instance.on('connect', () => console.log('✅ Socket connected:', instance.id));
    instance.on('connect_error', (err) => console.error('❌ Socket connection error:', err.message));
    return instance;
  }, [SOCKET_URL]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

// 👇 This default export fixes the "does not provide an export named 'default'" error
export default SocketProvider;
