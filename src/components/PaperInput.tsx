import { useState } from 'react';
import styles from '../styles/PaperInput.module.css';

interface PaperInputProps {
  onSubmit: (arxivId: string) => void;
  loading: boolean;
  error: string | null;
}

export default function PaperInput({ onSubmit, loading, error }: PaperInputProps) {
  const [arxivId, setArxivId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateArxivId = (id: string) => {
    if (!id.trim()) {
      return 'ArXiv ID is required';
    }
    // Basic ArXiv ID format validation
    const arxivPattern = /^\d{4}\.\d{4,5}(v\d+)?$/;
    if (!arxivPattern.test(id)) {
      return 'Invalid ArXiv ID format (e.g., 2101.12345)';
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    const validationError = validateArxivId(arxivId);
    if (validationError) {
      setValidationError(validationError);
      return;
    }

    onSubmit(arxivId.trim());
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={arxivId}
          onChange={(e) => {
            setArxivId(e.target.value);
            setValidationError(null);
          }}
          placeholder="Enter ArXiv ID (e.g., 2101.12345)"
          disabled={loading}
          className={`${styles.input} ${(error || validationError) ? styles.inputError : ''}`}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Processing...' : 'Analyze Paper'}
        </button>
      </form>
      {(error || validationError) && (
        <div className={styles.error}>
          {validationError || error}
        </div>
      )}
    </div>
  );
}
