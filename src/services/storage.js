const STORAGE_KEY = "community_event_feedbacks";

/**
 * Retrieve all feedbacks from localStorage.
 * @returns {Array} List of feedback objects
 */
export const getFeedbacks = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading feedbacks from localStorage:", error);
    return [];
  }
};

/**
 * Save a new feedback to localStorage without overwriting previous data.
 * @param {Object} feedbackData - The feedback payload from the form
 * @returns {Object} The saved feedback item with id and submittedAt
 */
export const saveFeedback = (feedbackData) => {
  try {
    const existing = getFeedbacks();
    const rawDate = (feedbackData.eventDate || "").trim();
    let formattedDate = rawDate;
    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      const [y, m, d] = rawDate.split("-");
      formattedDate = `${d}/${m}/${y}`;
    }

    const newFeedback = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      firstName: feedbackData.firstName.trim(),
      lastName: feedbackData.lastName.trim(),
      phoneNumber: feedbackData.phoneNumber.trim(),
      email: feedbackData.email.trim().toLowerCase(),
      eventName: feedbackData.eventName.trim(),
      eventDate: formattedDate,
      rating: Number(feedbackData.rating),
      feedbackMessage: feedbackData.feedbackMessage.trim(),
      submittedAt: new Date().toISOString(),
    };

    const updatedList = [...existing, newFeedback];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return newFeedback;
  } catch (error) {
    console.error("Error saving feedback to localStorage:", error);
    throw new Error("Failed to save feedback to local storage.", {
      cause: error,
    });
  }
};

/**
 * Check whether an email is unique among all existing submissions.
 * @param {string} email - Email to check
 * @param {string|null} excludeId - Optional ID to ignore (for future edits)
 * @returns {boolean} True if unique, false if already exists
 */
export const isEmailUnique = (email, excludeId = null) => {
  if (!email) return true;
  const existing = getFeedbacks();
  const normalizedEmail = email.trim().toLowerCase();
  return !existing.some(
    (item) =>
      item.email.trim().toLowerCase() === normalizedEmail &&
      (excludeId ? item.id !== excludeId : true),
  );
};

/**
 * Delete a specific feedback by id.
 * @param {string} id
 * @returns {Array} Updated list of feedbacks
 */
export const deleteFeedback = (id) => {
  try {
    const existing = getFeedbacks();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return getFeedbacks();
  }
};

/**
 * Clear all feedbacks from localStorage.
 */
export const clearAllFeedbacks = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing feedbacks:", error);
  }
};
