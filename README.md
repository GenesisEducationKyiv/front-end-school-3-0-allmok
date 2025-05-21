# 🎵 Music Track Management App

A single-page application built with React and Vite for managing a personal music track library. It interacts with a provided Node.js backend API to perform CRUD operations, upload audio files, and manage track metadata.

## ✨ Features

*   **Track Listing:** View all tracks in a paginated list on the main page (`/tracks`).
*   **Create Track:** Add new tracks with metadata (title, artist, album, cover image URL, genres) via a modal form.
    *   **Genre Management:** Fetch available genres from the API, display selected genres as tags with removal functionality, and add new genres from the available list.
    *   Client-side validation for required fields and cover image URL format.
*   **Edit Track:** Modify existing track metadata in a pre-filled modal form. Changes are saved to the API.
*   **Delete Track:** Remove tracks individually with a confirmation dialog.
*   **Audio File Upload:** Upload audio files (MP3, WAV, OGG) for existing tracks in a separate modal. Includes validation for file type and size, and an audio preview.
*   **Audio File Deletion:** Remove the associated audio file from a track (metadata remains) with a confirmation dialog.
*   **Audio Playback:**
    *   Play uploaded audio files directly within the track list using WaveSurfer.js.
    *   Only one track plays at a time.
    *   Visual waveform display for playing/loaded tracks.
*   **List Interaction:**
    *   **Pagination:** Navigate through large track lists.
    *   **Sorting:** Sort tracks by creation date, title, artist, or album (ascending/descending).
    *   **Filtering:** Filter tracks by genre or artist using dropdowns.
    *   **Search:** Search tracks by title, artist, or album with debouncing for performance.
*   **Bulk Actions:**
    *   Select multiple tracks using checkboxes.
    *   Delete selected tracks in a single operation with confirmation.
*   **User Experience:**
    *   All create/edit/upload/delete operations happen in **modals** without leaving the main track list view.
    *   **Loading Indicators:** Visual feedback during API requests and data loading.
    *   **Toast Notifications:** Clear feedback for successful operations and errors using `react-hot-toast`.
    *   **Optimistic UI Updates:** Edit, Delete, Delete File, and Bulk Delete operations update the UI instantly for a smoother experience, with rollback on API error.
*   **Styling:** Clean, dark-themed UI with styles organized in a dedicated `src/css` folder.

## 🚀 Tech Stack

*   **Frontend:** React 18, Vite, TypeScript
*   **API Communication:** Axios
*   **State Management:** React Context API (for Audio Player), Component State (`useState`, `useReducer` patterns via custom hooks)
*   **Audio:** WaveSurfer.js (for playback and visualization)
*   **UI/UX:** Modals, `react-hot-toast` (notifications), Custom Hooks, CSS
*   **Development:** NodeJS (v20.13.1 required), npm

## 🔧 Prerequisites

*   **Node.js:** Version `v20.13.1` is required (as specified in the requirements).
*   **npm:** Should be installed with Node.js.
*   **Backend API Server:** The provided Node.js backend server must be running.

## ⚙️ Getting Started

1. **Start API Server** 
The API should typically be available at `http://localhost:8000`.
2. **Install dependencies: (in /app)**
```bash
npm install
```
3. **Run the development server:**
```bash
npm start
```

4. **Open the application:**
    Navigate to `http://localhost:3000` in your browser.
    
## 🧪 Running Tests

*  Run all tests in watch mode:
```bash
npm test
```

* Run all tests with a UI:
```bash
npm run test:ui
```
## 📁 Folder Structure
```
src/
├── __tests__/ #
├── api/ # Axios instance, API service functions (tracks, genres)
├── assets/ # Static assets (e.g., default cover image)
├── components/ # Reusable UI components (Modal, Pagination, GenreTag, etc.)
├── contexts/ # React Context providers (e.g., AudioPlayerContext)
├── css/ # component-specific CSS files
├── features/ # Feature-specific modules (e.g., tracks)
│ └── tracks/
│ ├── components/ # Components specific to the tracks feature
│ │ └── modals/ # Modals specific to track operations
│ └── hooks/ # Custom hooks for track-related logic
├── hooks/ # General reusable custom hooks (e.g., useDebounce)
├── pages/ # Page-level components (e.g., TracksPage)
├── types/ # TypeScript type definitions (e.g., Track, Meta)
├── App.css # Main App component styles
├── App.tsx # Root application component
├── index.css # Global styles and CSS variables
├── main.tsx # Application entry point, renders Root component
└── setupTests.ts # Vitest setup
```
## 🎉 Features Implemented

*   **Bulk Delete:** Functionality to select and delete multiple tracks simultaneously.
*   **Optimistic UI Updates:** Implemented for Edit, Delete, Delete File, and Bulk Delete actions for a smoother user experience.
*   **Audio Waveform Visualization:** Integrated WaveSurfer.js to display waveforms for tracks with audio files.
