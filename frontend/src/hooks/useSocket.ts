import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, User } from '../types';

export const useSocket = (token: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const newSocket = io('http://localhost:3001', {
      auth: {
        token,
      },
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('onlineUsers', (users: User[]) => {
      setOnlineUsers(users);
    });

    newSocket.on('userOnline', ({ user }: { user: User }) => {
      setOnlineUsers((prev) => {
        const exists = prev.find((u) => u.id === user.id);
        if (!exists) {
          return [...prev, user];
        }
        return prev;
      });
    });

    newSocket.on('userOffline', ({ user }: { user: User }) => {
      setOnlineUsers((prev) => prev.filter((u) => u.id !== user.id));
    });

    newSocket.on('userProfileUpdated', ({ userId, username, profileColor }: { userId: number, username: string, profileColor: string }) => {
      setOnlineUsers((prev) => 
        prev.map((user) => 
          user.id === userId 
            ? { ...user, profileColor } 
            : user
        )
      );
      
      setMessages((prev) => 
        prev.map((message) => 
          message.user.id === userId 
            ? { ...message, user: { ...message.user, profileColor } } 
            : message
        )
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token]);

  const sendMessage = (content: string) => {
    if (socket && isConnected) {
      socket.emit('sendMessage', { content });
    }
  };

  return {
    socket,
    messages,
    onlineUsers,
    isConnected,
    sendMessage,
    setMessages,
  };
}; 