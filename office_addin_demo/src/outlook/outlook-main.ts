/**
 * Outlook-specific functionality
 * Main module for Outlook add-in features - FULL FUNCTIONALITY
 */

/* global Office, document */

// Synthetic filing data
const filingData = {
  client: "Acme Corporation",
  matter: "Contract Dispute Resolution",
  category: "Commercial Litigation",
  case: "CASE-2025-001234"
};

const attachments = [
  { name: "Contract_Agreement.pdf", filed: true },
  { name: "Evidence_Photos.zip", filed: true },
  { name: "Witness_Statement.docx", filed: false },
  { name: "Financial_Records.xlsx", filed: false }
];

/**
 * Initialize Outlook add-in
 */
export function initialize() {
  console.log('[Outlook] Initializing Outlook add-in...');

  // Inject HTML into the app container
  const appContainer = document.getElementById('app-container');
  if (appContainer) {
    appContainer.innerHTML = getOutlookHTML();
    console.log('[Outlook] HTML injected successfully');
  } else {
    console.error('[Outlook] app-container not found!');
    return;
  }

  // Setup tabs
  initializeTabs();

  // Populate filing data
  populateFilingData();
  populateAttachments();

  // Generate summary on chat tab load
  generateSummary();

  console.log('[Outlook] All handlers wired up');
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
 * Initialize tabs
 */
function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      // Remove active class from all
      tabButtons.forEach(btn => btn.classList.remove("active"));
      tabContents.forEach(content => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      button.classList.add("active");
      const targetContent = document.getElementById(`${targetTab}-tab`);
      if (targetContent) {
        targetContent.classList.add("active");
      }

      // If chat tab is clicked, generate summary
      if (targetTab === "chat") {
        generateSummary();
      }
    });
  });
}

/**
 * Get email content from Outlook
 */
async function getEmailContent(): Promise<{ subject: string; body: string }> {
  return new Promise((resolve, reject) => {
    const item = Office.context.mailbox.item;

    if (!item) {
      reject(new Error("No email item found"));
      return;
    }

    item.body.getAsync(Office.CoercionType.Text, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        resolve({
          subject: item.subject || "No subject",
          body: result.value || "No content"
        });
      } else {
        reject(new Error("Failed to get email body"));
      }
    });
  });
}

/**
 * Generate email summary
 * Note: This would normally call a backend API with AI capabilities
 * For now, we'll show the email content
 */
async function generateSummary() {
  const loadingDiv = document.getElementById("summary-loading");
  const errorDiv = document.getElementById("summary-error");
  const contentDiv = document.getElementById("summary-content");
  const summaryText = document.getElementById("summary-text");
  const errorMessage = document.getElementById("error-message");

  if (!loadingDiv || !errorDiv || !contentDiv || !summaryText || !errorMessage) {
    return;
  }

  // Show loading state
  loadingDiv.style.display = "block";
  errorDiv.style.display = "none";
  contentDiv.style.display = "none";

  try {
    const emailContent = await getEmailContent();

    // For now, show a simple summary - in production, this would call backend AI API
    const summary = `Subject: ${emailContent.subject}\n\nPreview: ${emailContent.body.substring(0, 200)}...`;

    summaryText.textContent = summary;
    contentDiv.style.display = "block";
    loadingDiv.style.display = "none";

    showNotification("Email loaded successfully", "success");
  } catch (error) {
    errorMessage.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    errorDiv.style.display = "block";
    loadingDiv.style.display = "none";

    showNotification("Failed to load email", "error");
  }
}

/**
 * Populate filing data fields
 */
function populateFilingData() {
  const clientField = document.getElementById("field-client") as HTMLInputElement;
  const matterField = document.getElementById("field-matter") as HTMLInputElement;
  const categoryField = document.getElementById("field-category") as HTMLInputElement;
  const caseField = document.getElementById("field-case") as HTMLInputElement;

  if (clientField) clientField.value = filingData.client;
  if (matterField) matterField.value = filingData.matter;
  if (categoryField) categoryField.value = filingData.category;
  if (caseField) caseField.value = filingData.case;
}

/**
 * Populate attachments table
 */
function populateAttachments() {
  const tbody = document.getElementById("attachments-body");
  if (!tbody) return;

  attachments.forEach(attachment => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = attachment.name;
    nameCell.style.padding = "8px";

    const statusCell = document.createElement("td");
    statusCell.style.padding = "8px";
    statusCell.style.textAlign = "center";
    statusCell.innerHTML = attachment.filed
      ? '<span style="color: #10b981; font-weight: bold;">✓ Filed</span>'
      : '<span style="color: #999;">○ Unfiled</span>';

    row.appendChild(nameCell);
    row.appendChild(statusCell);
    tbody.appendChild(row);
  });
}

/**
 * Get Outlook HTML template
 */
function getOutlookHTML(): string {
  return `
    <div style="width: 100%; height: 100vh; display: flex; flex-direction: column; background: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <!-- Header -->
      <div style="padding: 16px; background: linear-gradient(135deg, #00d2ff 0%, #3a47d5 100%); color: white;">
        <h1 style="margin: 0; font-size: 20px;">Kenneth AI</h1>
      </div>

      <!-- Tab Navigation -->
      <div style="display: flex; background: #f5f5f5; border-bottom: 1px solid #ddd;">
        <button class="tab-btn active" data-tab="chat" style="flex: 1; padding: 12px; background: white; color: #333; border: none; cursor: pointer; font-weight: 600;">Chat</button>
        <button class="tab-btn" data-tab="filing" style="flex: 1; padding: 12px; background: #f5f5f5; color: #666; border: none; cursor: pointer;">Filing</button>
      </div>

      <!-- Chat Tab Content -->
      <div class="tab-content active" id="chat-tab" style="flex: 1; padding: 20px; overflow: auto;">
        <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-top: 0; color: #333;">Email Summary</h3>

          <div id="summary-loading" style="display: none; text-align: center; padding: 20px; color: #666;">
            <p>Generating summary...</p>
          </div>

          <div id="summary-error" style="display: none; padding: 16px; background: #fee; border-left: 4px solid #f44; color: #c00; border-radius: 4px;">
            <p id="error-message" style="margin: 0;"></p>
          </div>

          <div id="summary-content" style="display: none;">
            <p id="summary-text" style="color: #333; line-height: 1.6; white-space: pre-wrap;"></p>
          </div>
        </div>
      </div>

      <!-- Filing Tab Content -->
      <div class="tab-content" id="filing-tab" style="display: none; flex: 1; padding: 20px; overflow: auto;">
        <!-- Filing Card -->
        <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #333;">Case Information</h3>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="display: block; font-weight: 600; color: #666; margin-bottom: 4px; font-size: 12px;">Client</label>
              <input type="text" id="field-client" readonly style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9;" />
            </div>
            <div>
              <label style="display: block; font-weight: 600; color: #666; margin-bottom: 4px; font-size: 12px;">Matter</label>
              <input type="text" id="field-matter" readonly style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9;" />
            </div>
            <div>
              <label style="display: block; font-weight: 600; color: #666; margin-bottom: 4px; font-size: 12px;">Category</label>
              <input type="text" id="field-category" readonly style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9;" />
            </div>
            <div>
              <label style="display: block; font-weight: 600; color: #666; margin-bottom: 4px; font-size: 12px;">Case</label>
              <input type="text" id="field-case" readonly style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9;" />
            </div>
          </div>
        </div>

        <!-- Attachments Sub-card -->
        <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-top: 0; color: #333;">Attachments</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #ddd;">
                <th style="text-align: left; padding: 8px; font-weight: 600; color: #666;">Name</th>
                <th style="text-align: center; padding: 8px; font-weight: 600; color: #666;">Filed Status</th>
              </tr>
            </thead>
            <tbody id="attachments-body">
              <!-- Populated by JS -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <style>
      .tab-btn.active {
        background: white !important;
        color: #333 !important;
        border-bottom: 2px solid #3a47d5;
      }
      .tab-content {
        display: none;
      }
      .tab-content.active {
        display: flex;
      }
    </style>
  `;
}
