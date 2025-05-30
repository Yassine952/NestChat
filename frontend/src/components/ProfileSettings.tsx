import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';

interface ProfileSettingsProps {
  user: User;
  onClose: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onClose }) => {
  const { updateUserProfile } = useAuth();
  const [selectedColor, setSelectedColor] = useState(user.profileColor);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const predefinedColors = [
    '#3B82F6',
    '#EF4444',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#F97316',
    '#06B6D4',
    '#84CC16',
    '#EC4899',
    '#6B7280',
  ];

  const handleSave = async () => {
    if (selectedColor === user.profileColor) {
      onClose();
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await updateUserProfile(selectedColor);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Paramètres du profil</h2>
          <button onClick={onClose} className="close-button">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="profile-preview">
            <div
              className="profile-avatar-large"
              style={{ backgroundColor: selectedColor }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h3>{user.username}</h3>
          </div>

          <div className="color-section">
            <h4>Couleur du profil</h4>
            
            <div className="predefined-colors">
              <h5>Couleurs prédéfinies</h5>
              <div className="color-grid">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="custom-color">
              <h5>Couleur personnalisée</h5>
              <div className="custom-color-input">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={handleColorChange}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={selectedColor}
                  onChange={handleColorChange}
                  placeholder="#000000"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  className="color-text-input"
                />
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="save-button"
          >
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings; 