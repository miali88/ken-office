/**
 * AI Chat Tab - AI conversation interface with external chat widget
 *
 * IMPORTANT: The chat server at localhost:3001 must be configured with:
 *
 * 1. HTTPS enabled (not HTTP) - Office Add-ins require HTTPS
 *
 * 2. Remove or set X-Frame-Options header:
 *    - Do NOT use: X-Frame-Options: DENY or SAMEORIGIN
 *    - Best: Don't send X-Frame-Options header at all
 *
 * 3. Set Content-Security-Policy with frame-ancestors:
 *    Content-Security-Policy: frame-ancestors 'self' https://localhost:* https://*.office.com https://*.officeapps.live.com ms-office:;
 *
 * 4. If using cookies/auth, set:
 *    - Cookies: SameSite=None; Secure
 *    - CORS: Access-Control-Allow-Credentials: true
 *    - CORS: Access-Control-Allow-Origin: https://localhost:3000 (or appropriate origin)
 *
 * 5. Ensure the chat server runs on https://localhost:3001 (with dev cert)
 */

/**
 * Initialize the AI Chat tab
 */
export function initializeAIChatTab() {
  console.log('[AI Chat] Tab initialized');

  // Setup iframe communication if needed
  window.addEventListener('message', handleChatMessage);

  // Test connectivity to chat server
  setTimeout(async () => {
    const statusDiv = document.getElementById('iframe-status');
    const iframe = document.getElementById('chat-widget-iframe') as HTMLIFrameElement;

    if (!statusDiv) return;

    // Test 1: Can we reach the chat server at all?
    try {
      statusDiv.innerHTML = '🔍 <strong>Testing connection...</strong><br/><span style="font-size: 11px;">Attempting to reach https://localhost:3001</span>';

      const response = await fetch('https://localhost:3001/chat/cmfivedyx0001c96zlzkskb7b', {
        method: 'HEAD',
        mode: 'no-cors'
      });

      statusDiv.innerHTML = '📡 <strong>Server reachable!</strong><br/><span style="font-size: 11px;">Attempting to load in iframe...</span>';
      statusDiv.style.background = '#d1ecf1';

      // Monitor iframe loading
      let iframeLoaded = false;

      if (iframe) {
        iframe.onload = () => {
          iframeLoaded = true;
          statusDiv.innerHTML = '✅ <strong>Iframe loaded!</strong><br/><span style="font-size: 11px;">If you see blank content, check that the chat server is rendering HTML.</span>';
          statusDiv.style.background = '#d4edda';
          statusDiv.style.color = '#155724';
        };

        iframe.onerror = () => {
          statusDiv.innerHTML = '❌ <strong>Iframe blocked by browser.</strong><br/><span style="font-size: 11px;">Likely: Certificate not trusted or X-Frame-Options blocking.</span>';
          statusDiv.style.background = '#f8d7da';
          statusDiv.style.color = '#721c24';
        };

        // Check after 5 seconds if still not loaded
        setTimeout(() => {
          if (!iframeLoaded) {
            statusDiv.innerHTML = `
              ⚠️ <strong>Iframe not loading - Certificate Issue</strong><br/>
              <span style="font-size: 11px;">Desktop Word doesn't trust the HTTPS certificate.</span><br/>
              <span style="font-size: 10px; color: #856404;">
                <strong>FIX:</strong> Open <a href="https://localhost:3001/chat/cmfivedyx0001c96zlzkskb7b" target="_blank" style="color: #0066cc;">this link</a> in your browser first, accept the certificate warning, then restart the add-in.
              </span>
            `;
            statusDiv.style.background = '#fff3cd';
            statusDiv.style.color = '#856404';
          }
        }, 5000);
      }

    } catch (fetchError) {
      statusDiv.innerHTML = `
        ❌ <strong>Cannot reach chat server</strong><br/>
        <span style="font-size: 11px; color: #721c24;">Server not running or HTTPS certificate issue.</span><br/>
        <span style="font-size: 10px;">Error: ${fetchError instanceof Error ? fetchError.message : 'Unknown'}</span><br/>
        <span style="font-size: 10px; margin-top: 8px; display: block;">
          <strong>Steps to fix:</strong><br/>
          1. Ensure chat server runs on https://localhost:3001<br/>
          2. Open the URL in browser and accept certificate<br/>
          3. Restart the add-in
        </span>
      `;
      statusDiv.style.background = '#f8d7da';
      statusDiv.style.color = '#721c24';
    }
  }, 500);
}

/**
 * Handle messages from the chat widget iframe
 */
function handleChatMessage(event: MessageEvent) {
  // Only accept messages from the chat server (HTTPS)
  if (event.origin !== 'https://localhost:3001') {
    return;
  }

  console.log('[AI Chat] Message from chat widget:', event.data);

  // Handle different message types from the chat widget
  // Add custom message handling here as needed
}

/**
 * Get AI Chat tab HTML with embedded chat widget
 */
export function getAIChatTabHTML(): string {
  // Use same-origin proxy to avoid certificate issues
  // The add-in dev server proxies /chat/* to https://localhost:3001
  const chatUrl = '/chat/cmfivedyx0001c96zlzkskb7b';

  return `
    <div id="ai-chat-tab" class="tab-content" style="display: none; flex: 1; background: white; padding: 0; flex-direction: column;">
      <div id="iframe-status" style="padding: 12px; background: #e3f2fd; font-size: 12px; border-bottom: 1px solid #90caf9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        🔄 <strong>Loading chat widget...</strong><br/>
        <span style="font-size: 11px; color: #666;">URL: ${chatUrl}</span><br/>
        <span style="font-size: 10px; color: #999;">Waiting for response from server...</span>
      </div>
      <iframe
        id="chat-widget-iframe"
        src="${chatUrl}"
        style="width: 100%; height: 100%; border: none; flex: 1; background: white;"
        allow="clipboard-write"
        sandbox="allow-scripts allow-forms allow-popups allow-same-origin allow-downloads allow-popups-to-escape-sandbox"
      ></iframe>
      <div style="padding: 8px; background: #f5f5f5; font-size: 10px; color: #666; border-top: 1px solid #ddd; text-align: center;">
        If blank after 5 seconds, check: HTTPS enabled, CSP frame-ancestors set, no X-Frame-Options header
      </div>
    </div>
  `;
}
