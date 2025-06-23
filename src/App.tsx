import TracksPage from './pages/TracksPage'; 
import './App.css'; 
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      
      <div data-testid="toast-container">
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            duration: 4000,
          }}
        /> 
      </div>
      <TracksPage />

    </div>
  );
}
export default App;