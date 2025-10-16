/**
 * AI Document Rewrite with Track Changes
 *
 * Sends entire document to backend, receives rewritten version,
 * applies changes using diff algorithm with Word track changes
 */

/* global Word */

import * as Diff from 'diff';

interface ParagraphChange {
  type: 'insert' | 'delete' | 'replace' | 'equal';
  paragraphIndex: number;
  originalText?: string;
  newText?: string;
}

/**
 * Main handler for AI document rewrite
 */
export async function handleAIRewrite(): Promise<void> {
  const statusElement = document.getElementById("rewrite-status");
  const progressContainer = document.getElementById("progress-container");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  const button = document.getElementById("ai-rewrite-btn") as HTMLButtonElement;

  if (!statusElement || !button) {
    console.error("Required elements not found");
    return;
  }

  try {
    // Disable button and show loading
    button.disabled = true;
    if (progressContainer) progressContainer.style.display = 'block';
    statusElement.textContent = "📖 Reading entire document...";
    if (progressText) progressText.textContent = "Step 1/4: Extracting document";

    // Step 1: Extract ENTIRE document
    const originalText = await extractFullDocument();
    console.log('[AI Rewrite] Original document length:', originalText.length);

    // Step 2: Send to backend for AI rewriting
    statusElement.textContent = "🤖 AI is analyzing and rewriting document...";
    if (progressText) progressText.textContent = "Step 2/4: AI processing";
    if (progressBar) progressBar.style.width = '25%';

    const modifiedText = await sendToBackend(originalText);
    console.log('[AI Rewrite] Modified document length:', modifiedText.length);

    // Step 3: Compute diff
    statusElement.textContent = "🔍 Computing differences...";
    if (progressText) progressText.textContent = "Step 3/4: Computing differences";
    if (progressBar) progressBar.style.width = '50%';

    const changes = computeParagraphDiff(originalText, modifiedText);
    console.log('[AI Rewrite] Changes detected:', changes.length);

    // Step 4: Apply with track changes
    statusElement.textContent = "✍️ Applying changes with track changes...";
    if (progressText) progressText.textContent = "Step 4/4: Applying changes";
    if (progressBar) progressBar.style.width = '75%';

    await applyChangesWithTrackChanges(changes);

    // Success!
    statusElement.textContent = "✅ Document rewritten successfully!";
    if (progressText) progressText.textContent = "Complete!";
    if (progressBar) progressBar.style.width = '100%';

    setTimeout(() => {
      if (progressContainer) progressContainer.style.display = 'none';
    }, 3000);

  } catch (error) {
    console.error('[AI Rewrite] Error:', error);
    statusElement.textContent = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    statusElement.style.color = '#d32f2f';
  } finally {
    button.disabled = false;
  }
}

/**
 * Extract entire document text from Word
 */
async function extractFullDocument(): Promise<string> {
  return Word.run(async (context) => {
    context.document.body.load('text');
    await context.sync();
    return context.document.body.text;
  });
}

/**
 * Send document to backend for AI rewriting
 */
async function sendToBackend(documentText: string): Promise<string> {
  const caseId = getCaseId(); // Get from URL or config

  // Call main app backend API
  const response = await fetch(`http://localhost:3000/api/word-agent/rewrite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      documentText,
      caseId,
      instructions: 'Fill in all placeholders with accurate case information and improve clarity'
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(`API request failed: ${error.error?.message || response.statusText}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || 'Backend processing failed');
  }

  console.log('[AI Rewrite] Backend metadata:', result.metadata);

  return result.modifiedDocument;
}

/**
 * Compute paragraph-level diff between original and modified
 */
function computeParagraphDiff(originalText: string, modifiedText: string): ParagraphChange[] {
  // Split into paragraphs (handle both \n and \r\n)
  const originalParagraphs = originalText.split(/\r?\n/);
  const modifiedParagraphs = modifiedText.split(/\r?\n/);

  console.log('[Diff] Original paragraphs:', originalParagraphs.length);
  console.log('[Diff] Modified paragraphs:', modifiedParagraphs.length);

  // Use diff library to compute changes
  const diffResult = Diff.diffArrays(originalParagraphs, modifiedParagraphs);

  // Convert to paragraph operations
  const changes: ParagraphChange[] = [];
  let paragraphIndex = 0;

  for (const change of diffResult) {
    if (change.removed) {
      // Paragraphs deleted
      for (const paragraph of change.value) {
        changes.push({
          type: 'delete',
          paragraphIndex,
          originalText: paragraph
        });
        paragraphIndex++;
      }
    } else if (change.added) {
      // Paragraphs inserted
      for (const paragraph of change.value) {
        changes.push({
          type: 'insert',
          paragraphIndex,
          newText: paragraph
        });
      }
    } else {
      // Unchanged - just track index
      paragraphIndex += change.value.length;
    }
  }

  console.log('[Diff] Total changes:', changes.length);
  return changes;
}

/**
 * Apply changes to Word document with track changes enabled
 */
async function applyChangesWithTrackChanges(changes: ParagraphChange[]): Promise<void> {
  return Word.run(async (context) => {
    console.log('[Track Changes] Enabling track changes mode');

    // ⭐ ENABLE TRACK CHANGES
    context.document.changeTrackingMode = Word.ChangeTrackingMode.trackAll;

    // Set author
    try {
      context.document.properties.author = "Kenneth AI";
      context.document.properties.load('author');
    } catch (e) {
      console.warn("Could not set document author:", e);
    }

    await context.sync();

    // Load all paragraphs
    const paragraphs = context.document.body.paragraphs;
    paragraphs.load('items');
    await context.sync();

    console.log('[Track Changes] Document has', paragraphs.items.length, 'paragraphs');

    // Apply changes in REVERSE order to maintain paragraph indices
    // (When you delete paragraph 5, paragraph 6 becomes paragraph 5)
    const reversedChanges = [...changes].reverse();

    for (let i = 0; i < reversedChanges.length; i++) {
      const change = reversedChanges[i];

      console.log(`[Track Changes] [${i + 1}/${reversedChanges.length}] ${change.type} at index ${change.paragraphIndex}`);

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
        console.error(`[Track Changes] Failed to apply change ${i}:`, error);
        // Continue with other changes
      }
    }

    console.log('[Track Changes] All changes applied successfully');
  });
}

/**
 * Apply paragraph deletion
 */
async function applyDelete(
  context: Word.RequestContext,
  paragraphs: Word.ParagraphCollection,
  change: ParagraphChange
): Promise<void> {
  const paragraph = paragraphs.items[change.paragraphIndex];

  if (!paragraph) {
    console.warn(`[Delete] Paragraph ${change.paragraphIndex} not found`);
    return;
  }

  // Delete entire paragraph (will be tracked as deletion)
  paragraph.delete();
}

/**
 * Apply paragraph insertion
 */
async function applyInsert(
  context: Word.RequestContext,
  paragraphs: Word.ParagraphCollection,
  change: ParagraphChange
): Promise<void> {
  const paragraph = paragraphs.items[change.paragraphIndex];

  if (paragraph) {
    // Insert before this paragraph
    paragraph.insertParagraph(change.newText || '', Word.InsertLocation.before);
  } else {
    // Insert at end if index out of range
    context.document.body.insertParagraph(change.newText || '', Word.InsertLocation.end);
  }
}

/**
 * Apply paragraph replacement
 */
async function applyReplace(
  context: Word.RequestContext,
  paragraphs: Word.ParagraphCollection,
  change: ParagraphChange
): Promise<void> {
  const paragraph = paragraphs.items[change.paragraphIndex];

  if (!paragraph) {
    console.warn(`[Replace] Paragraph ${change.paragraphIndex} not found`);
    return;
  }

  // Replace by inserting new and deleting old
  paragraph.insertParagraph(change.newText || '', Word.InsertLocation.after);
  paragraph.delete();
}

/**
 * Get case ID from URL or configuration
 */
function getCaseId(): string {
  // TODO: Get from URL parameter or configuration
  // For now, use hardcoded test case ID
  return 'cmfivedyx0001c96zlzkskb7b';
}
