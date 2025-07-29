import type { Preview } from '@storybook/react-vite'

import '@material/web/chips/input-chip.js';


import '../src/material-components.ts'; 

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;