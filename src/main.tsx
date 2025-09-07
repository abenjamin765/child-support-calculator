import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initAll } from '@uswds/uswds';
import './index.css';
import App from './App.tsx';

// Initialize USWDS components
initAll();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
