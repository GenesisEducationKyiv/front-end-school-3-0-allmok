import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { AudioPlayerProvider } from '../src/contexts/AudioPlayerProvider';
import '../src/index.css';

import '@material/web/textfield/outlined-text-field.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/button/outlined-button.js';
import '@material/web/chips/chip-set.js';
import '@material/web/icon/icon.js';
import '@material/web/chips/assist-chip.js';
import '@material/web/dialog/dialog.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/checkbox/checkbox.js';

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