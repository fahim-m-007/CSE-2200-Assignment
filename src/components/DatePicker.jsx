import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const formatDateToDDMMYYYY = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseDDMMYYYYToDate = (str) => {
  if (!str || typeof str !== 'string') return null;
  const match = str.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
    return date;
  }
  return null;
};

export default function DatePicker({
  id = 'eventDate',
  name = 'eventDate',
  value = '',
  onChange,
  onBlur,
  hasError = false,
  isValid = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const [viewDate, setViewDate] = useState(() => {
    const parsed = parseDDMMYYYYToDate(value);
    return {
      year: parsed ? parsed.getFullYear() : new Date().getFullYear(),
      month: parsed ? parsed.getMonth() : new Date().getMonth(),
    };
  });

  // Close calendar popup on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleOpenCalendar = () => {
    const parsed = parseDDMMYYYYToDate(value) || new Date();
    setViewDate({
      year: parsed.getFullYear(),
      month: parsed.getMonth(),
    });
    setIsOpen(true);
  };

  const handleToggleCalendar = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      handleOpenCalendar();
    } else {
      setIsOpen(false);
    }
  };

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const handleSelectDay = (dayNumber) => {
    const selected = new Date(viewDate.year, viewDate.month, dayNumber);
    const formatted = formatDateToDDMMYYYY(selected);
    if (onChange) {
      onChange(formatted);
    }
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    const today = new Date();
    const formatted = formatDateToDDMMYYYY(today);
    setViewDate({
      year: today.getFullYear(),
      month: today.getMonth(),
    });
    if (onChange) {
      onChange(formatted);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    if (onChange) {
      onChange('');
    }
    setIsOpen(false);
  };

  // Typing formatting: auto-slash for DD/MM/YYYY
  const handleInputChange = (e) => {
    let raw = e.target.value.replace(/[^\d/]/g, '');
    const digits = raw.replace(/\D/g, '');
    let formatted = raw;
    if (!raw.includes('/')) {
      if (digits.length > 4) {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
      } else if (digits.length > 2) {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      } else {
        formatted = digits;
      }
    } else if (digits.length <= 8) {
      if (digits.length >= 5) {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
      } else if (digits.length >= 3) {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      } else {
        formatted = digits;
      }
    }
    if (onChange) {
      onChange(formatted);
    }
  };

  // Generate calendar grid
  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const firstDayIndex = new Date(viewDate.year, viewDate.month, 1).getDay();
  const selectedDateObj = parseDDMMYYYYToDate(value);
  const today = new Date();

  return (
    <div className="custom-datepicker-container" ref={containerRef}>
      <div className="datepicker-input-wrapper">
        <input
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          placeholder="dd/mm/yyyy"
          maxLength={10}
          autoComplete="off"
          className={`form-input datepicker-input ${hasError ? 'input-error' : ''} ${
            isValid ? 'input-valid' : ''
          }`}
          value={value}
          onChange={handleInputChange}
          onBlur={onBlur}
          onClick={handleOpenCalendar}
        />
        <button
          type="button"
          className="datepicker-toggle-btn"
          onClick={handleToggleCalendar}
          title="Open calendar (dd/mm/yyyy)"
          aria-label="Open calendar"
        >
          <CalendarIcon size={18} />
        </button>
      </div>

      {isOpen && (
        <div className="calendar-dropdown-popup" role="dialog" aria-modal="false">
          {/* Calendar Header */}
          <div className="calendar-header">
            <button
              type="button"
              className="cal-nav-btn"
              onClick={handlePrevMonth}
              title="Previous Month"
              aria-label="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="cal-title">
              <strong>{MONTH_NAMES[viewDate.month]}</strong> {viewDate.year}
            </div>
            <button
              type="button"
              className="cal-nav-btn"
              onClick={handleNextMonth}
              title="Next Month"
              aria-label="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="calendar-weekdays">
            {DAYS_OF_WEEK.map((d) => (
              <span key={d} className="cal-weekday">
                {d}
              </span>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div className="calendar-grid">
            {/* Empty slots before first day of month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="cal-day cal-day-empty" />
            ))}

            {/* Days 1 to N */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isSelected =
                selectedDateObj &&
                selectedDateObj.getDate() === dayNum &&
                selectedDateObj.getMonth() === viewDate.month &&
                selectedDateObj.getFullYear() === viewDate.year;

              const isToday =
                today.getDate() === dayNum &&
                today.getMonth() === viewDate.month &&
                today.getFullYear() === viewDate.year;

              return (
                <button
                  key={dayNum}
                  type="button"
                  className={`cal-day cal-day-btn ${isSelected ? 'cal-day-selected' : ''} ${
                    isToday && !isSelected ? 'cal-day-today' : ''
                  }`}
                  onClick={() => handleSelectDay(dayNum)}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Calendar Footer Actions */}
          <div className="calendar-footer">
            <button
              type="button"
              className="cal-action-btn cal-today-btn"
              onClick={handleSelectToday}
            >
              Today
            </button>
            <span className="cal-format-tag">Format: dd/mm/yyyy</span>
            {value && (
              <button
                type="button"
                className="cal-action-btn cal-clear-btn"
                onClick={handleClear}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
