import React, { useEffect, useRef } from 'react';
import { Message, User } from '../types';
import { formatMessageTime, formatFullDate } from '../utils/dateUtils';

interface MessageListProps {
  messages: Message[];
  currentUser: User;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="message-list-container">
        <div className="empty-messages">
          Aucun message pour le moment. Commencez la conversation !
        </div>
      </div>
    );
  }

  return (
    <div className="message-list-container">
      <div className="message-list">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.user.id === currentUser.id ? 'own-message' : 'other-message'
            }`}
          >
            <div className="message-header">
              <div
                className="message-avatar"
                style={{ backgroundColor: message.user.profileColor }}
              >
                {message.user.username.charAt(0).toUpperCase()}
              </div>
              <div className="message-info">
                <span className="message-username">{message.user.username}</span>
                <span 
                  className="message-time"
                  title={formatFullDate(message.createdAt)}
                >
                  {formatMessageTime(message.createdAt)}
                </span>
              </div>
            </div>
            <div
              className="message-content"
              style={{
                backgroundColor: message.user.profileColor,
                color: 'white'
              }}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList; 