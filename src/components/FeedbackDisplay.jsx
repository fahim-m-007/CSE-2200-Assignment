import { useState } from 'react';
import {
  Star,
  Calendar,
  Mail,
  Phone,
  User,
  Sparkles,
  MessageSquare,
  Search,
  Filter,
  Trash2,
  AlertTriangle,
  ArrowUpDown,
  PlusCircle,
  Clock,
} from 'lucide-react';

export default function FeedbackDisplay({
  feedbacks = [],
  onDeleteFeedback,
  onClearAllFeedbacks,
  onNavigateToSubmission,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showClearModal, setShowClearModal] = useState(false);

  const handleDelete = (id, personName) => {
    if (window.confirm(`Are you sure you want to remove the feedback by ${personName}?`)) {
      if (onDeleteFeedback) {
        onDeleteFeedback(id);
      }
    }
  };

  const handleClearAll = () => {
    if (onClearAllFeedbacks) {
      onClearAllFeedbacks();
    }
    setShowClearModal(false);
  };

  // Filter & Search
  const filteredFeedbacks = feedbacks.filter((item) => {
    const matchesSearch =
      item.eventName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.feedbackMessage?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating =
      filterRating === 'all' ? true : Number(item.rating) === Number(filterRating);

    return matchesSearch && matchesRating;
  });

  // Helper to parse date timestamps for robust sorting
  const getSortTimestamp = (item) => {
    if (item.submittedAt) {
      const time = new Date(item.submittedAt).getTime();
      if (!isNaN(time)) return time;
    }
    if (item.eventDate) {
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(item.eventDate)) {
        const [d, m, y] = item.eventDate.split('/').map(Number);
        return new Date(y, m - 1, d).getTime();
      }
      const time = new Date(item.eventDate).getTime();
      if (!isNaN(time)) return time;
    }
    return 0;
  };

  // Sorting
  const sortedFeedbacks = [...filteredFeedbacks].sort((a, b) => {
    if (sortBy === 'newest') {
      return getSortTimestamp(b) - getSortTimestamp(a);
    }
    if (sortBy === 'oldest') {
      return getSortTimestamp(a) - getSortTimestamp(b);
    }
    if (sortBy === 'rating-desc') {
      return b.rating - a.rating;
    }
    if (sortBy === 'rating-asc') {
      return a.rating - b.rating;
    }
    return 0;
  });

  // Calculate statistics
  const totalCount = feedbacks.length;
  const avgRating =
    totalCount > 0
      ? (feedbacks.reduce((acc, curr) => acc + Number(curr.rating || 0), 0) / totalCount).toFixed(1)
      : '0.0';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Handles YYYY-MM-DD from <input type="date" /> directly
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
      }
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year}, ${hours}:${minutes}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="display-page-container">
      {/* Header Banner */}
      <div className="display-header">
        <div className="display-header-text">
          <h2 className="page-title">Community Event Feedback Display</h2>
          <p className="page-subtitle">
            All submitted feedback records stored directly in browser&apos;s localStorage.
          </p>
        </div>

        {totalCount > 0 && (
          <div className="display-stats-badge">
            <div className="stat-card">
              <span className="stat-value">{totalCount}</span>
              <span className="stat-label">Total Submissions</span>
            </div>
            <div className="stat-card">
              <div className="stat-rating-val">
                <span className="stat-value">{avgRating}</span>
                <Star size={18} className="star-icon-stat" />
              </div>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        )}
      </div>

      {totalCount === 0 ? (
        <div className="empty-state-card">
          <div className="empty-state-icon">
            <MessageSquare size={48} />
          </div>
          <h3>No Feedback Submitted Yet</h3>
          <p>
            No entries were found in localStorage. Be the first one to submit feedback for a
            community event!
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNavigateToSubmission}
          >
            <PlusCircle size={18} />
            Submit Feedback Now
          </button>
        </div>
      ) : (
        <>
          {/* Controls Bar: Search, Filters, Sort & Clear */}
          <div className="controls-bar">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search event, name, email or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <div className="select-wrapper">
                <Filter size={16} className="select-icon" />
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="filter-select"
                  aria-label="Filter by rating"
                >
                  <option value="all">All Ratings (1 - 5)</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                  <option value="3">⭐⭐⭐ 3 Stars</option>
                  <option value="2">⭐⭐ 2 Stars</option>
                  <option value="1">⭐ 1 Star</option>
                </select>
              </div>

              <div className="select-wrapper">
                <ArrowUpDown size={16} className="select-icon" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                  aria-label="Sort feedbacks"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rating-desc">Rating: High to Low</option>
                  <option value="rating-asc">Rating: Low to High</option>
                </select>
              </div>

              <button
                type="button"
                className="btn btn-danger-outline"
                onClick={() => setShowClearModal(true)}
                title="Clear all saved feedback from localStorage"
              >
                <Trash2 size={16} />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Feedbacks Grid / List */}
          {sortedFeedbacks.length === 0 ? (
            <div className="no-matches-card">
              <p>No feedbacks match your current search or filter criteria.</p>
              <button
                type="button"
                className="btn btn-secondary-sm"
                onClick={() => {
                  setSearchQuery('');
                  setFilterRating('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="feedback-grid">
              {sortedFeedbacks.map((fb) => (
                <div key={fb.id} className="feedback-card">
                  <div className="feedback-card-top">
                    <div className="event-badge">
                      <Sparkles size={14} className="event-icon" />
                      <span className="event-name">{fb.eventName}</span>
                    </div>

                    <div className="rating-pill">
                      <div className="stars-mini">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={`mini-star ${
                              star <= fb.rating ? 'star-gold-active' : 'star-gold-inactive'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="rating-number">{fb.rating}/5</span>
                    </div>
                  </div>

                  <div className="feedback-message-box">
                    <p className="message-text">&ldquo;{fb.feedbackMessage}&rdquo;</p>
                  </div>

                  <div className="feedback-meta-section">
                    <div className="meta-row">
                      <div className="meta-item author-item">
                        <User size={15} className="meta-icon" />
                        <span className="meta-label">Submitted by:</span>
                        <strong className="meta-value">
                          {fb.firstName} {fb.lastName}
                        </strong>
                      </div>
                      <div className="meta-item">
                        <Calendar size={15} className="meta-icon" />
                        <span className="meta-label">Event Date:</span>
                        <span className="meta-value">{formatDate(fb.eventDate)}</span>
                      </div>
                    </div>

                    <div className="meta-row">
                      <div className="meta-item">
                        <Mail size={15} className="meta-icon" />
                        <span className="meta-label">Email:</span>
                        <span className="meta-value email-value">{fb.email}</span>
                      </div>
                      <div className="meta-item">
                        <Phone size={15} className="meta-icon" />
                        <span className="meta-label">Phone:</span>
                        <span className="meta-value">{fb.phoneNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="feedback-card-footer">
                    <div className="timestamp-info">
                      {fb.submittedAt && (
                        <>
                          <Clock size={13} />
                          <span>Submitted: {formatTimestamp(fb.submittedAt)}</span>
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      className="delete-card-btn"
                      onClick={() => handleDelete(fb.id, `${fb.firstName} ${fb.lastName}`)}
                      title="Delete this entry"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal for Clear All */}
      {showClearModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div className="modal-header">
              <AlertTriangle className="modal-warning-icon" size={28} />
              <h3>Clear All Feedback Records?</h3>
            </div>
            <p className="modal-body">
              This will permanently delete all <strong>{totalCount}</strong> feedback submissions
              from your browser&apos;s localStorage. This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowClearModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleClearAll}
              >
                Yes, Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
