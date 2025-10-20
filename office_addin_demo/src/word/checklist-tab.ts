/**
 * Checklist Tab - Auto-review CVL Checklists
 */

/* global Word */

import { MOCK_CHECKLIST_OPERATIONS } from './mockChecklistData';
import { MOCK_PERIODIC_CASE_REVIEW_OPERATIONS } from './mockPeriodicCaseReviewData';
import { detectDocumentType, getDocumentTypeName } from './document-detector';
import { executeChecklistOperations } from './checklist-executor';
import { executePeriodicCaseReviewOperations } from './periodic-case-review-executor';
import { DocumentType } from './types';
import type { FillChecklistCellOperation, DocumentOperation } from './types';

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
    console.error('Required UI elements not found');
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
    if (progressText) progressText.textContent = 'Detecting document type...';
    if (progressBar) progressBar.style.width = '5%';

    // Detect document type
    const docType = await detectDocumentType();
    const docTypeName = getDocumentTypeName(docType);
    addLog(`📄 Detected document type: ${docTypeName}`);
    if (progressBar) progressBar.style.width = '15%';

    // Check if document type is supported
    if (docType === DocumentType.UNKNOWN) {
      throw new Error('Unable to detect document type. Please ensure you have opened either a Checklist 3 or Periodic Case Review document.');
    }

    // Load appropriate mock operations based on document type
    let operations: DocumentOperation[];
    if (docType === DocumentType.CHECKLIST_3) {
      operations = MOCK_CHECKLIST_OPERATIONS;
      addLog(`📦 Loading ${operations.length} Checklist 3 review operations...`);
    } else if (docType === DocumentType.PERIODIC_CASE_REVIEW) {
      operations = MOCK_PERIODIC_CASE_REVIEW_OPERATIONS;
      addLog(`📦 Loading ${operations.length} Periodic Case Review operations...`);
    } else {
      throw new Error(`Unsupported document type: ${docType}`);
    }
    if (progressBar) progressBar.style.width = '25%';

    // Execute operations based on document type
    addLog('✍️ Populating document with review data...');
    if (progressText) progressText.textContent = 'Filling document fields...';
    if (progressBar) progressBar.style.width = '50%';

    if (docType === DocumentType.CHECKLIST_3) {
      await executeChecklistOperations(operations as FillChecklistCellOperation[], (progress) => {
        if (progressBar) {
          progressBar.style.width = `${50 + (progress * 40)}%`;
        }
        addLog(`  ✓ Completed operation ${Math.floor(progress * operations.length)}/${operations.length}`);
      });
    } else if (docType === DocumentType.PERIODIC_CASE_REVIEW) {
      await executePeriodicCaseReviewOperations(operations, (progress) => {
        if (progressBar) {
          progressBar.style.width = `${50 + (progress * 40)}%`;
        }
        addLog(`  ✓ Completed operation ${Math.floor(progress * operations.length)}/${operations.length}`);
      });
    }

    if (progressBar) progressBar.style.width = '100%';
    addLog(`✅ Successfully populated ${operations.length} items in ${docTypeName}!`);

    // Success message
    statusElement.innerHTML = `
      <div style="padding: 12px; background: #e8f5e9; border: 2px solid #4caf50; border-radius: 4px;">
        <div style="color: #2e7d32; font-weight: bold; margin-bottom: 8px;">✅ Checklist auto-review complete!</div>
        <div style="font-size: 13px; color: #1b5e20; margin-bottom: 4px;">
          <strong>Document Type:</strong> ${docTypeName}
        </div>
        <div style="font-size: 13px; color: #1b5e20; margin-bottom: 8px;">
          Populated ${operations.length} items with initials and review comments
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
            1. Open either a <strong>Checklist 3</strong> or <strong>Periodic Case Review</strong> document<br>
            2. Click "Auto-review Checklist" below<br>
            3. The add-in will detect your document type automatically<br>
            4. All fields will be populated with synthetic review data<br>
            5. Each entry will have a comment with status, commentary, and references
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
