import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (userId: string) => {
  const socket = useRef<Socket | null>(null);
  const socketInitialized = useRef(false);

  useEffect(() => {
    if (!userId || socketInitialized.current) return;

    const initSocket = async () => {
      // Initialize socket connection
      socket.current = io({
        path: '/api/socket',
        addTrailingSlash: false,
      });

      socket.current.on('connect', () => {
        console.log('Connected to socket server');
        socket.current?.emit('join', userId);
      });

      socket.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      socketInitialized.current = true;
    };

    initSocket();

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socketInitialized.current = false;
      }
    };
  }, [userId]);

  return socket.current;
};