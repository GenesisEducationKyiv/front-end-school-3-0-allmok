import TracksPage from './pages/TracksPage'; 
import './App.css'; 
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        
        <div data-testid="toast-container">
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              duration: 4000,
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