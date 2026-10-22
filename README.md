# Community Event Feedback Portal

A web application developed for community members to submit feedback about community events and view previously submitted records. Built with **React**, **Formik**, **Yup**, and **Vite**, with client-side **`localStorage`** persistence.

---

## 🌟 Features

### 1. Feedback Submission Page
Contains a feedback submission form with the following required fields:
- **First Name**: Text input
- **Last Name**: Text input
- **Phone Number**: Digits-only numeric validation
- **Email Address**: Valid email format & checked for uniqueness against existing submissions
- **Event Name**: Text input
- **Event Date**: Date picker
- **Rating**: Number between 1 and 5 (with visual interactive star selector & numeric pills)
- **Feedback Message**: Multi-line textarea

### 2. Feedback Display Page
- Reads submitted feedback directly from `localStorage`.
- Presents records in a structured, readable card layout with star badges, event tags, reviewer details, and formatted timestamps.
- **Search & Filter**: Search by event, author, or keywords, filter by star ratings (1 to 5), and sort by newest, oldest, or rating score.
- **Data Safety**: Appends new submissions to `localStorage` without overwriting existing entries.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Form Management**: [Formik](https://formik.org/)
- **Validation**: [Yup](https://github.com/jquense/yup)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Browser `localStorage` (no backend required)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Run Linter
```bash
npm run lint
```
