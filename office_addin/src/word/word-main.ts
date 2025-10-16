/**
 * Word-specific functionality
 * Main module for Word add-in features - FULL FUNCTIONALITY
 */

/* global document, Office, Word */

import * as Diff from 'diff';
import { handleStructuredAIRewrite } from './ai-rewrite-structured';

interface ParagraphChange {
  type: 'insert' | 'delete' | 'replace' | 'equal';
  paragraphIndex: number;
  originalText?: string;
  newText?: string;
}

interface PlaceholderReplacement {
  placeholder: string;
  value: string;
  confidence: 'high' | 'medium' | 'low';
  source?: string;
}

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

  // Setup button handlers
  const aiRewriteBtn = document.getElementById('ai-rewrite-btn');
  const aiAutofillBtn = document.getElementById('ai-autofill-btn');
  const testPingBtn = document.getElementById('test-ping-btn');

  if (aiRewriteBtn) aiRewriteBtn.onclick = handleStructuredAIRewrite; // ← Use structured operations mode
  if (aiAutofillBtn) aiAutofillBtn.onclick = handleAIAutofill;
  if (testPingBtn) testPingBtn.onclick = handleTestPing;

  console.log('[Word] All handlers wired up');
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
 * Show notification (replaces alert)
 */
function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px;
    padding: 16px 24px; border-radius: 8px;
    color: white; font-weight: 600; z-index: 9999;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Test backend connection
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

  // Test 2: Localhost variations
  const urlsToTest = [
    "/api/word-agent/rewrite",
    "https://localhost:3000/api/word-agent/rewrite",
    "http://localhost:3001/api/word-agent/rewrite",
  ];

  resultElement.textContent += "TEST 2: Localhost variations\n";

  for (const url of urlsToTest) {
    resultElement.textContent += `\nTrying: ${url}\n`;

    try {
      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: "Test",
          caseId: "test",
          instructions: "Test"
        })
      });

      const elapsed = Date.now() - startTime;
      resultElement.textContent += `  ✅ Connected! (${elapsed}ms)\n`;
      resultElement.textContent += `  Status: ${response.status}\n`;

      const text = await response.text();
      resultElement.textContent += `  Response: ${text.substring(0, 100)}\n`;

      if (response.ok) {
        resultElement.textContent += `\n🎉 SUCCESS! Use this URL: ${url}\n`;
        break;
      }
    } catch (error) {
      resultElement.textContent += `  ❌ Failed: ${error instanceof Error ? error.message : 'Unknown'}\n`;
    }
  }

  // Test 3: Environment info
  resultElement.textContent += `\n\nTEST 3: Environment info\n`;
  resultElement.textContent += `Current origin: ${window.location.origin}\n`;
  resultElement.textContent += `Current URL: ${window.location.href}\n`;
  resultElement.textContent += `Protocol: ${window.location.protocol}\n`;

  button.disabled = false;
}

/**
 * AI Autofill handler
 */
async function handleAIAutofill() {
  const statusElement = document.getElementById("autofill-status");
  const resultsElement = document.getElementById("autofill-results");
  const button = document.getElementById("ai-autofill-btn") as HTMLButtonElement;

  if (!statusElement || !resultsElement || !button) {
    showNotification("Required elements not found", "error");
    return;
  }

  try {
    button.disabled = true;
    statusElement.textContent = "Analyzing document...";
    resultsElement.innerHTML = "";

    const documentData = await Word.run(async (context) => {
      context.document.body.load('text');
      await context.sync();

      const documentText = context.document.body.text;
      const placeholderRegex = /\{\{([^}]+)\}\}/g;
      const placeholders = [];
      let match;
      while ((match = placeholderRegex.exec(documentText)) !== null) {
        placeholders.push(match[1]);
      }

      return {
        documentText,
        placeholders: [...new Set(placeholders)]
      };
    });

    statusElement.textContent = "Searching case files...";

    const caseId = 'cmfivedyx0001c96zlzkskb7b';
    const response = await fetch(`/api/cases/${caseId}/doc-gen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: documentData.documentText,
        placeholders: documentData.placeholders
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();

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
      showNotification("Autofill complete!", "success");
    } else {
      resultsElement.innerHTML = '<div style="color: #999; text-align: center;">No suggestions found</div>';
    }

  } catch (error) {
    console.error('[AI Autofill] Error:', error);
    statusElement.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    statusElement.style.color = '#d32f2f';
    showNotification("Autofill failed", "error");
  } finally {
    button.disabled = false;
  }
}

/**
 * AI Rewrite handler
 */
async function handleAIRewrite(): Promise<void> {
  const statusElement = document.getElementById("rewrite-status");
  const progressContainer = document.getElementById("progress-container");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  const button = document.getElementById("ai-rewrite-btn") as HTMLButtonElement;

  if (!statusElement || !button) {
    showNotification("Required UI elements not found", "error");
    return;
  }

  try {
    button.disabled = true;
    if (progressContainer) progressContainer.style.display = 'block';
    statusElement.textContent = "📖 Reading entire document...";
    if (progressText) progressText.textContent = "Step 1/4: Extracting document";

    const originalText = await extractFullDocument();
    statusElement.textContent = `📖 Document read (${originalText.length} chars)`;

    statusElement.textContent = "🤖 Analyzing document...";
    if (progressText) progressText.textContent = "Step 2/4: AI analysis";
    if (progressBar) (progressBar as HTMLElement).style.width = '25%';

    const response = await sendToBackend(originalText);

    if (response.replacements && response.replacements.length > 0) {
      statusElement.textContent = `✅ Found ${response.replacements.length} placeholders to fill`;

      statusElement.textContent = "✍️ Applying replacements with track changes...";
      if (progressText) progressText.textContent = "Step 3/3: Applying replacements";
      if (progressBar) (progressBar as HTMLElement).style.width = '50%';

      await applyStructuredReplacements(response.replacements);
      if (progressBar) (progressBar as HTMLElement).style.width = '100%';

    } else {
      const modifiedText = response.modifiedDocument || '';
      statusElement.textContent = `✅ AI response received (${modifiedText.length} chars)`;

      statusElement.textContent = "🔍 Computing differences...";
      if (progressText) progressText.textContent = "Step 3/4: Computing differences";
      if (progressBar) (progressBar as HTMLElement).style.width = '50%';

      const changes = computeParagraphDiff(originalText, modifiedText);

      statusElement.textContent = "✍️ Applying changes with track changes...";
      if (progressText) progressText.textContent = "Step 4/4: Applying changes";
      if (progressBar) (progressBar as HTMLElement).style.width = '75%';

      await applyChangesWithTrackChanges(changes);
    }

    statusElement.textContent = "✅ Document rewritten successfully!";
    if (progressText) progressText.textContent = "Complete!";
    if (progressBar) (progressBar as HTMLElement).style.width = '100%';

    showNotification("Document rewritten successfully!", "success");

    setTimeout(() => {
      if (progressContainer) progressContainer.style.display = 'none';
    }, 3000);

  } catch (error) {
    console.error('[AI Rewrite] Error:', error);
    let errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
      errorMessage += ' (Cannot reach backend - is it running on port 3001?)';
    }

    statusElement.textContent = `❌ Error: ${errorMessage}`;
    statusElement.style.color = '#d32f2f';
    showNotification("Rewrite failed", "error");
  } finally {
    button.disabled = false;
  }
}

async function extractFullDocument(): Promise<string> {
  return Word.run(async (context) => {
    context.document.body.load('text');
    await context.sync();
    return context.document.body.text;
  });
}

async function sendToBackend(documentText: string): Promise<{ replacements?: PlaceholderReplacement[], modifiedDocument?: string }> {
  const caseId = 'cmfivedyx0001c96zlzkskb7b';
  const url = `/api/word-agent/rewrite`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      documentText,
      caseId,
      instructions: 'Identify and fill all placeholders with accurate case information'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API ${response.status}: ${errorText.substring(0, 200)}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || 'Backend processing failed');
  }

  return {
    replacements: result.replacements,
    modifiedDocument: result.modifiedDocument
  };
}

async function applyStructuredReplacements(replacements: PlaceholderReplacement[]): Promise<void> {
  return Word.run(async (context) => {
    context.document.changeTrackingMode = Word.ChangeTrackingMode.trackAll;

    try {
      context.document.properties.author = "Kenneth AI";
      context.document.properties.load('author');
    } catch (e) {
      console.warn("Could not set document author:", e);
    }

    await context.sync();

    for (let i = 0; i < replacements.length; i++) {
      const replacement = replacements[i];

      try {
        const searchResults = context.document.body.search(replacement.placeholder, {
          matchCase: false,
          matchWholeWord: false
        });

        context.load(searchResults, 'items');
        await context.sync();

        if (searchResults.items.length === 0) {
          console.warn(`Placeholder not found: "${replacement.placeholder}"`);
          continue;
        }

        for (let j = 0; j < searchResults.items.length; j++) {
          const range = searchResults.items[j];
          range.insertText(replacement.value, Word.InsertLocation.replace);

          try {
            range.insertComment(
              `Kenneth AI replaced "${replacement.placeholder}" with "${replacement.value}"\n` +
              `Confidence: ${replacement.confidence}\n` +
              (replacement.source ? `Source: ${replacement.source}` : '')
            );
          } catch (e) {
            console.warn('Could not add comment:', e);
          }
        }

        await context.sync();

      } catch (error) {
        console.error(`Failed to replace ${replacement.placeholder}:`, error);
      }
    }
  });
}

function computeParagraphDiff(originalText: string, modifiedText: string): ParagraphChange[] {
  const originalParagraphs = originalText.split(/\r?\n/);
  const modifiedParagraphs = modifiedText.split(/\r?\n/);

  const diffResult = Diff.diffArrays(originalParagraphs, modifiedParagraphs);

  const changes: ParagraphChange[] = [];
  let paragraphIndex = 0;

  for (const change of diffResult) {
    if (change.removed) {
      for (const paragraph of change.value) {
        changes.push({
          type: 'delete',
          paragraphIndex,
          originalText: paragraph
        });
        paragraphIndex++;
      }
    } else if (change.added) {
      for (const paragraph of change.value) {
        changes.push({
          type: 'insert',
          paragraphIndex,
          newText: paragraph
        });
      }
    } else {
      paragraphIndex += change.value.length;
    }
  }

  return changes;
}

async function applyChangesWithTrackChanges(changes: ParagraphChange[]): Promise<void> {
  return Word.run(async (context) => {
    context.document.changeTrackingMode = Word.ChangeTrackingMode.trackAll;

    try {
      context.document.properties.author = "Kenneth AI";
      context.document.properties.load('author');
    } catch (e) {
      console.warn("Could not set document author:", e);
    }

    await context.sync();

    const paragraphs = context.document.body.paragraphs;
    paragraphs.load('items');
    await context.sync();

    const reversedChanges = [...changes].reverse();

    for (let i = 0; i < reversedChanges.length; i++) {
      const change = reversedChanges[i];

      try {
        if (change.type === 'delete') {
          await applyDelete(context, paragraphs, change);
        } else if (change.type === 'insert') {
          await applyInsert(context, paragraphs, change);
        } else if (change.type === 'replace') {
          await applyReplace(context, paragraphs, change);
        }

        await context.sync();
      } catch (error) {
        console.error(`Failed to apply change ${i}:`, error);
      }
    }
  });
}

async function applyDelete(
  context: Word.RequestContext,
  paragraphs: Word.ParagraphCollection,
  change: ParagraphChange
): Promise<void> {
  const paragraph = paragraphs.items[change.paragraphIndex];
  if (paragraph) {
    paragraph.delete();
  }
}

async function applyInsert(
  context: Word.RequestContext,
  paragraphs: Word.ParagraphCollection,
  change: ParagraphChange
): Promise<void> {
  const paragraph = paragraphs.items[change.paragraphIndex];

  if (paragraph) {
    paragraph.insertParagraph(change.newText || '', Word.InsertLocation.before);
  } else {
    context.document.body.insertParagraph(change.newText || '', Word.InsertLocation.end);
  }
}

async function applyReplace(
  context: Word.RequestContext,
  paragraphs: Word.ParagraphCollection,
  change: ParagraphChange
): Promise<void> {
  const paragraph = paragraphs.items[change.paragraphIndex];

  if (paragraph) {
    paragraph.insertParagraph(change.newText || '', Word.InsertLocation.after);
    paragraph.delete();
  }
}

/**
 * Get Word HTML template
 */
function getWordHTML(): string {
  return `
    <div style="width: 100%; height: 100vh; display: flex; flex-direction: column; background: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <!-- Tab Navigation -->
      <div style="display: flex; background: #1e1e1e; border-bottom: 1px solid #666;">
        <button class="tab-button active" data-tab="drafting" style="flex: 1; padding: 12px; background: #2d2d2d; color: white; border: none; cursor: pointer;">Drafting</button>
        <button class="tab-button" data-tab="ai-chat" style="flex: 1; padding: 12px; background: #1e1e1e; color: #999; border: none; cursor: pointer;">AI Chat</button>
      </div>

      <!-- Drafting Tab Content -->
      <div id="drafting-tab" class="tab-content active" style="display: flex; flex: 1; background: white; padding: 20px; overflow: auto; flex-direction: column; align-items: center; justify-content: flex-start;">
        <!-- DEBUG: Test Backend Connection -->
        <div style="width: 100%; max-width: 500px; margin-bottom: 20px; padding: 16px; background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px;">
          <h3 style="margin-bottom: 8px; color: #856404;">🔧 Debug Test</h3>
          <button id="test-ping-btn" style="width: 100%; padding: 10px; background: #ffc107; color: #000; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; margin-bottom: 8px;">
            Test Ping Backend (port 3001)
          </button>
          <div id="test-result" style="font-size: 12px; color: #856404; font-family: monospace; white-space: pre-wrap; max-height: 200px; overflow-y: auto;"></div>
        </div>

        <!-- AI Rewrite Section -->
        <div style="width: 100%; max-width: 500px; margin-bottom: 30px;">
          <h3 style="margin-bottom: 12px; color: #333;">🤖 AI Document Rewrite</h3>
          <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
            Send entire document to AI for intelligent rewriting with track changes
          </p>
          <button id="ai-rewrite-btn" style="width: 100%; padding: 14px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">
            ✨ AI Rewrite Document
          </button>
          <div id="rewrite-status" style="margin-top: 12px; text-align: center; color: #666; font-size: 14px;"></div>

          <!-- Progress Bar -->
          <div id="progress-container" style="display: none; margin-top: 16px;">
            <div id="progress-text" style="font-size: 13px; color: #666; margin-bottom: 8px;">Processing...</div>
            <div style="width: 100%; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden;">
              <div id="progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); transition: width 0.3s ease;"></div>
            </div>
          </div>
        </div>



      <!-- AI Chat Tab Content -->
      <div id="ai-chat-tab" class="tab-content" style="display: none; flex: 1; background: white; padding: 20px;">
        <div style="text-align: center; color: #999;">
          <h3>AI Chat</h3>
          <p>Chat functionality will be added in the next phase</p>
        </div>
      </div>
    </div>
  `;
}
