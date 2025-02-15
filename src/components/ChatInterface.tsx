import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/constants/api';
import styles from '@/styles/ChatInterface.module.css';

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

const formatMessage = (content: string) => {
  // Split into paragraphs
  const paragraphs = content.split('\n\n');
  
  return paragraphs.map((paragraph, idx) => {
    // Check if it's a bullet point list
    if (paragraph.includes('- **')) {
      const items = paragraph.split('- ');
      return (
        <ul key={idx} className={styles.bulletList}>
          {items.filter(item => item.trim()).map((item, itemIdx) => {
            // Process bold text within bullet points
            const processedItem = item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return (
              <li 
                key={itemIdx} 
                dangerouslySetInnerHTML={{ __html: processedItem }}
                className={styles.bulletItem}
              />
            );
          })}
        </ul>
      );
    }
    
    // Process regular paragraphs with bold text
    const processedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return (
      <p 
        key={idx}
        dangerouslySetInnerHTML={{ __html: processedParagraph }}
        className={styles.paragraph}
      />
    );
  });
};

export default function ChatInterface({ sessionData }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Fix: Use useEffect instead of useState for welcome message
  useEffect(() => {
    setMessages([{
      type: 'bot',
      content: `Welcome! I'm your research paper assistant. I've analyzed the paper with ArXiv ID: ${sessionData.arxiv_id}. Feel free to ask me any questions about its contents and references.`
    }]);
  }, [sessionData.arxiv_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');
    setLoading(true);

    setMessages(prev => [...prev, { type: 'user', content: question }]);

    try {
      // Correctly format the URL parameters
      const response = await fetch(
        `${API_ENDPOINTS.CHAT}/?response=${encodeURIComponent(JSON.stringify(sessionData))}&query=${encodeURIComponent(question)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Origin': window.location.origin,
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to get response: ${response.status}`);
      }

      const data = await response.json();
      console.log('Chat response:', data); // For debugging
      
      if (typeof data.response === 'string') {
        setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Chat Error:', err);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: `Error: ${err.message || 'Failed to get response'}` 
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
            {msg.type === 'bot' 
              ? formatMessage(msg.content)
              : msg.content
            }
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
