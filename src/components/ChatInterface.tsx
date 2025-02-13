import { useState } from 'react';
import { API_ENDPOINTS } from '../constants/api';
import styles from '../styles/ChatInterface.module.css';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

interface ChatInterfaceProps {
  sessionData: {
    session_id: string;
    arxiv_id: string;
  };
}

export default function ChatInterface({ sessionData }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');
    setLoading(true);

    setMessages(prev => [...prev, { type: 'user', content: question }]);

    try {
      const response = await fetch(
        `${API_ENDPOINTS.CHAT}?response=${encodeURIComponent(JSON.stringify(sessionData))}&query=${encodeURIComponent(question)}`
      );
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to get response');
      
      setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: `Error: ${err.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`${styles.message} ${styles[msg.type]}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className={styles.loading}>Loading...</div>}
      </div>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={loading}
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
}
