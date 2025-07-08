import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { AudioPlayerProvider } from '../src/contexts/AudioPlayerProvider';
import '../src/index.css';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <React.StrictMode>
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <AudioPlayerProvider>
            {children}
          </AudioPlayerProvider>
        </BrowserRouter>
      </MockedProvider>
    </React.StrictMode>
  );
};

export default TestWrapper;