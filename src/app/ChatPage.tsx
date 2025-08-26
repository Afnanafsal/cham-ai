import React, { useRef, useState } from 'react';
// Navbar component directly in ChatPage

const Navbar: React.FC = () => {
  return (
    <nav
      style={{
        width: "100%",
        height: 56,
        background: "#fff",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        boxSizing: "border-box",
        fontFamily: "inherit",
        position: "fixed",
        top: 0,
        zIndex: 100
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 20, color: "#222" }}>Cham-ai</div>
      <div style={{ fontSize: 15, color: "#555" }}>
        Developed by{' '}
        <a
          href="https://linkedin.com/in/afnanafsal"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0077b5", textDecoration: "none", fontWeight: 500 }}
        >
          afnanafsal
        </a>
      </div>
    </nav>
  );
};
interface Message {
  user?: string;
  ai?: string;
  time: string;
}

const formatMessage = (msg: string) => {
  let formatted = msg.replace(/```([\s\S]*?)```/g, function(match, code) {
    const escaped = code.trim().replace(/[&<>"']/g, function(m: string) {
      const map: { [key: string]: string } = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'};
      return map[m] || m;
    });
    const id = 'code-' + Math.random().toString(36).substr(2, 9);
    return `<div class="code-block-wrapper"><pre><code id="${id}">${escaped}</code></pre><button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('${id}').textContent)">Copy</button></div>`;
  });
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  formatted = formatted.replace(/\n\n+/g, '<br><br>');
  return formatted;
};

const ChatPage: React.FC = () => {
  const [history, setHistory] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHistory((prev) => [...prev, { user: message, time: currentTime }]);
    setMessage('');

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
      setHistory((prev) => [
        ...prev,
        { ai: typeof data.ai_response === 'string' ? data.ai_response : typeof data.response === 'string' ? data.response : 'No response from AI.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
    } catch (err: unknown) {
      let errorMsg = 'Error occurred.';
      if (err instanceof Error) errorMsg = 'Error: ' + err.message;
      setHistory((prev) => [
        ...prev,
        { ai: errorMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
    }
  };

  return (
    <>
  <Navbar />
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          overflowX: "hidden",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 700,
            margin: "72px auto 0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0 16px 32px 16px",
            boxSizing: "border-box",
            overflowX: "hidden",
            minHeight: "80vh"
          }}
        >
          <div
            style={{
              width: "100%",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-start",
              overflowY: "auto",
              overflowX: "hidden",
              wordBreak: "break-word",
              marginBottom: 16,
              paddingBottom: 88 // ensures messages stay above the fixed form
            }}
            ref={chatHistoryRef}
          >
            <div style={{ width: '100%' }}>
              {history.length === 0 && (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "60vh",
                  width: "100%"
                }}>
                  <div style={{ fontSize: "2rem", fontWeight: 500, color: "#222", marginBottom: 24, textAlign: "center" }}>
                    Whats going on?
                  </div>
                  <div style={{ fontSize: 16, color: "#555", marginBottom: 8, textAlign: "center" }}>
                    Ask anything
                  </div>
                </div>
              )}
              {history.map((item, idx) => (
                <React.Fragment key={idx}>
                  {item.user && (
                    <div className="chat-message user-message" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '100%', overflowWrap: 'break-word', marginBottom: 16 }}>
                      <div className="message-avatar user-avatar-msg">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="message-content" style={{ maxWidth: '100%', overflowWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {item.user}
                        <div className="message-time">{item.time}</div>
                      </div>
                    </div>
                  )}
                  {item.ai && (
                    <div className="chat-message ai-message" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '100%', overflowWrap: 'break-word', marginBottom: 16 }}>
                      <div className="message-avatar ai-avatar">
                        <i className="fas fa-robot"></i>
                      </div>
                      <div className="message-content" style={{ maxWidth: '100%', overflowWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                        <span dangerouslySetInnerHTML={{ __html: formatMessage(item.ai) }} />
                        <div className="message-time">{item.time}</div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div style={{ flexGrow: 1 }} />
          <form
            style={{
              position: "fixed",
              left: 0,
              bottom: 0,
              width: "100vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "transparent",
              padding: "24px 0",
              zIndex: 10
            }}
            onSubmit={handleSubmit}
          >
            <div style={{
              width: "100%",
              maxWidth: 700,
              display: "flex",
              alignItems: "center",
              background: "#f5f5f5",
              borderRadius: 24,
              padding: "8px 16px"
            }}>
              <input
                type="text"
                placeholder="Ask anything"
                autoComplete="off"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 16,
                  padding: "8px 0"
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 8,
                  cursor: "pointer"
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M3.4 20.6a1 1 0 0 1-.3-1.1l3.2-9.6a1 1 0 0 1 1.3-.6l6.2 2.6a.5.5 0 0 0 .4-.9l-6.2-2.6a1 1 0 0 1-.6-1.3l3.2-9.6a1 1 0 0 1 1.1-.3c.3.1.5.4.6.7l9.6 19.2a1 1 0 0 1-1.3 1.3l-19.2-9.6a1 1 0 0 1-.7-.6z"/></svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
