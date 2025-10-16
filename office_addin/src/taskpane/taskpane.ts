/**
 * Main entry point for the unified Office Add-in
 * Detects host (Word or Outlook) and loads appropriate module
 */

/* global Office, console, alert */

console.log('[TaskpaneInit] Script loaded');

// Host detection and dynamic imports
Office.onReady((info) => {
  console.log('[TaskpaneInit] Office.onReady fired', info);

  // Hide loading message
  const loadingMsg = document.getElementById('loading-msg');
  if (loadingMsg) {
    loadingMsg.style.display = 'none';
    console.log('[TaskpaneInit] Loading message hidden');
  }

  // Detect host and load appropriate module
  if (info.host === Office.HostType.Word) {
    console.log('[TaskpaneInit] Host detected: Word');
    initializeWord();
  } else if (info.host === Office.HostType.Outlook) {
    console.log('[TaskpaneInit] Host detected: Outlook');
    initializeOutlook();
  } else {
    console.error('[TaskpaneInit] Unsupported host:', info.host);
    showError('This add-in is not supported in this Office application.');
  }
});

/**
 * Initialize Word-specific functionality
 */
async function initializeWord() {
  console.log('[TaskpaneInit] Starting Word initialization...');

  try {
    console.log('[TaskpaneInit] About to dynamic import word-main...');

    // Dynamically import Word module
    const wordModule = await import(/* webpackChunkName: "word-main" */ '../word/word-main');

    console.log('[TaskpaneInit] Word module imported successfully', wordModule);

    if (typeof wordModule.initialize === 'function') {
      console.log('[TaskpaneInit] Calling word initialize()...');
      wordModule.initialize();
      console.log('[TaskpaneInit] Word module initialized successfully');
    } else {
      throw new Error('Word module does not export initialize function');
    }
  } catch (error) {
    console.error('[TaskpaneInit] Error initializing Word:', error);
    console.error('[TaskpaneInit] Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('[TaskpaneInit] Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('[TaskpaneInit] Error message:', error instanceof Error ? error.message : String(error));

    const errorMsg = error instanceof Error ? error.message : String(error);
    showError(`Failed to load Word features: ${errorMsg}`);
    alert(`Word initialization error: ${errorMsg}`);
  }
}

/**
 * Initialize Outlook-specific functionality
 */
async function initializeOutlook() {
  console.log('[TaskpaneInit] Starting Outlook initialization...');

  try {
    console.log('[TaskpaneInit] About to dynamic import outlook-main...');

    // Dynamically import Outlook module
    const outlookModule = await import(/* webpackChunkName: "outlook-main" */ '../outlook/outlook-main');

    console.log('[TaskpaneInit] Outlook module imported successfully', outlookModule);

    if (typeof outlookModule.initialize === 'function') {
      console.log('[TaskpaneInit] Calling outlook initialize()...');
      outlookModule.initialize();
      console.log('[TaskpaneInit] Outlook module initialized successfully');
    } else {
      throw new Error('Outlook module does not export initialize function');
    }
  } catch (error) {
    console.error('[TaskpaneInit] Error initializing Outlook:', error);
    console.error('[TaskpaneInit] Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('[TaskpaneInit] Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('[TaskpaneInit] Error message:', error instanceof Error ? error.message : String(error));

    const errorMsg = error instanceof Error ? error.message : String(error);
    showError(`Failed to load Outlook features: ${errorMsg}`);
    alert(`Outlook initialization error: ${errorMsg}`);
  }
}

/**
 * Show error message to user
 */
function showError(message: string) {
  console.log('[TaskpaneInit] Showing error:', message);

  const errorDiv = document.getElementById('error-msg');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  } else {
    console.error('[TaskpaneInit] error-msg element not found!');
  }
}

console.log('[TaskpaneInit] Script execution complete, waiting for Office.onReady');
