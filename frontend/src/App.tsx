import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import './App.css';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (user) {
    return <Chat />;
  }

  return isLoginMode ? (
    <Login onSwitchToRegister={() => setIsLoginMode(false)} />
  ) : (
    <Register onSwitchToLogin={() => setIsLoginMode(true)} />
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
};

export default App;
