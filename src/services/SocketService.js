import io from 'socket.io-client';

// Get socket URL from environment variables
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://legalplatform.co:4000';

// Socket connection options
const socketOptions = {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    transports: ['websocket'],
    path: '/socket.io',
};

// Create socket instance
const socket = io(SOCKET_URL, socketOptions);

// Connection event handlers
socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
  if (reason === 'io server disconnect') {
    // The disconnection was initiated by the server, you need to reconnect manually
    socket.connect();
  }
});

socket.on('reconnect_attempt', (attempt) => {
  console.log(`Socket reconnection attempt ${attempt}`);
});

socket.on('reconnect_failed', () => {
  console.error('Socket reconnection failed');
});

// Export socket instance and helper functions
export default {
  socket,
  // Helper function to subscribe to events
  subscribe(event, callback) {
    socket.on(event, callback);
    return () => socket.off(event, callback); // Return unsubscribe function
  },
  
  // Helper function to emit events
  emit(event, data, callback) {
    return socket.emit(event, data, callback);
  },
  
  // Helper function to check connection status
  isConnected() {
    return socket.connected;
  }
};