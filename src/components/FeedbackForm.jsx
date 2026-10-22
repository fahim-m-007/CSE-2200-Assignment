import { useState } from "react";
import { useFormik } from "formik";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Star,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
} from "lucide-react";
import { saveFeedback, isEmailUnique } from "../services/storage";
import DatePicker from "./DatePicker";

const validateForm = (values) => {
  const errors = {};

  if (!values.firstName || !values.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!values.lastName || !values.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!values.phoneNumber || !values.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required";
  } else if (!/^\d+$/.test(values.phoneNumber.trim())) {
    errors.phoneNumber = "Phone number must contain only digits (0-9)";
  }

  if (!values.email || !values.email.trim()) {
    errors.email = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address";
  } else if (!isEmailUnique(values.email.trim())) {
    errors.email = "This email address has already submitted feedback";
  }

  if (!values.eventName || !values.eventName.trim()) {
    errors.eventName = "Event name is required";
  }

  if (!values.eventDate || !values.eventDate.trim()) {
    errors.eventDate = "Event date is required";
  } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(values.eventDate.trim())) {
    errors.eventDate = "Please enter date in dd/mm/yyyy format";
  } else {
    const [dStr, mStr, yStr] = values.eventDate.trim().split("/");
    const day = parseInt(dStr, 10);
    const month = parseInt(mStr, 10);
    const year = parseInt(yStr, 10);
    if (
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31 ||
      year < 1900 ||
      year > 2100
    ) {
      errors.eventDate = "Please enter a valid calendar date (dd/mm/yyyy)";
    } else {
      const d = new Date(year, month - 1, day);
      if (
        d.getFullYear() !== year ||
        d.getMonth() !== month - 1 ||
        d.getDate() !== day
      ) {
        errors.eventDate = "Please enter a valid calendar date (dd/mm/yyyy)";
      }
    }
  }

  if (
    !values.rating ||
    Number(values.rating) < 1 ||
    Number(values.rating) > 5
  ) {
    errors.rating = "Rating is required";
  }

  if (!values.feedbackMessage || !values.feedbackMessage.trim()) {
    errors.feedbackMessage = "Feedback message is required";
  }

  return errors;
};

export default function FeedbackForm({
  onFeedbackSubmitted,
  onNavigateToDisplay,
}) {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [lastSubmittedName, setLastSubmittedName] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      eventName: "",
      eventDate: "",
      rating: "",
      feedbackMessage: "",
    },
    validate: validateForm,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      try {
        const savedItem = saveFeedback(values);
        setLastSubmittedName(`${savedItem.firstName} ${savedItem.lastName}`);
        setSubmitSuccess(true);
        resetForm();
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted(savedItem);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Submission failed:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleRatingClick = (val) => {
    const numericRating = Number(val);
    formik.setFieldValue("rating", numericRating, true);
    formik.setFieldTouched("rating", true, false);
  };

  const handleDateChange = (val) => {
    formik.setFieldValue("eventDate", val, true);
    formik.setFieldTouched("eventDate", true, false);
  };

  const handleReset = () => {
    formik.resetForm();
    setSubmitSuccess(false);
    setHoverRating(0);
  };

  // Immediate, synchronized error state computation
  const isDateValid = Boolean(
    formik.values.eventDate &&
    /^\d{2}\/\d{2}\/\d{4}$/.test(formik.values.eventDate.trim()),
  );
  const dateError =
    formik.touched.eventDate && !isDateValid
      ? formik.errors.eventDate || "Event date is required"
      : null;

  const isRatingValid = Boolean(
    formik.values.rating &&
    Number(formik.values.rating) >= 1 &&
    Number(formik.values.rating) <= 5,
  );
  const ratingError =
    formik.touched.rating && !isRatingValid
      ? formik.errors.rating || "Rating is required"
      : null;

  return (
    <div className="form-page-container">
      {submitSuccess && (
        <div className="alert-banner success-banner" role="alert">
          <div className="alert-icon-wrapper">
            <CheckCircle2 size={24} className="success-icon" />
          </div>
          <div className="alert-content">
            <h3>Feedback Saved Successfully!</h3>
            <p>
              Thank you, <strong>{lastSubmittedName}</strong>. Your feedback has
              been validated and securely stored in localStorage.
            </p>
            <div className="banner-actions">
              <button
                type="button"
                className="btn btn-secondary-sm"
                onClick={() => setSubmitSuccess(false)}
              >
                Submit Another Response
              </button>
              <button
                type="button"
                className="btn btn-primary-sm"
                onClick={onNavigateToDisplay}
              >
                View in Feedback Display →
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="form-card">
        <div className="form-header">
          <div className="form-header-badge">
            <Sparkles size={16} /> Community Voices
          </div>
          <h2 className="form-title">Event Feedback Submission</h2>
          <p className="form-description">
            Please fill in the form below to share your experience. All fields
            marked with <span className="required-asterisk">*</span> are
            required.
          </p>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          noValidate
          className="feedback-form"
        >
          {/* Row 1: First Name & Last Name */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                <User size={16} className="label-icon" />
                First Name <span className="required-asterisk">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="e.g. Rahim"
                className={`form-input ${
                  formik.touched.firstName && formik.errors.firstName
                    ? "input-error"
                    : ""
                } ${formik.touched.firstName && !formik.errors.firstName ? "input-valid" : ""}`}
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(
                  formik.touched.firstName && formik.errors.firstName,
                )}
                aria-describedby="firstName-error"
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div
                  id="firstName-error"
                  className="error-message"
                  role="alert"
                >
                  <AlertCircle size={14} />
                  <span>{formik.errors.firstName}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                <User size={16} className="label-icon" />
                Last Name <span className="required-asterisk">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="e.g. Islam"
                className={`form-input ${
                  formik.touched.lastName && formik.errors.lastName
                    ? "input-error"
                    : ""
                } ${formik.touched.lastName && !formik.errors.lastName ? "input-valid" : ""}`}
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(
                  formik.touched.lastName && formik.errors.lastName,
                )}
                aria-describedby="lastName-error"
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div id="lastName-error" className="error-message" role="alert">
                  <AlertCircle size={14} />
                  <span>{formik.errors.lastName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Phone Number & Email Address */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                <Phone size={16} className="label-icon" />
                Phone Number (Digits only){" "}
                <span className="required-asterisk">*</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 01123456789"
                className={`form-input ${
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? "input-error"
                    : ""
                } ${formik.touched.phoneNumber && !formik.errors.phoneNumber ? "input-valid" : ""}`}
                value={formik.values.phoneNumber}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    formik.handleChange(e);
                  }
                }}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(
                  formik.touched.phoneNumber && formik.errors.phoneNumber,
                )}
                aria-describedby="phoneNumber-error"
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <div
                  id="phoneNumber-error"
                  className="error-message"
                  role="alert"
                >
                  <AlertCircle size={14} />
                  <span>{formik.errors.phoneNumber}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={16} className="label-icon" />
                Email Address (Must be unique){" "}
                <span className="required-asterisk">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. rahim.islam@example.com"
                className={`form-input ${
                  formik.touched.email && formik.errors.email
                    ? "input-error"
                    : ""
                } ${formik.touched.email && !formik.errors.email ? "input-valid" : ""}`}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(
                  formik.touched.email && formik.errors.email,
                )}
                aria-describedby="email-error"
              />
              {formik.touched.email && formik.errors.email && (
                <div id="email-error" className="error-message" role="alert">
                  <AlertCircle size={14} />
                  <span>{formik.errors.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Event Name & Event Date (dd/mm/yyyy) */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="eventName" className="form-label">
                <Sparkles size={16} className="label-icon" />
                Event Name <span className="required-asterisk">*</span>
              </label>
              <input
                id="eventName"
                name="eventName"
                type="text"
                placeholder="e.g. Annual Community Tech Fest"
                className={`form-input ${
                  formik.touched.eventName && formik.errors.eventName
                    ? "input-error"
                    : ""
                } ${formik.touched.eventName && !formik.errors.eventName ? "input-valid" : ""}`}
                value={formik.values.eventName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(
                  formik.touched.eventName && formik.errors.eventName,
                )}
                aria-describedby="eventName-error"
              />
              {formik.touched.eventName && formik.errors.eventName && (
                <div
                  id="eventName-error"
                  className="error-message"
                  role="alert"
                >
                  <AlertCircle size={14} />
                  <span>{formik.errors.eventName}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="eventDate" className="form-label">
                <Calendar size={16} className="label-icon" />
                Event Date (dd/mm/yyyy){" "}
                <span className="required-asterisk">*</span>
              </label>
              <DatePicker
                id="eventDate"
                name="eventDate"
                value={formik.values.eventDate}
                onChange={handleDateChange}
                onBlur={formik.handleBlur}
                hasError={Boolean(dateError)}
                isValid={isDateValid}
              />
              {dateError && (
                <div
                  id="eventDate-error"
                  className="error-message"
                  role="alert"
                >
                  <AlertCircle size={14} />
                  <span>{dateError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Row 4: Rating (1 - 5) */}
          <div className="form-group">
            <label className="form-label" id="rating-label">
              <Star size={16} className="label-icon" />
              Rating (1 to 5) <span className="required-asterisk">*</span>
            </label>

            <div
              className={`rating-interactive-container ${
                ratingError ? "rating-box-error" : ""
              }`}
              role="radiogroup"
              aria-labelledby="rating-label"
            >
              <div className="star-rating-buttons">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled =
                    (hoverRating || formik.values.rating) >= starValue;
                  const isSelected = formik.values.rating === starValue;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${starValue} out of 5 stars`}
                      className={`star-button ${isFilled ? "star-filled" : "star-empty"} ${
                        isSelected ? "star-selected" : ""
                      }`}
                      onClick={() => handleRatingClick(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        size={28}
                        className={isFilled ? "fill-current" : ""}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Number buttons for direct numeric selection */}
              <div className="rating-number-pills">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`rating-pill-btn ${formik.values.rating === num ? "active" : ""}`}
                    onClick={() => handleRatingClick(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>

              {formik.values.rating ? (
                <span className="rating-status-text">
                  Selected: <strong>{formik.values.rating} / 5</strong>
                  {formik.values.rating === 5 && " - Excellent! 🌟"}
                  {formik.values.rating === 4 && " - Very Good! 👍"}
                  {formik.values.rating === 3 && " - Good / Average 👌"}
                  {formik.values.rating === 2 && " - Needs Improvement ⚠️"}
                  {formik.values.rating === 1 && " - Poor 👎"}
                </span>
              ) : (
                <span className="rating-placeholder-text">
                  Click a star or number (1 to 5)
                </span>
              )}
            </div>

            {ratingError && (
              <div id="rating-error" className="error-message" role="alert">
                <AlertCircle size={14} />
                <span>{ratingError}</span>
              </div>
            )}
          </div>

          {/* Row 5: Feedback Message */}
          <div className="form-group">
            <label htmlFor="feedbackMessage" className="form-label">
              <MessageSquare size={16} className="label-icon" />
              Feedback Message <span className="required-asterisk">*</span>
            </label>
            <textarea
              id="feedbackMessage"
              name="feedbackMessage"
              rows={4}
              placeholder="Please provide your feedback, suggestions, or highlights about the community event..."
              className={`form-textarea ${
                formik.touched.feedbackMessage && formik.errors.feedbackMessage
                  ? "input-error"
                  : ""
              } ${
                formik.touched.feedbackMessage && !formik.errors.feedbackMessage
                  ? "input-valid"
                  : ""
              }`}
              value={formik.values.feedbackMessage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(
                formik.touched.feedbackMessage && formik.errors.feedbackMessage,
              )}
              aria-describedby="feedbackMessage-error"
            ></textarea>
            <div className="textarea-footer">
              {formik.touched.feedbackMessage &&
              formik.errors.feedbackMessage ? (
                <div
                  id="feedbackMessage-error"
                  className="error-message"
                  role="alert"
                >
                  <AlertCircle size={14} />
                  <span>{formik.errors.feedbackMessage}</span>
                </div>
              ) : (
                <div></div>
              )}
              <span className="char-counter">
                {formik.values.feedbackMessage.length} characters
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleReset}
              disabled={formik.isSubmitting}
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formik.isSubmitting}
            >
              <Save size={18} />
              {formik.isSubmitting ? "Saving Feedback..." : "Save Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
