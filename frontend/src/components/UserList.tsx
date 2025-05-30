import React from 'react';
import { User } from '../types';

interface UserListProps {
  users: User[];
  currentUser: User;
}

const UserList: React.FC<UserListProps> = ({ users, currentUser }) => {
  return (
    <div className="user-list">
      <div className="user-list-header">
        <h3>Utilisateurs en ligne ({users.length})</h3>
      </div>
      <div className="user-list-content">
        {users.length === 0 ? (
          <div className="no-users">
            <p>Aucun utilisateur en ligne</p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className={`user-item ${user.id === currentUser.id ? 'current-user' : ''}`}
            >
              <div
                className="user-avatar"
                style={{ backgroundColor: user.profileColor }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">
                  {user.username}
                  {user.id === currentUser.id && ' (Vous)'}
                </span>
                <div className="user-status">
                  <span className="status-dot online"></span>
                  En ligne
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList; 