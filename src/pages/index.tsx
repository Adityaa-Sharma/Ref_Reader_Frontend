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
        throw new Error(`Failed to process paper: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response:', data); // For debugging

      setSessionData({
        session_id: `session-${Date.now()}`,
        arxiv_id: arxivId
      });
    } catch (err: any) {
      console.error('Error details:', err);
      setError(err.message || 'Failed to connect to the server. Please try again.');
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
