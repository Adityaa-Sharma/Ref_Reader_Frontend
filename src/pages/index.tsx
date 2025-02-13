import { useState } from 'react';
import { API_ENDPOINTS } from '../constants/api';
import PaperInput from '../components/PaperInput';
import ChatInterface from '../components/ChatInterface';
import styles from '../styles/Home.module.css';

interface SessionData {
  session_id: string;
  arxiv_id: string;
}

export default function Home() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaperSubmit = async (arxivId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.EXTRACT_REFERENCES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ arxiv_id: arxivId }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to process paper');
      setSessionData(data);
    } catch (err: any) {
      setError(err.message);
      setSessionData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Research Paper Analysis System</h1>
        <PaperInput onSubmit={handlePaperSubmit} loading={loading} error={error} />
        {sessionData && (
          <ChatInterface sessionData={sessionData} />
        )}
      </main>
    </div>
  );
}
