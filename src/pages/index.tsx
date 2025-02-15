import { useState } from 'react';
import type { NextPage } from 'next';
import PaperInput from '@/components/PaperInput';
import ChatInterface from '@/components/ChatInterface';
import styles from '@/styles/Home.module.css';
import { API_ENDPOINTS } from '@/constants/api';

const Home: NextPage = () => {
  const [sessionData, setSessionData] = useState<{ session_id: string; arxiv_id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaperSubmit = async (arxivId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.EXTRACT_REFERENCES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ arxiv_id: arxivId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process paper');
      }

      const data = await response.json();
      setSessionData({
        session_id: `session-${Date.now()}`, // You might want to get this from the backend
        arxiv_id: arxivId
      });
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to process paper');
      setSessionData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchPaper = () => {
    setSessionData(null);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reference Reader</h1>
      
      {sessionData && (
        <button 
          onClick={handleSwitchPaper} 
          className={styles.switchPaperButton}
        >
          Switch Paper
        </button>
      )}
      
      {!sessionData && (
        <PaperInput 
          onSubmit={handlePaperSubmit}
          loading={loading}
          error={error}
        />
      )}
      
      {sessionData && <ChatInterface sessionData={sessionData} />}
    </div>
  );
};

export default Home;
