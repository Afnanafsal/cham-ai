import React from 'react';

const LandingPage: React.FC<{ onStartChat: () => void }> = ({ onStartChat }) => (
  <div className="landing-page" id="landingPage">
    <nav className="navbar">
      <div className="logo">AI Assistant</div>
      <ul className="nav-menu">
        <li><a href="#" className="active">Home</a></li>
        <li><a href="#">Features</a></li>
        <li><a href="#">Solutions</a></li>
        <li><a href="#">Enterprise</a></li>
        <li><a href="#">Pricing</a></li>
      </ul>
      <div className="nav-buttons">
        <a href="#" className="btn-login">Login</a>
        <a href="#" className="btn-primary">Try For Free Now</a>
      </div>
    </nav>
    <section className="hero">
      <h1 className="hero-title">AI Chatbots That Understand, Respond, and Impress</h1>
      <p className="hero-subtitle">
        Empowering Conversations with AI-Driven Intelligence—Smart, Scalable,
        and Always Available to Meet Your Every Need.
      </p>
      <div className="hero-buttons">
        <button className="btn-chat" id="startChatBtn" onClick={onStartChat}>
          <i className="fas fa-comments"></i>
          Start Chat
        </button>
      </div>
      <div className="user-stats">
        <div className="user-avatars">
          <div className="user-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="user-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="user-avatar">
            <i className="fas fa-user"></i>
          </div>
        </div>
        Supporting over <strong>3,000,000</strong> users worldwide
      </div>
    </section>
  </div>
);

export default LandingPage;
