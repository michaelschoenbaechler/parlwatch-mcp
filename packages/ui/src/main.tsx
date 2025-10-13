import React from 'react';
import ReactDOM from 'react-dom/client';
import { VoteWidget, WidgetState } from './components/VoteWidget';

// Allow other scripts to hydrate/update later
declare global {
  interface Window {
    __INITIAL_WIDGET_STATE__?: WidgetState;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <VoteWidget initialState={window.__INITIAL_WIDGET_STATE__} />
  </React.StrictMode>
);
