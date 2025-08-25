import React, { useRef, useState } from 'react';

const progressStates = [
  { icon: 'fa-brain', text: 'Thinking...' },
  { icon: 'fa-calculator', text: 'Calculating...' },
  { icon: 'fa-edit', text: 'Rephrasing...' },
  { icon: 'fa-paper-plane', text: 'Sending...' },
];

interface Message {
  user?: string;
  ai?: string;
  time: string;
}

const getCurrentTime = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatPage: React.FC = () => {
  const [history, setHistory] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [progressIdx, setProgressIdx] = useState<number | null>(null);
  const [progressText, setProgressText] = useState('Thinking...');
  const [showProgress, setShowProgress] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const renderHistory = () => (
    <>
      {history.length === 0 && (
        <div className="welcome-message">
            <i className="fas fa-comments"></i>
            <div>Welcome! I&apos;m your AI assistant.</div>
            <div style={{ fontSize: 13, marginTop: 8, opacity: 0.8 }}>
              Ask me anything - I&apos;m here to help!
            </div>
        </div>
      )}
      {history.map((item, idx) => (
        <React.Fragment key={idx}>
          {item.user && (
            <div className="chat-message user-message">
              <div className="message-avatar user-avatar-msg">
                <i className="fas fa-user"></i>
              </div>
              <div className="message-content">
                {item.user}
                <div className="message-time">{item.time}</div>
              </div>
            </div>
          )}
          {item.ai && (
            <div className="chat-message ai-message">
              <div className="message-avatar ai-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="message-content">
                <span dangerouslySetInnerHTML={{ __html: formatMessage(item.ai) }} />
                <div className="message-time">{item.time}</div>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );

  const formatMessage = (msg: string) => {
    // Format code blocks with a copy button and improved spacing
    let formatted = msg.replace(/```([\s\S]*?)```/g, function(match, code) {
      const escaped = code.trim().replace(/[&<>"']/g, function(m: string) {
        const map: { [key: string]: string } = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'};
        return map[m] || m;
      });
      const id = 'code-' + Math.random().toString(36).substr(2, 9);
      return `<div class="code-block-wrapper"><pre><code id="${id}">${escaped}</code></pre><button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('${id}').textContent)">Copy</button></div>`;
    });
    // Format inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    // Add paragraph breaks for double newlines
    formatted = formatted.replace(/\n\n+/g, '<br><br>');
    return formatted;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const currentTime = getCurrentTime();
    setHistory((prev) => [...prev, { user: message, time: currentTime }]);
    setMessage('');
    setShowProgress(true);
    setProgressIdx(0);
    setProgressText(progressStates[0].text);

    // Progress simulation
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < progressStates.length) {
        setProgressIdx(idx);
        setProgressText(progressStates[idx].text);
      } else {
        clearInterval(interval);
      }
    }, 800);

    try {
      const res = await fetch('http://localhost:5678/webhook/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const text = await res.text();
      const lines = text.split('\n').filter(Boolean);
      let data: Record<string, unknown> = {};
      if (lines.length > 0) {
        try {
          data = JSON.parse(lines[lines.length - 1]);
        } catch {
          data = {};
        }
      }
      setTimeout(() => {
        setShowProgress(false);
        setHistory((prev) => [
          ...prev,
          { ai: typeof data.ai_response === 'string' ? data.ai_response : typeof data.response === 'string' ? data.response : 'No response from AI.', time: getCurrentTime() },
        ]);
      }, 3200);
    } catch (err: unknown) {
      setShowProgress(false);
      let errorMsg = 'Error occurred.';
      if (err instanceof Error) errorMsg = 'Error: ' + err.message;
      setHistory((prev) => [
        ...prev,
        { ai: errorMsg, time: getCurrentTime() },
      ]);
    }
  };

  return (
    <div className="chat-page" id="chatPage" style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      <div className="chat-container">
        <div className="chat-header">
          <div className="avatar">
            <i className="fas fa-robot"></i>
          </div>
          <div className="info">
            <h3>AI Assistant</h3>
            <p>Your personal AI companion</p>
          </div>
          <div className="status-indicator"></div>
        </div>
        <div className="chat-history" id="chatHistory" ref={chatHistoryRef}>
          {renderHistory()}
        </div>
        {showProgress && (
          <div className="progress-indicator" id="progressIndicator">
            <div className="progress-content">
              <div className="progress-icon">
                <i className={`fas ${progressStates[progressIdx ?? 0].icon}`}></i>
              </div>
              <div className="progress-text" id="progressText">{progressText}</div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        )}
        <form className="chat-input" id="chatForm" onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              id="message"
              name="message"
              placeholder="Type your message..."
              autoComplete="off"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="send-button">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
