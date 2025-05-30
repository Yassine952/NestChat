import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { chatAPI } from '../services/api';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import UserList from '../components/UserList';
import ProfileSettings from '../components/ProfileSettings';

const Chat: React.FC = () => {
  const { user, logout } = useAuth();
  const token = localStorage.getItem('token');
  const { messages, onlineUsers, isConnected, sendMessage, setMessages } = useSocket(token);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const existingMessages = await chatAPI.getMessages();
        setMessages(existingMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    if (user) {
      loadMessages();
    }
  }, [user, setMessages]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    };

    const timeoutId = setTimeout(scrollToBottom, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages]);

  const handleSendMessage = (content: string) => {
    sendMessage(content);
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }
    }, 50);
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">
          <h1>💬 Udyr Chat</h1>
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '🟢 Connecté' : '🔴 Déconnecté'}
            </span>
          </div>
        </div>
        <div className="user-info">
          <div className="user-avatar" style={{ backgroundColor: user.profileColor }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span className="username">{user.username}</span>
          <button
            onClick={() => setShowProfileSettings(true)}
            className="settings-button"
            title="Paramètres du profil"
          >
            Profil
          </button>
          <button onClick={handleLogout} className="logout-button" title="Déconnexion">
            Déconnexion
          </button>
        </div>
      </div>

      <div className="chat-content">
        <div className="chat-main">
          <div ref={messageListRef} className="message-list-container">
            <MessageList messages={messages} currentUser={user} />
            <div ref={messagesEndRef} style={{ height: '1px' }} />
          </div>
          <MessageInput onSendMessage={handleSendMessage} disabled={!isConnected} />
        </div>
        <UserList users={onlineUsers} currentUser={user} />
      </div>

      {showProfileSettings && (
        <ProfileSettings
          user={user}
          onClose={() => setShowProfileSettings(false)}
        />
      )}
    </div>
  );
};

export default Chat; 