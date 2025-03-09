import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MainContainer from './components/MainContainer';

function App() {
  const [markdownContent, setMarkdownContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarkdownContent = async () => {
      try {
        // In a real-world scenario, this could be an API call
        // For local development, we'll use a sample file
        const response = await fetch('/sample-content.md');

        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }

        const content = await response.text();
        setMarkdownContent(content);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching markdown content:', error);
        setError('Failed to load content. Please try again later.');
        setLoading(false);
      }
    };

    fetchMarkdownContent();
  }, []);

  return (
    <div className="App">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger m-5" role="alert">
          {error}
        </div>
      ) : (
        <MainContainer markdownContent={markdownContent} />
      )}
    </div>
  );
}

export default App;
