/**
 * Checklist Tab - Document completion checklist
 */

/* global Word */

interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
}

const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'placeholders-filled',
    label: 'All placeholders filled',
    description: 'Verify all {{placeholder}} text has been replaced',
    checked: false
  },
  {
    id: 'tables-completed',
    label: 'Tables completed',
    description: 'Check all table cells contain correct data',
    checked: false
  },
  {
    id: 'dates-verified',
    label: 'Dates verified',
    description: 'Confirm all dates are accurate and formatted correctly',
    checked: false
  },
  {
    id: 'names-correct',
    label: 'Names and entities correct',
    description: 'Verify all company names, director names, and addresses',
    checked: false
  },
  {
    id: 'financial-data',
    label: 'Financial data accurate',
    description: 'Review share capital, shareholding percentages, and other figures',
    checked: false
  },
  {
    id: 'formatting-consistent',
    label: 'Formatting consistent',
    description: 'Check fonts, spacing, and styling throughout',
    checked: false
  },
  {
    id: 'track-changes-reviewed',
    label: 'Track changes reviewed',
    description: 'Accept or reject all tracked changes',
    checked: false
  },
  {
    id: 'final-proofread',
    label: 'Final proofread complete',
    description: 'Read through entire document for errors',
    checked: false
  }
];

let checklistItems: ChecklistItem[] = [...DEFAULT_CHECKLIST_ITEMS];

/**
 * Initialize the Checklist tab
 */
export function initializeChecklistTab() {
  renderChecklist();

  // Add event listeners
  const resetBtn = document.getElementById('reset-checklist-btn');
  const autoCheckBtn = document.getElementById('auto-check-btn');

  if (resetBtn) resetBtn.onclick = handleResetChecklist;
  if (autoCheckBtn) autoCheckBtn.onclick = handleAutoCheck;
}

/**
 * Render the checklist
 */
function renderChecklist() {
  const container = document.getElementById('checklist-items');
  if (!container) return;

  const completedCount = checklistItems.filter(item => item.checked).length;
  const totalCount = checklistItems.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  // Update progress bar
  const progressBar = document.getElementById('checklist-progress-bar');
  const progressText = document.getElementById('checklist-progress-text');

  if (progressBar) {
    (progressBar as HTMLElement).style.width = `${percentage}%`;
    (progressBar as HTMLElement).style.background = percentage === 100
      ? '#10b981'
      : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
  }

  if (progressText) {
    progressText.textContent = `${completedCount} of ${totalCount} completed (${percentage}%)`;
  }

  // Render checklist items
  container.innerHTML = checklistItems.map(item => `
    <div class="checklist-item" style="padding: 12px; margin-bottom: 8px; background: ${item.checked ? '#f0fdf4' : '#f9f9f9'}; border-radius: 6px; border: 1px solid ${item.checked ? '#86efac' : '#e0e0e0'}; cursor: pointer;" data-id="${item.id}">
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="flex-shrink: 0; width: 20px; height: 20px; border-radius: 4px; border: 2px solid ${item.checked ? '#10b981' : '#999'}; background: ${item.checked ? '#10b981' : 'white'}; display: flex; align-items: center; justify-content: center; margin-top: 2px;">
          ${item.checked ? '<span style="color: white; font-size: 14px;">✓</span>' : ''}
        </div>
        <div style="flex: 1;">
          <div style="font-weight: ${item.checked ? '600' : '500'}; color: ${item.checked ? '#059669' : '#333'}; margin-bottom: 4px; text-decoration: ${item.checked ? 'line-through' : 'none'};">
            ${item.label}
          </div>
          ${item.description ? `<div style="font-size: 12px; color: #666; line-height: 1.4;">${item.description}</div>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  // Add click handlers to each item
  container.querySelectorAll('.checklist-item').forEach(element => {
    element.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
      if (id) toggleChecklistItem(id);
    });
  });
}

/**
 * Toggle a checklist item
 */
function toggleChecklistItem(id: string) {
  const item = checklistItems.find(i => i.id === id);
  if (item) {
    item.checked = !item.checked;
    renderChecklist();
  }
}

/**
 * Reset checklist
 */
function handleResetChecklist() {
  checklistItems = checklistItems.map(item => ({ ...item, checked: false }));
  renderChecklist();
  showNotification('Checklist reset', 'info');
}

/**
 * Auto-check for common issues
 */
async function handleAutoCheck() {
  const button = document.getElementById('auto-check-btn') as HTMLButtonElement;
  if (!button) return;

  button.disabled = true;
  button.textContent = 'Checking...';

  try {
    await Word.run(async (context) => {
      const body = context.document.body;
      body.load('text');
      await context.sync();

      const text = body.text;

      // Check for placeholders
      const placeholderRegex = /\{\{[^}]+\}\}/g;
      const placeholders = text.match(placeholderRegex);

      if (!placeholders || placeholders.length === 0) {
        const item = checklistItems.find(i => i.id === 'placeholders-filled');
        if (item) item.checked = true;
      }

      renderChecklist();
      showNotification('Auto-check complete!', 'success');
    });
  } catch (error) {
    console.error('Auto-check failed:', error);
    showNotification('Auto-check failed', 'error');
  } finally {
    button.disabled = false;
    button.textContent = '🔍 Auto-check Document';
  }
}

/**
 * Show notification
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
 * Get Checklist tab HTML
 */
export function getChecklistTabHTML(): string {
  return `
    <div id="checklist-tab" class="tab-content" style="display: none; flex: 1; background: white; padding: 20px; overflow: auto; flex-direction: column;">
      <div style="max-width: 600px; width: 100%; margin: 0 auto;">
        <h3 style="margin-bottom: 8px; color: #333;">✅ Document Checklist</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
          Track your document completion progress
        </p>

        <!-- Progress Bar -->
        <div style="margin-bottom: 24px;">
          <div id="checklist-progress-text" style="font-size: 13px; color: #666; margin-bottom: 8px;">0 of 8 completed (0%)</div>
          <div style="width: 100%; height: 12px; background: #f0f0f0; border-radius: 6px; overflow: hidden;">
            <div id="checklist-progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); transition: width 0.3s ease;"></div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 8px; margin-bottom: 20px;">
          <button id="auto-check-btn" style="flex: 1; padding: 10px; background: #667eea; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px;">
            🔍 Auto-check Document
          </button>
          <button id="reset-checklist-btn" style="padding: 10px 16px; background: #f3f4f6; color: #666; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px;">
            Reset
          </button>
        </div>

        <!-- Checklist Items -->
        <div id="checklist-items">
          <!-- Populated by JavaScript -->
        </div>
      </div>
    </div>
  `;
}
