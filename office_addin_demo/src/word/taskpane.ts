/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

import { mountChatApp } from './chat-app';
import { handleAIRewrite } from './ai-rewrite';
import { handleStructuredAIRewrite } from './ai-rewrite-structured';

let chatMounted = false;

Office.onReady((info) => {
  console.log('🚀 Office.onReady fired!', info);

  if (info.host === Office.HostType.Word) {
    console.log('✅ Host is Word, initializing...');

    const sideloadMsg = document.getElementById("sideload-msg");
    const appBody = document.getElementById("app-body");
    const aiAutofillBtn = document.getElementById("ai-autofill-btn");
    const aiRewriteBtn = document.getElementById("ai-rewrite-btn");

    console.log('📦 Elements found:', { sideloadMsg, appBody, aiAutofillBtn, aiRewriteBtn });

    if (sideloadMsg) sideloadMsg.style.display = "none";
    if (appBody) appBody.style.display = "flex";
    if (aiAutofillBtn) aiAutofillBtn.onclick = handleAIAutofill;
    // Use structured operations mode for better table support
    if (aiRewriteBtn) aiRewriteBtn.onclick = handleStructuredAIRewrite;

    // Make insertPlaceholderValue globally available
    (window as any).insertPlaceholderValue = insertPlaceholderValue;

    // Setup tab switching
    console.log('🔧 Setting up tabs...');
    setupTabs();
    console.log('✅ Tabs setup complete');
  } else {
    console.error('❌ Host is not Word:', info.host);
  }
});

function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  console.log('🔍 Found tab buttons:', tabButtons.length);
  console.log('🔍 Found tab contents:', tabContents.length);

  tabButtons.forEach((button, index) => {
    console.log(`🔘 Setting up tab button ${index}:`, button.getAttribute('data-tab'));

    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      console.log('🖱️ Tab clicked:', targetTab);

      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        (btn as HTMLElement).style.background = '#1e1e1e';
        (btn as HTMLElement).style.color = '#999';
      });

      tabContents.forEach(content => {
        content.classList.remove('active');
        (content as HTMLElement).style.display = 'none';
      });

      // Add active class to clicked button
      button.classList.add('active');
      (button as HTMLElement).style.background = '#2d2d2d';
      (button as HTMLElement).style.color = 'white';

      // Show the corresponding tab content
      const targetContent = document.getElementById(`${targetTab}-tab`);
      console.log('📋 Target content element:', targetContent);

      if (targetContent) {
        targetContent.classList.add('active');
        targetContent.style.display = 'flex';
        console.log('✅ Tab content displayed:', targetTab);
      } else {
        console.error('❌ Tab content not found:', `${targetTab}-tab`);
      }

      // Mount React chat app when AI Chat tab is activated
      if (targetTab === 'ai-chat' && !chatMounted) {
        console.log('🚀 Mounting React chat app...');
        chatMounted = true;
        try {
          mountChatApp('cmfivedyx0001c96zlzkskb7b');
          console.log('✅ React chat mounted');
        } catch (error) {
          console.error('❌ Error mounting chat:', error);
        }
      }
    });
  });
}

async function handleAIAutofill() {
  const statusElement = document.getElementById("autofill-status");
  const resultsElement = document.getElementById("autofill-results");
  const button = document.getElementById("ai-autofill-btn") as HTMLButtonElement;

  if (!statusElement || !resultsElement || !button) {
    console.error("Required elements not found");
    return;
  }

  try {
    // Disable button and show loading
    button.disabled = true;
    statusElement.textContent = "Analyzing document...";
    resultsElement.innerHTML = "";

    // Get document content and placeholders
    const documentData = await Word.run(async (context) => {
      context.document.body.load('text');
      await context.sync();

      const documentText = context.document.body.text;

      // Extract placeholders
      const placeholderRegex = /\{\{([^}]+)\}\}/g;
      const placeholders = [];
      let match;
      while ((match = placeholderRegex.exec(documentText)) !== null) {
        placeholders.push(match[1]); // Just the placeholder name without {{ }}
      }

      return {
        documentText,
        placeholders: [...new Set(placeholders)]
      };
    });

    console.log('[AI Autofill] Document data:', documentData);

    // Call the doc-gen API
    statusElement.textContent = "Searching case files...";

    const caseId = 'cmfivedyx0001c96zlzkskb7b'; // TODO: Make this dynamic
    const response = await fetch(`https://localhost:3001/api/cases/${caseId}/doc-gen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentText: documentData.documentText,
        placeholders: documentData.placeholders
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('[AI Autofill] API response:', result);

    // Display results
    statusElement.textContent = "✓ Analysis complete!";

    if (result.suggestions && result.suggestions.length > 0) {
      const suggestionsHTML = result.suggestions.map((suggestion: any) => `
        <div style="padding: 12px; margin-bottom: 8px; background: #f5f5f5; border-radius: 6px; border-left: 4px solid #667eea;">
          <div style="font-weight: bold; color: #333; margin-bottom: 4px;">${suggestion.placeholder}</div>
          <div style="color: #666; font-size: 14px;">${suggestion.suggestedValue || 'No suggestion found'}</div>
          ${suggestion.source ? `<div style="color: #999; font-size: 12px; margin-top: 4px;">Source: ${suggestion.source}</div>` : ''}
        </div>
      `).join('');

      resultsElement.innerHTML = suggestionsHTML;
    } else {
      resultsElement.innerHTML = '<div style="color: #999; text-align: center;">No suggestions found</div>';
    }

  } catch (error) {
    console.error('[AI Autofill] Error:', error);
    statusElement.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    statusElement.style.color = '#d32f2f';
  } finally {
    button.disabled = false;
  }
}

export async function findPlaceholders() {
  return Word.run(async (context) => {
    // Load the document body text
    context.document.body.load('text');

    await context.sync();

    // Get the document text
    const documentText = context.document.body.text;

    // Regular expression to find placeholders in format {{placeholder}}
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    const placeholders = [];
    let match;

    // Find all matches
    while ((match = placeholderRegex.exec(documentText)) !== null) {
      placeholders.push(match[0]); // Full match including {{ }}
    }

    // Remove duplicates and display results
    const uniquePlaceholders = [...new Set(placeholders)];
    displayPlaceholders(uniquePlaceholders);
  });
}

function displayPlaceholders(placeholders: string[]) {
  const resultsElement = document.getElementById("placeholder-results");
  const countElement = document.getElementById("placeholder-count");

  if (placeholders.length === 0) {
    countElement.textContent = "No placeholders found in the document.";
    resultsElement.innerHTML = "";
  } else {
    countElement.textContent = `Found ${placeholders.length} unique placeholder(s):`;
    resultsElement.innerHTML = placeholders.map((placeholder, index) =>
      `<li class="ms-ListItem placeholder-item">
        <div class="placeholder-label">
          <span class="ms-font-m">${placeholder}</span>
        </div>
        <div class="placeholder-input">
          <input type="text" id="input-${index}" class="ms-TextField-field" placeholder="Enter replacement value" />
          <button class="ms-Button ms-Button--primary insert-btn" onclick="insertPlaceholderValue('${placeholder}', 'input-${index}')">
            <span class="ms-Button-label">Insert</span>
          </button>
        </div>
      </li>`
    ).join('');
  }
}

export async function insertPlaceholderValue(placeholder: string, inputId: string) {
  const inputElement = document.getElementById(inputId) as HTMLInputElement;
  const newValue = inputElement.value.trim();

  if (!newValue) {
    // Show error in placeholder instead of alert
    inputElement.style.borderColor = 'red';
    inputElement.placeholder = '⚠️ Please enter a value';
    setTimeout(() => {
      inputElement.style.borderColor = '';
      inputElement.placeholder = 'Enter replacement value';
    }, 2000);
    return;
  }

  return Word.run(async (context) => {
    // Enable track changes
    context.document.changeTrackingMode = Word.ChangeTrackingMode.trackAll;

    // Try multiple approaches to set the author
    try {
      context.document.properties.author = "Kenneth AI";
      context.document.properties.load('author');
    } catch (e) {
      console.log("Could not set document author:", e);
    }

    await context.sync();

    // Search for all instances of the placeholder
    const searchResults = context.document.body.search(placeholder, { matchCase: true, matchWholeWord: false });
    context.load(searchResults, 'items');

    await context.sync();

    let firstReplacedRange = null;

    // Replace all instances and keep track of the first one
    for (let i = 0; i < searchResults.items.length; i++) {
      const replacedRange = searchResults.items[i].insertText(newValue, Word.InsertLocation.replace);
      if (i === 0) {
        firstReplacedRange = replacedRange;
      }

      // Add a comment to identify this as a Kenneth AI change
      try {
        replacedRange.insertComment(`Replaced "${placeholder}" with "${newValue}" by Kenneth AI`);
      } catch (e) {
        console.log("Could not add comment:", e);
      }
    }

    await context.sync();

    // Scroll to the first replaced text location by selecting it
    if (firstReplacedRange) {
      firstReplacedRange.select();
      await context.sync();
    }

    // Clear the input field and show success message
    inputElement.value = "";
    inputElement.placeholder = "✓ Inserted successfully";
    setTimeout(() => {
      inputElement.placeholder = "Enter replacement value";
    }, 2000);

    // Refresh the placeholder list to show remaining placeholders
    setTimeout(() => {
      findPlaceholders();
    }, 500);
  });
}
