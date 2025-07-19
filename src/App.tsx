import { useEffect } from 'react';
import TracksPage from './pages/TracksPage';
import './App.css';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  useEffect(() => {
    document.body.classList.add('dark');
    return () => {
      document.body.classList.remove('dark');
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <div data-testid="toast-container">
          <Toaster
            position="top-right"
            gutter={8}
            containerStyle={{
              top: 20,
              right: 20,
            }}
            toastOptions={{
              className: 'md3-toast',
              duration: 4000,
              success: {
                className: 'md3-toast md3-toast-success',
                duration: 3000,
                ariaProps: {
                  role: 'status',
                  'aria-live': 'polite',
                },
              },
              error: {
                className: 'md3-toast md3-toast-error',
                duration: 5000,
                ariaProps: {
                  role: 'alert',
                  'aria-live': 'assertive',
                },
              },
              loading: {
                className: 'md3-toast md3-toast-info',
                duration: Infinity,
              },
              style: {
              },
            }}
          />
        </div>
        
        <Routes>
          <Route path="/" element={<TracksPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;