/**
 * Drafting Tab - AI Document Rewrite and Testing
 */

import { handleStructuredAIRewrite } from './ai-rewrite-structured';

/**
 * Initialize the Drafting tab
 */
export function initializeDraftingTab() {
  const aiRewriteBtn = document.getElementById('ai-rewrite-btn');
  const testPingBtn = document.getElementById('test-ping-btn');

  if (aiRewriteBtn) aiRewriteBtn.onclick = handleStructuredAIRewrite;
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
    <div id="drafting-tab" class="tab-content active" style="display: flex; flex: 1; background: white; padding: 20px; overflow: auto; flex-direction: column; align-items: center; justify-content: flex-start;">
      <!-- DEBUG: Test Backend Connection -->

      <!-- AI Rewrite Section -->
      <div style="width: 100%; max-width: 500px; margin-bottom: 30px;">
        <h3 style="margin-bottom: 12px; color: #333;">🤖 AI Document Rewrite (Demo Mode)</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 8px;">
          Fill placeholders and tables using mock AI operations (no backend required)
        </p>
        <p style="font-size: 12px; color: #999; margin-bottom: 16px; padding: 8px; background: #f9f9f9; border-radius: 4px; border-left: 3px solid #667eea;">
          💡 This demo uses hardcoded data from <code>mockLLMResponse.ts</code>
        </p>
        <button id="ai-rewrite-btn" style="width: 100%; padding: 14px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">
          ✨ AI Rewrite Document (Demo)
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
    </div>
  `;
}
