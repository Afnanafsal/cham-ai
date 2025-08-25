import React, { useState } from 'react';
import LandingPage from './LandingPage';
import ChatPage from './ChatPage';

const MainApp: React.FC = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      {!showChat ? (
        <LandingPage onStartChat={() => setShowChat(true)} />
      ) : (
        <ChatPage />
      )}
    </>
  );
};

export default MainApp;
