import { MessageSquarePlus, Eye, CalendarHeart } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, feedbackCount }) {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => setActivePage('submission')} role="button" tabIndex={0}>
          <div className="brand-icon-wrapper">
            <CalendarHeart className="brand-icon" size={24} />
          </div>
          <div>
            <h1 className="brand-title">Community Event Feedback Portal</h1>
            <p className="brand-subtitle">Share your event experience & explore community voices</p>
          </div>
        </div>

        <nav className="navbar-nav" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-btn ${activePage === 'submission' ? 'active' : ''}`}
            onClick={() => setActivePage('submission')}
            aria-current={activePage === 'submission' ? 'page' : undefined}
          >
            <MessageSquarePlus size={18} />
            <span>Submit Feedback</span>
          </button>

          <button
            type="button"
            className={`nav-btn ${activePage === 'display' ? 'active' : ''}`}
            onClick={() => setActivePage('display')}
            aria-current={activePage === 'display' ? 'page' : undefined}
          >
            <Eye size={18} />
            <span>View All Feedback</span>
            {feedbackCount > 0 && (
              <span className="count-badge" title={`${feedbackCount} feedback(s) submitted`}>
                {feedbackCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
