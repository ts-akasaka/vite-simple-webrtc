import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

import PeerProvider from "./components/Providers/PeerProvider";
import DialogProvider from "./components/Providers/DialogProvider";
import ErrorBoundary from "./components/Boundaries/ErrorBoundary";
import App from "./App";
import theme from "./theme";

// Roboto fonts for MUI
// https://mui.com/components/typography/#install-with-npm
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const muiCache = createCache({
  "key": "mui",
  "prepend": true,
});

ReactDOM.render(
  <React.StrictMode>
    <CacheProvider value={muiCache}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <DialogProvider>
          <ErrorBoundary>
            <PeerProvider>
              <App />
            </PeerProvider>
          </ErrorBoundary>
        </DialogProvider>
      </ThemeProvider>
    </CacheProvider>,
  </React.StrictMode>,
  document.getElementById('root')
);
