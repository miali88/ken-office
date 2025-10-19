/**
 * Drafting Tab - AI Document Rewrite and Testing
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { handleStructuredAIRewrite } from './ai-rewrite-structured';
import { DraftingTabApp } from './drafting-tab-app';

/**
 * Initialize the Drafting tab
 */
export function initializeDraftingTab() {
  const draftingRoot = document.getElementById('drafting-root');

  if (draftingRoot) {
    const root = createRoot(draftingRoot);
    root.render(
      React.createElement(DraftingTabApp, {
        onStartRewrite: handleStructuredAIRewrite
      })
    );
  }

  // Keep test ping handler if button exists
  const testPingBtn = document.getElementById('test-ping-btn');
  if (testPingBtn) testPingBtn.onclick = handleTestPing;
}

/**
 * Test backend connection (kept for debugging purposes)
 */
async function handleTestPing() {
  const resultElement = document.getElementById("test-result");
  const button = document.getElementById("test-ping-btn") as HTMLButtonElement;

  if (!resultElement || !button) return;

  button.disabled = true;
  resultElement.textContent = "Running comprehensive diagnostics...\n\n";

  // Test 1: Basic fetch capability
  resultElement.textContent += "TEST 1: Basic fetch capability\n";
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const data = await response.json();
    resultElement.textContent += `✅ Fetch works! Got external data: ${data.title}\n\n`;
  } catch (error) {
    resultElement.textContent += `❌ Fetch completely blocked: ${error instanceof Error ? error.message : 'Unknown'}\n`;
    button.disabled = false;
    return;
  }

  // Test 2: Environment info
  resultElement.textContent += `\n\nTEST 2: Environment info\n`;
  resultElement.textContent += `Current origin: ${window.location.origin}\n`;
  resultElement.textContent += `Current URL: ${window.location.href}\n`;
  resultElement.textContent += `Protocol: ${window.location.protocol}\n`;

  button.disabled = false;
}

/**
 * Get Drafting tab HTML
 */
export function getDraftingTabHTML(): string {
  return `
    <div id="drafting-tab" class="tab-content active" style="display: flex; flex: 1; background: white; overflow: auto; flex-direction: column; align-items: center; justify-content: flex-start;">
      <!-- React app will be mounted here -->
      <div id="drafting-root" style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 20px;"></div>
    </div>
  `;
}
