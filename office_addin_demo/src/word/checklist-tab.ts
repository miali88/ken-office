/**
 * Checklist Tab - Auto-review CVL Checklists
 */

/* global Word */

import { MOCK_CHECKLIST_OPERATIONS } from './mockChecklistData';
import type { FillChecklistCellOperation } from './types';

/**
 * Initialize the Checklist tab
 */
export function initializeChecklistTab() {
  const autoReviewBtn = document.getElementById('auto-review-checklist-btn');

  if (autoReviewBtn) autoReviewBtn.onclick = handleAutoReviewChecklist;
}

/**
 * Auto-review checklist and populate the "Initials & Date" column
 */
async function handleAutoReviewChecklist() {
  const statusElement = document.getElementById('checklist-status');
  const button = document.getElementById('auto-review-checklist-btn') as HTMLButtonElement;
  const progressContainer = document.getElementById('checklist-progress-container');
  const progressBar = document.getElementById('checklist-progress-bar');
  const progressText = document.getElementById('checklist-progress-text');

  if (!statusElement || !button) {
    alert('Required UI elements not found');
    return;
  }

  // Create live debug log
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

    addLog('🔍 Starting checklist auto-review...');
    if (progressText) progressText.textContent = 'Analyzing checklist table...';
    if (progressBar) progressBar.style.width = '10%';

    // Load mock operations
    addLog(`📦 Loading ${MOCK_CHECKLIST_OPERATIONS.length} checklist review operations...`);
    if (progressBar) progressBar.style.width = '25%';

    // Execute operations
    addLog('✍️ Populating checklist with review data...');
    if (progressText) progressText.textContent = 'Filling checklist cells...';
    if (progressBar) progressBar.style.width = '50%';

    await executeChecklistOperations(MOCK_CHECKLIST_OPERATIONS, (progress) => {
      if (progressBar) {
        progressBar.style.width = `${50 + (progress * 40)}%`;
      }
      addLog(`  ✓ Completed operation ${Math.floor(progress * MOCK_CHECKLIST_OPERATIONS.length)}/${MOCK_CHECKLIST_OPERATIONS.length}`);
    });

    if (progressBar) progressBar.style.width = '100%';
    addLog(`✅ Successfully populated ${MOCK_CHECKLIST_OPERATIONS.length} checklist items!`);

    // Success message
    statusElement.innerHTML = `
      <div style="padding: 12px; background: #e8f5e9; border: 2px solid #4caf50; border-radius: 4px;">
        <div style="color: #2e7d32; font-weight: bold; margin-bottom: 8px;">✅ Checklist auto-review complete!</div>
        <div style="font-size: 13px; color: #1b5e20; margin-bottom: 8px;">
          Populated ${MOCK_CHECKLIST_OPERATIONS.length} items with initials and review comments
        </div>
        <div style="max-height: 200px; overflow-y: auto; font-size: 11px; font-family: monospace; background: white; padding: 8px; border-radius: 4px;">
          ${debugLog.map(line => `<div style="margin: 2px 0;">${line}</div>`).join('')}
        </div>
      </div>
    `;
    if (progressText) progressText.textContent = 'Complete!';

    setTimeout(() => {
      if (progressContainer) progressContainer.style.display = 'none';
    }, 3000);

  } catch (error) {
    console.error('[FATAL ERROR]', error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';

    statusElement.innerHTML = `
      <div style="padding: 12px; background: #ffebee; border: 2px solid #d32f2f; border-radius: 4px;">
        <div style="color: #d32f2f; font-weight: bold; margin-bottom: 8px; font-size: 16px;">❌ AUTO-REVIEW FAILED</div>
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
      progressText.textContent = 'FAILED';
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
 * Execute checklist operations on Word document
 */
async function executeChecklistOperations(
  operations: FillChecklistCellOperation[],
  onProgress?: (progress: number) => void
): Promise<void> {
  return Word.run(async (context) => {
    console.log('[Checklist] Starting execution, count:', operations.length);

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
      console.log(`[Operation ${i + 1}/${operations.length}] Filling checklist cell at row ${operation.row}`);

      try {
        await executeFillChecklistCell(context, operation);
        await context.sync();
        successCount++;

        if (onProgress) {
          onProgress((i + 1) / operations.length);
        }
      } catch (error) {
        failureCount++;
        console.error(`Operation ${i} failed:`, error);
      }
    }

    console.log('[Checklist] Complete:', { total: operations.length, success: successCount, failed: failureCount });
  });
}

/**
 * Execute fillChecklistCell operation
 */
async function executeFillChecklistCell(
  context: Word.RequestContext,
  operation: FillChecklistCellOperation
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
  const insertedRange = cell.body.insertText(operation.value, Word.InsertLocation.start);

  // Add comment with checklist metadata
  try {
    const commentText = buildChecklistCommentText(operation);
    // Insert comment on the text range, not the cell body
    insertedRange.insertComment(commentText);
    console.log('Comment added successfully to cell:', operation.row, operation.cell);
  } catch (e) {
    console.warn('Could not add comment to checklist cell:', e);
  }
}

/**
 * Build comment text with checklist metadata
 */
function buildChecklistCommentText(operation: FillChecklistCellOperation): string {
  const lines: string[] = [];
  const metadata = operation.checklistMetadata;

  // Header
  lines.push('🤖 Kenneth AI - Checklist Auto-Review');
  lines.push('');

  // Status
  lines.push(`Status: ${metadata.status}`);
  lines.push('');

  // Commentary
  lines.push('Commentary:');
  lines.push(metadata.commentary);
  lines.push('');

  // References
  if (metadata.references && metadata.references.length > 0) {
    lines.push('References:');
    metadata.references.forEach(ref => {
      lines.push(`  • ${ref}`);
    });
    lines.push('');
  }

  // Footer
  lines.push('---');
  lines.push('Generated by Kenneth AI (Demo Mode)');
  lines.push('💡 Using mock data from mockChecklistData.ts');

  return lines.join('\n');
}

/**
 * Get Checklist tab HTML
 */
export function getChecklistTabHTML(): string {
  return `
    <div id="checklist-tab" class="tab-content" style="display: none; flex: 1; background: white; padding: 20px; overflow: auto; flex-direction: column;">
      <div style="max-width: 600px; width: 100%; margin: 0 auto;">
        <h3 style="margin-bottom: 8px; color: #333;">✅ Checklist Auto-Review</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
          Automatically populate the checklist "Initials & Date" column with review data
        </p>

        <!-- Instructions -->
        <div style="margin-bottom: 20px; padding: 12px; background: #f0f7ff; border-left: 3px solid #2196F3; border-radius: 4px;">
          <div style="font-weight: 600; color: #1976D2; margin-bottom: 4px;">📋 How it works:</div>
          <div style="font-size: 13px; color: #424242; line-height: 1.6;">
            1. Ensure your document contains a checklist table<br>
            2. Click "Auto-review Checklist" below<br>
            3. The add-in will populate the "Initials & Date" column<br>
            4. Each cell will have a comment with status, commentary, and references
          </div>
        </div>

        <!-- Action Button -->
        <div style="margin-bottom: 20px;">
          <button id="auto-review-checklist-btn" style="width: 100%; padding: 14px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">
            🔍 Auto-review Checklist
          </button>
        </div>

        <!-- Progress Bar -->
        <div id="checklist-progress-container" style="display: none; margin-bottom: 16px;">
          <div id="checklist-progress-text" style="font-size: 13px; color: #666; margin-bottom: 8px;">Processing...</div>
          <div style="width: 100%; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden;">
            <div id="checklist-progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); transition: width 0.3s ease;"></div>
          </div>
        </div>

        <!-- Status Display -->
        <div id="checklist-status">
          <!-- Populated by JavaScript -->
        </div>
      </div>
    </div>
  `;
}
