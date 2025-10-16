/**
 * AI Document Rewrite with Structured Operations - SIMPLIFIED VERSION
 *
 * Shows live progress in the UI and catches errors at each step
 */

/* global Word */

import type { DocumentStructure, TableStructure, DocumentOperation } from './types';
import { MOCK_LLM_OPERATIONS } from './mockLLMResponse';

/**
 * Main handler for structured AI document rewrite
 */
export async function handleStructuredAIRewrite(): Promise<void> {
  const statusElement = document.getElementById("rewrite-status");
  const progressContainer = document.getElementById("progress-container");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  const button = document.getElementById("ai-rewrite-btn") as HTMLButtonElement;

  if (!statusElement || !button) {
    alert("Required UI elements not found");
    return;
  }

  // Create live debug log that shows in the UI
  let debugLog: string[] = [];
  const addLog = (message: string, isError = false) => {
    const timestamp = new Date().toLocaleTimeString();
    const logLine = `${timestamp} ${message}`;
    debugLog.push(logLine);
    console.log(logLine);

    // Update UI immediately
    const color = isError ? '#d32f2f' : '#666';
    statusElement.innerHTML = `
      <div style="padding: 12px; background: ${isError ? '#ffebee' : '#f5f5f5'}; border-radius: 4px; border: 1px solid ${isError ? '#ef5350' : '#ddd'};">
        <div style="margin-bottom: 8px; font-weight: bold; color: ${color};">${message}</div>
        <div style="max-height: 200px; overflow-y: auto; font-size: 11px; font-family: monospace; background: white; padding: 8px; border-radius: 4px;">
          ${debugLog.map(line => `<div style="margin: 2px 0;">${line}</div>`).join('')}
        </div>
      </div>
    `;
  };

  try {
    button.disabled = true;
    if (progressContainer) progressContainer.style.display = 'block';

    // =========================================================================
    // STEP 1: Extract document text (SIMPLIFIED - NO TABLES)
    // =========================================================================
    addLog("📖 STEP 1/3: Extracting document text...");
    if (progressText) progressText.textContent = "Step 1/3: Reading document";
    if (progressBar) progressBar.style.width = '10%';

    let structure: DocumentStructure;
    try {
      addLog("  Loading document body...");
      structure = await extractDocumentSimplified();
      addLog(`  ✅ Extracted ${structure.text.length} chars, ${structure.placeholders.length} placeholders`);
      if (progressBar) progressBar.style.width = '33%';
    } catch (extractError) {
      const errMsg = extractError instanceof Error ? extractError.message : String(extractError);
      addLog(`❌ EXTRACTION FAILED: ${errMsg}`, true);
      throw new Error(`Step 1 failed: ${errMsg}`);
    }

    // =========================================================================
    // STEP 2: Load mock AI response (DEMO MODE - NO BACKEND)
    // =========================================================================
    addLog("🤖 STEP 2/3: Loading mock AI response...");
    if (progressText) progressText.textContent = "Step 2/3: AI processing (mock data)";
    if (progressBar) progressBar.style.width = '40%';

    let operations: DocumentOperation[];
    try {
      addLog("  Loading pre-configured operations...");

      operations = await getMockOperations(structure, addLog);

      addLog(`  ✅ Loaded ${operations.length} operations from mock data`);
      if (progressBar) progressBar.style.width = '66%';
    } catch (mockError) {
      const errMsg = mockError instanceof Error ? mockError.message : String(mockError);
      addLog(`❌ MOCK DATA LOADING FAILED: ${errMsg}`, true);
      throw new Error(`Step 2 failed: ${errMsg}`);
    }

    // =========================================================================
    // STEP 3: Execute operations
    // =========================================================================
    addLog("✍️ STEP 3/3: Applying changes to document...");
    if (progressText) progressText.textContent = "Step 3/3: Applying changes";
    if (progressBar) progressBar.style.width = '75%';

    try {
      await executeOperations(operations);
      addLog(`  ✅ Applied all ${operations.length} operations`);
      if (progressBar) progressBar.style.width = '100%';
    } catch (executeError) {
      const errMsg = executeError instanceof Error ? executeError.message : String(executeError);
      addLog(`❌ EXECUTION FAILED: ${errMsg}`, true);
      throw new Error(`Step 3 failed: ${errMsg}`);
    }

    // =========================================================================
    // SUCCESS!
    // =========================================================================
    statusElement.innerHTML = `
      <div style="padding: 12px; background: #e8f5e9; border: 2px solid #4caf50; border-radius: 4px;">
        <div style="color: #2e7d32; font-weight: bold; margin-bottom: 8px;">✅ Document updated successfully!</div>
        <div style="max-height: 200px; overflow-y: auto; font-size: 11px; font-family: monospace; background: white; padding: 8px; border-radius: 4px;">
          ${debugLog.map(line => `<div style="margin: 2px 0;">${line}</div>`).join('')}
        </div>
      </div>
    `;
    if (progressText) progressText.textContent = "Complete!";

    setTimeout(() => {
      if (progressContainer) progressContainer.style.display = 'none';
    }, 3000);

  } catch (error) {
    console.error('[FATAL ERROR]', error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';

    statusElement.innerHTML = `
      <div style="padding: 12px; background: #ffebee; border: 2px solid #d32f2f; border-radius: 4px;">
        <div style="color: #d32f2f; font-weight: bold; margin-bottom: 8px; font-size: 16px;">❌ PROCESS FAILED</div>
        <div style="margin-bottom: 12px; color: #333; font-size: 14px;">${errorMessage}</div>
        <div style="margin-bottom: 12px; max-height: 200px; overflow-y: auto; font-size: 11px; font-family: monospace; background: white; padding: 8px; border-radius: 4px;">
          ${debugLog.map(line => `<div style="margin: 2px 0;">${line}</div>`).join('')}
        </div>
        <details style="margin-top: 8px;">
          <summary style="cursor: pointer; color: #d32f2f; font-size: 12px;">Show stack trace</summary>
          <pre style="font-size: 10px; margin-top: 4px; background: #f5f5f5; padding: 8px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap;">${errorStack || 'No stack trace available'}</pre>
        </details>
      </div>
    `;

    if (progressText) {
      progressText.textContent = "FAILED";
      progressText.style.color = '#d32f2f';
    }

    if (progressBar) {
      (progressBar as HTMLElement).style.background = '#d32f2f';
    }
  } finally {
    button.disabled = false;
  }
}

/**
 * Extract document structure - SIMPLIFIED VERSION (no tables)
 */
async function extractDocumentSimplified(): Promise<DocumentStructure> {
  return Word.run(async (context) => {
    const body = context.document.body;
    body.load('text');
    await context.sync();

    const text = body.text;

    // Extract placeholders
    const placeholderRegex = /\{\{[^}]+\}\}/g;
    const placeholders = Array.from(new Set(text.match(placeholderRegex) || []));

    // Return simple structure WITHOUT tables for now
    return {
      text,
      tables: [],
      placeholders
    };
  });
}

/**
 * Load mock operations (DEMO MODE - NO BACKEND)
 * Simulates what a real AI backend would return
 */
async function getMockOperations(
  structure: DocumentStructure,
  addLog: (msg: string, isError?: boolean) => void
): Promise<DocumentOperation[]> {
  addLog("  📦 Using hardcoded mock data (no backend required)");

  // Simulate realistic network/processing delay for better UX
  await new Promise(resolve => setTimeout(resolve, 800));

  addLog(`  ✅ Mock data contains ${MOCK_LLM_OPERATIONS.length} operations`);
  addLog(`  ℹ️  This is DEMO MODE - edit mockLLMResponse.ts to change operations`);

  return MOCK_LLM_OPERATIONS;
}

/**
 * Execute operations on Word document
 */
async function executeOperations(operations: DocumentOperation[]): Promise<void> {
  return Word.run(async (context) => {
    console.log('[Operations] Starting execution, count:', operations.length);

    // Enable track changes
    context.document.changeTrackingMode = Word.ChangeTrackingMode.trackAll;

    try {
      context.document.properties.author = "Kenneth AI";
      context.document.properties.load('author');
    } catch (e) {
      console.warn("Could not set author:", e);
    }

    await context.sync();

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i];
      console.log(`[Operation ${i + 1}/${operations.length}] Type: ${operation.type}`);

      try {
        switch (operation.type) {
          case 'fillTableCell':
            await executeFillTableCell(context, operation);
            break;
          case 'replacePlaceholder':
            await executeReplacePlaceholder(context, operation);
            break;
          case 'replaceText':
            await executeReplaceText(context, operation);
            break;
          case 'deleteText':
            await executeDeleteText(context, operation);
            break;
          default:
            console.warn(`Unknown operation type:`, operation);
            failureCount++;
            continue;
        }

        await context.sync();
        successCount++;
      } catch (error) {
        failureCount++;
        console.error(`Operation ${i} failed:`, error);
      }
    }

    console.log('[Operations] Complete:', { total: operations.length, success: successCount, failed: failureCount });
  });
}

/**
 * Execute fillTableCell operation
 */
async function executeFillTableCell(
  context: Word.RequestContext,
  operation: Extract<DocumentOperation, { type: 'fillTableCell' }>
): Promise<void> {
  const tables = context.document.body.tables;
  tables.load('items');
  await context.sync();

  if (operation.tableIndex >= tables.items.length) {
    console.warn(`Table ${operation.tableIndex} not found`);
    return;
  }

  const table = tables.items[operation.tableIndex];
  const rows = table.rows;
  rows.load('items');
  await context.sync();

  if (operation.row >= rows.items.length) {
    console.warn(`Row ${operation.row} not found`);
    return;
  }

  const row = rows.items[operation.row];
  const cells = row.cells;
  cells.load('items');
  await context.sync();

  if (operation.cell >= cells.items.length) {
    console.warn(`Cell ${operation.cell} not found`);
    return;
  }

  const cell = cells.items[operation.cell];
  cell.body.clear();
  cell.body.insertText(operation.value, Word.InsertLocation.start);
}

/**
 * Execute replacePlaceholder operation
 */
async function executeReplacePlaceholder(
  context: Word.RequestContext,
  operation: Extract<DocumentOperation, { type: 'replacePlaceholder' }>
): Promise<void> {
  const MAX_SEARCH_LENGTH = 200;
  const isLongPlaceholder = operation.target.length > MAX_SEARCH_LENGTH;

  let searchTerm = operation.target;

  if (isLongPlaceholder) {
    const prefixMatch = operation.target.match(/^(\{\{[\s]*[A-Z_0-9]+[\s]*:)/);
    searchTerm = prefixMatch ? prefixMatch[1] : operation.target.substring(0, 100);
  }

  const searchResults = context.document.body.search(searchTerm, {
    matchCase: false,
    matchWholeWord: false
  });
  searchResults.load('items');
  await context.sync();

  if (searchResults.items.length === 0) {
    console.warn(`Placeholder not found: ${searchTerm}`);
    return;
  }

  let replacedCount = 0;

  if (isLongPlaceholder) {
    for (const result of searchResults.items) {
      try {
        const paragraph = result.paragraphs.getFirst();
        paragraph.load('text');
        await context.sync();

        const paragraphText = paragraph.text;
        const placeholderIndex = paragraphText.indexOf(operation.target);

        if (placeholderIndex !== -1) {
          const newText = paragraphText.substring(0, placeholderIndex) +
                         operation.value +
                         paragraphText.substring(placeholderIndex + operation.target.length);

          paragraph.clear();
          paragraph.insertText(newText, Word.InsertLocation.start);
          replacedCount++;

          if (operation.replaceAll === false) break;
        }
      } catch (expandError) {
        result.insertText(operation.value, Word.InsertLocation.replace);
        replacedCount++;
        if (operation.replaceAll === false) break;
      }
    }
  } else {
    if (operation.replaceAll !== false) {
      for (const result of searchResults.items) {
        result.insertText(operation.value, Word.InsertLocation.replace);
        replacedCount++;
      }
    } else {
      searchResults.items[0].insertText(operation.value, Word.InsertLocation.replace);
      replacedCount = 1;
    }
  }

  console.log(`Replaced ${replacedCount} occurrences`);
}

/**
 * Execute replaceText operation
 */
async function executeReplaceText(
  context: Word.RequestContext,
  operation: Extract<DocumentOperation, { type: 'replaceText' }>
): Promise<void> {
  const searchResults = context.document.body.search(operation.target, {
    matchCase: operation.matchCase || false,
    matchWholeWord: operation.matchWholeWord || false
  });
  searchResults.load('items');
  await context.sync();

  if (searchResults.items.length === 0) {
    console.warn(`Text not found: ${operation.target}`);
    return;
  }

  for (const result of searchResults.items) {
    result.insertText(operation.value, Word.InsertLocation.replace);
  }
}

/**
 * Execute deleteText operation
 */
async function executeDeleteText(
  context: Word.RequestContext,
  operation: Extract<DocumentOperation, { type: 'deleteText' }>
): Promise<void> {
  const searchResults = context.document.body.search(operation.target, {
    matchCase: false,
    matchWholeWord: false
  });
  searchResults.load('items');
  await context.sync();

  if (searchResults.items.length === 0) {
    console.warn(`Text not found: ${operation.target}`);
    return;
  }

  for (const result of searchResults.items) {
    result.delete();
  }
}
