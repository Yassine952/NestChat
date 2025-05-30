import React, { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-input-form">
        <div className="input-wrapper">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Connexion en cours..." : "Tapez votre message..."}
            disabled={disabled}
            className="message-textarea"
            rows={1}
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="send-button"
            title="Envoyer le message"
          >
            Envoyer
          </button>
        </div>
        <div className="input-info">
          <span className="char-count">{message.length}/1000</span>
        </div>
      </form>
    </div>
  );
};

export default MessageInput; 