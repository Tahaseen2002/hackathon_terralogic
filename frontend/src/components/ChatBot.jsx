import React, { useState } from 'react';
import { aiAPI } from '../services/api';

function ChatBot() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendQuery = async () => {
    if (!query.trim()) return;

    const userMessage = { type: 'user', text: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const response = await aiAPI.query(query);
      const aiMessage = {
        type: 'ai',
        text: response.data.data.answer,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        type: 'ai',
        text: '⚠️ Sorry, I couldn\'t process your query. Please make sure the AI service is configured properly.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  return (
    <div className="chat-section" style={{ margin: 0 }}>
      <div style={{ marginBottom: '8px' }}>
        <h2>💬 Ask AI About Your Team</h2>
        <p style={{ color: '#666', marginTop: '8px', fontSize: '14px' }}>
          Ask questions like: "Who has closed the most tasks this week?" or "What's our completion rate?"
        </p>
      </div>

      <div style={{ 
        maxHeight: '500px', 
        overflowY: 'auto', 
        marginBottom: '20px',
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.02) 0%, rgba(14, 165, 233, 0.02) 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(37, 99, 235, 0.1)'
      }}>
        {messages.length === 0 ? (
          <div style={{ 
            padding: '60px 40px', 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%)', 
            borderRadius: '12px',
            color: '#666',
            border: '2px dashed rgba(37, 99, 235, 0.3)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💡</div>
            <p style={{ fontSize: '16px', fontWeight: '500' }}>
              Start a conversation with the AI assistant
            </p>
            <p style={{ fontSize: '14px', marginTop: '8px', color: '#999' }}>
              Ask anything about your team's productivity and tasks
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px 20px',
                marginBottom: '16px',
                borderRadius: '12px',
                background: msg.type === 'user' 
                  ? 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 50%, #06b6d4 100%)' 
                  : '#ffffff',
                color: msg.type === 'user' ? 'white' : '#0f172a',
                marginLeft: msg.type === 'user' ? '15%' : '0',
                marginRight: msg.type === 'user' ? '0' : '15%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                animation: 'fadeIn 0.3s ease-out',
                border: msg.type === 'ai' ? '1px solid rgba(37, 99, 235, 0.1)' : 'none'
              }}
            >
              <div style={{ 
                fontWeight: '700', 
                marginBottom: '8px', 
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                opacity: 0.9
              }}>
                {msg.type === 'user' ? '👤 You' : '🤖 AI Assistant'}
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your question here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button
          className="ai-btn"
          onClick={handleSendQuery}
          disabled={loading || !query.trim()}
          style={{
            background: query.trim() && !loading 
              ? 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 50%, #06b6d4 100%)' 
              : '#e2e8f0',
            color: query.trim() && !loading ? 'white' : '#94a3b8',
            minWidth: '100px'
          }}
        >
          {loading ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
              Sending...
            </>
          ) : (
            <>
              <span>📤</span>
              Send
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
