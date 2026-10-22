import { useState } from 'react';
import Navbar from './components/Navbar';
import FeedbackForm from './components/FeedbackForm';
import FeedbackDisplay from './components/FeedbackDisplay';
import { getFeedbacks, deleteFeedback, clearAllFeedbacks } from './services/storage';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('submission');
  const [feedbacks, setFeedbacks] = useState(() => getFeedbacks());

  const handleFeedbackSubmitted = (newFeedback) => {
    setFeedbacks((prev) => [...prev, newFeedback]);
  };

  const handleDeleteFeedback = (id) => {
    const updated = deleteFeedback(id);
    setFeedbacks(updated);
  };

  const handleClearAllFeedbacks = () => {
    clearAllFeedbacks();
    setFeedbacks([]);
  };

  return (
    <div className="app-root">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        feedbackCount={feedbacks.length}
      />

      <main className="main-content">
        {activePage === 'submission' ? (
          <FeedbackForm
            onFeedbackSubmitted={handleFeedbackSubmitted}
            onNavigateToDisplay={() => setActivePage('display')}
          />
        ) : (
          <FeedbackDisplay
            feedbacks={feedbacks}
            onDeleteFeedback={handleDeleteFeedback}
            onClearAllFeedbacks={handleClearAllFeedbacks}
            onNavigateToSubmission={() => setActivePage('submission')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
