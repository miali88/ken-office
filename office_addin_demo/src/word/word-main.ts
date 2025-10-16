/**
 * Word-specific functionality
 * Main module for Word add-in - MODULAR VERSION
 */

/* global document */

import { initializeDraftingTab, getDraftingTabHTML } from './drafting-tab';
import { initializeAIChatTab, getAIChatTabHTML } from './ai-chat-tab';
import { initializeChecklistTab, getChecklistTabHTML } from './checklist-tab';

/**
 * Initialize Word add-in
 */
export function initialize() {
  console.log('[Word] Initializing Word add-in...');

  // Inject HTML into the app container
  const appContainer = document.getElementById('app-container');
  if (appContainer) {
    appContainer.innerHTML = getWordHTML();
    console.log('[Word] HTML injected successfully');
  } else {
    console.error('[Word] app-container not found!');
    return;
  }

  // Setup tab switching
  setupTabs();

  // Initialize each tab module
  initializeDraftingTab();
  initializeAIChatTab();
  initializeChecklistTab();

  console.log('[Word] All tabs initialized');
}

/**
 * Setup tab switching
 */
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Remove active class from all
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        (btn as HTMLElement).style.background = '#1e1e1e';
        (btn as HTMLElement).style.color = '#999';
      });
      tabContents.forEach(content => {
        content.classList.remove('active');
        (content as HTMLElement).style.display = 'none';
      });

      // Activate selected
      button.classList.add('active');
      (button as HTMLElement).style.background = '#2d2d2d';
      (button as HTMLElement).style.color = 'white';

      const targetContent = document.getElementById(`${targetTab}-tab`);
      if (targetContent) {
        targetContent.classList.add('active');
        targetContent.style.display = 'flex';
      }
    });
  });
}

/**
 * Get Word HTML template with all tabs
 */
function getWordHTML(): string {
  return `
    <div style="width: 100%; height: 100vh; display: flex; flex-direction: column; background: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <!-- Tab Navigation -->
      <div style="display: flex; background: #1e1e1e; border-bottom: 1px solid #666;">
        <button class="tab-button active" data-tab="drafting" style="flex: 1; padding: 12px; background: #2d2d2d; color: white; border: none; cursor: pointer; font-weight: 600;">Drafting</button>
        <button class="tab-button" data-tab="checklist" style="flex: 1; padding: 12px; background: #1e1e1e; color: #999; border: none; cursor: pointer; font-weight: 600;">Checklist</button>
        <button class="tab-button" data-tab="ai-chat" style="flex: 1; padding: 12px; background: #1e1e1e; color: #999; border: none; cursor: pointer; font-weight: 600;">AI Chat</button>
      </div>

      <!-- Tab Content Areas -->
      ${getDraftingTabHTML()}
      ${getChecklistTabHTML()}
      ${getAIChatTabHTML()}
    </div>
  `;
}
