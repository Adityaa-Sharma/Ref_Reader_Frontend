export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
    EXTRACT_REFERENCES: '/api/extract_references/arxiv',
    CHAT: '/api/chat'
};
