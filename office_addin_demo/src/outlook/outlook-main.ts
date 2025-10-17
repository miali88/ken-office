/**
 * Outlook-specific functionality
 * Main module for Outlook add-in features - React Implementation
 */

/* global document */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import './styles/globals.css';

/**
 * Initialize Outlook add-in
 */
export function initialize() {
  console.log('[Outlook] Initializing Outlook add-in with React...');

  // Get the app container
  const appContainer = document.getElementById('app-container');
  if (!appContainer) {
    console.error('[Outlook] app-container not found!');
    return;
  }

  try {
    // Create React root and render the app
    const root = createRoot(appContainer);
    root.render(React.createElement(App));

    console.log('[Outlook] React app rendered successfully');
  } catch (error) {
    console.error('[Outlook] Error rendering React app:', error);

    // Show error message to user
    appContainer.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #c62828;">
        <h3>Error Loading Outlook Add-in</h3>
        <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    `;
  }
}
