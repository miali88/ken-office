/**
 * AI Document Rewrite with Structured Operations - SIMPLIFIED VERSION
 *
 * Shows live progress in the UI and catches errors at each step
 */

/* global Word */

import type { DocumentStructure, DocumentOperation } from './types';
import { MOCK_LLM_OPERATIONS } from './mockLLMResponse';
import { updateTaskState } from './drafting-tab-app';

/**
 * Main handler for structured AI document rewrite
 */
export async function handleStructuredAIRewrite(): Promise<void> {
  const statusElement = document.getElementById("rewrite-status");
  const button = document.getElementById("ai-rewrite-btn") as HTMLButtonElement;

  if (!statusElement || !button) {
    alert("Required UI elements not found");
    return;
  }

  try {
    button.disabled = true;

    // =========================================================================
    // STEP 1: Extract document text (SIMPLIFIED - NO TABLES)
    // =========================================================================
    updateTaskState(1, 'loading'); // Task 1: Understanding document

    let structure: DocumentStructure;
    try {
      structure = await extractDocumentSimplified();
      updateTaskState(1, 'complete'); // Task 1 complete
    } catch (extractError) {
      const errMsg = extractError instanceof Error ? extractError.message : String(extractError);
      throw new Error(`Step 1 failed: ${errMsg}`);
    }

    // =========================================================================
    // STEP 2: Load mock AI response (DEMO MODE - NO BACKEND)
    // =========================================================================
    updateTaskState(2, 'loading'); // Task 2: Identifying missing info
    let operations: DocumentOperation[];
    try {
      operations = await getMockOperations(structure);
      updateTaskState(2, 'complete'); // Task 2 complete

      // Start task 3: Reviewing case files
      updateTaskState(3, 'loading');
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause for UX
      updateTaskState(3, 'complete'); // Task 3 complete
    } catch (mockError) {
      const errMsg = mockError instanceof Error ? mockError.message : String(mockError);
      throw new Error(`Step 2 failed: ${errMsg}`);
    }

    // =========================================================================
    // STEP 3: Execute operations
    // =========================================================================
    updateTaskState(4, 'loading'); // Task 4: Typing.... (keep loading during entire step)

    try {
      await executeOperations(operations);
      updateTaskState(4, 'complete'); // Task 4 complete when done typing
    } catch (executeError) {
      const errMsg = executeError instanceof Error ? executeError.message : String(executeError);
      throw new Error(`Step 3 failed: ${errMsg}`);
    }

    // =========================================================================
    // SUCCESS!
    // =========================================================================
    statusElement.innerHTML = `
      <div style="padding: 12px; background: #e8f5e9; border: 2px solid #4caf50; border-radius: 4px; text-align: center;">
        <div style="color: #2e7d32; font-weight: bold;">✅ Document updated successfully!</div>
      </div>
    `;

  } catch (error) {
    console.error('[FATAL ERROR]', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    statusElement.innerHTML = `
      <div style="padding: 12px; background: #ffebee; border: 2px solid #d32f2f; border-radius: 4px; text-align: center;">
        <div style="color: #d32f2f; font-weight: bold; margin-bottom: 8px;">❌ Process Failed</div>
        <div style="color: #333; font-size: 14px;">${errorMessage}</div>
      </div>
    `;
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
async function getMockOperations(structure: DocumentStructure): Promise<DocumentOperation[]> {
  // Simulate realistic network/processing delay for better UX
  await new Promise(resolve => setTimeout(resolve, 800));

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

    // Group fillTableCell operations by tableIndex
    const tableOperationsMap = new Map<number, Array<Extract<DocumentOperation, { type: 'fillTableCell' }>>>();
    const nonTableOperations: DocumentOperation[] = [];

    for (const operation of operations) {
      if (operation.type === 'fillTableCell') {
        const tableOps = tableOperationsMap.get(operation.tableIndex) || [];
        tableOps.push(operation);
        tableOperationsMap.set(operation.tableIndex, tableOps);
      } else {
        nonTableOperations.push(operation);
      }
    }

    // Execute table operations grouped by table (one comment per table)
    const tableEntries = Array.from(tableOperationsMap.entries());
    for (const [tableIndex, tableOps] of tableEntries) {
      console.log(`[Table ${tableIndex}] Processing ${tableOps.length} cell operations`);

      try {
        await executeTableOperations(context, tableIndex, tableOps);
        await context.sync();
        successCount += tableOps.length;
      } catch (error) {
        failureCount += tableOps.length;
        console.error(`Table ${tableIndex} operations failed:`, error);
      }
    }

    // Execute non-table operations individually
    for (let i = 0; i < nonTableOperations.length; i++) {
      const operation = nonTableOperations[i];
      console.log(`[Operation ${i + 1}/${nonTableOperations.length}] Type: ${operation.type}`);

      try {
        switch (operation.type) {
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
 * Execute all table operations for a specific table and add ONE comment
 */
async function executeTableOperations(
  context: Word.RequestContext,
  tableIndex: number,
  operations: Array<Extract<DocumentOperation, { type: 'fillTableCell' }>>
): Promise<void> {
  const tables = context.document.body.tables;
  tables.load('items');
  await context.sync();

  if (tableIndex >= tables.items.length) {
    console.warn(`Table ${tableIndex} not found`);
    return;
  }

  const table = tables.items[tableIndex];
  const rows = table.rows;
  rows.load('items');
  await context.sync();

  // Track which cells were modified for the comment summary
  const modifiedCells: Array<{ row: number; cell: number; value: string }> = [];

  // Fill all cells in this table
  for (const operation of operations) {
    if (operation.row >= rows.items.length) {
      console.warn(`Row ${operation.row} not found in table ${tableIndex}`);
      continue;
    }

    const row = rows.items[operation.row];
    const cells = row.cells;
    cells.load('items');
    await context.sync();

    if (operation.cell >= cells.items.length) {
      console.warn(`Cell ${operation.cell} not found in row ${operation.row}`);
      continue;
    }

    const cell = cells.items[operation.cell];
    cell.body.clear();
    cell.body.insertText(operation.value, Word.InsertLocation.start);

    modifiedCells.push({
      row: operation.row,
      cell: operation.cell,
      value: operation.value
    });
  }

  // Add ONE comment to the first modified cell
  if (modifiedCells.length > 0 && operations.length > 0) {
    try {
      // Get the first modified cell to attach the comment
      const firstOp = operations[0];
      const firstRow = rows.items[firstOp.row];
      const firstCells = firstRow.cells;
      firstCells.load('items');
      await context.sync();

      const firstCell = firstCells.items[firstOp.cell];
      const range = firstCell.body.getRange();

      // Build a comprehensive comment for all table changes
      const commentText = buildTableCommentText(tableIndex, modifiedCells, operations[0].metadata);
      range.insertComment(commentText);

      console.log(`Added single comment to table ${tableIndex} summarizing ${modifiedCells.length} cell changes`);
    } catch (e) {
      console.warn('Could not add comment to table:', e);
    }
  }
}

/**
 * Execute fillTableCell operation (LEGACY - kept for compatibility)
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
  const insertedRange = cell.body.insertText(operation.value, Word.InsertLocation.start);

  // Add comment with metadata
  try {
    const commentText = buildCommentText('fillTableCell', operation.value, operation.metadata);
    // Insert comment on the text range, not the cell body
    insertedRange.insertComment(commentText);
    console.log('Comment added successfully to table cell:', operation.row, operation.cell);
  } catch (e) {
    console.warn('Could not add comment to table cell:', e);
  }
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
  const commentText = buildCommentText('replacePlaceholder', operation.value, operation.metadata, operation.target);

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
          const insertedRange = paragraph.insertText(newText, Word.InsertLocation.start);

          // Add comment
          try {
            insertedRange.insertComment(commentText);
          } catch (e) {
            console.warn('Could not add comment:', e);
          }

          replacedCount++;
          if (operation.replaceAll === false) break;
        }
      } catch (expandError) {
        const insertedRange = result.insertText(operation.value, Word.InsertLocation.replace);

        // Add comment
        try {
          insertedRange.insertComment(commentText);
        } catch (e) {
          console.warn('Could not add comment:', e);
        }

        replacedCount++;
        if (operation.replaceAll === false) break;
      }
    }
  } else {
    if (operation.replaceAll !== false) {
      for (const result of searchResults.items) {
        const insertedRange = result.insertText(operation.value, Word.InsertLocation.replace);

        // Add comment
        try {
          insertedRange.insertComment(commentText);
        } catch (e) {
          console.warn('Could not add comment:', e);
        }

        replacedCount++;
      }
    } else {
      const insertedRange = searchResults.items[0].insertText(operation.value, Word.InsertLocation.replace);

      // Add comment
      try {
        insertedRange.insertComment(commentText);
      } catch (e) {
        console.warn('Could not add comment:', e);
      }

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

  const commentText = buildCommentText('replaceText', operation.value, operation.metadata, operation.target);

  for (const result of searchResults.items) {
    const insertedRange = result.insertText(operation.value, Word.InsertLocation.replace);

    // Add comment
    try {
      insertedRange.insertComment(commentText);
    } catch (e) {
      console.warn('Could not add comment:', e);
    }
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

/**
 * Build comment text with metadata
 */
function buildCommentText(
  operationType: string,
  insertedValue: string,
  metadata?: { confidence?: string; source?: string; reasoning?: string },
  originalTarget?: string
): string {
  const lines: string[] = [];

  // Header
  lines.push(`🤖 Kenneth AI - ${operationType}`);
  lines.push('');

  // Show what was replaced if available
  if (originalTarget) {
    const displayTarget = originalTarget.length > 100
      ? originalTarget.substring(0, 100) + '...'
      : originalTarget;
    lines.push(`Replaced: "${displayTarget}"`);
    lines.push('');
  }

  // Show inserted value
  const displayValue = insertedValue.length > 150
    ? insertedValue.substring(0, 150) + '...'
    : insertedValue;
  lines.push(`New value: "${displayValue}"`);
  lines.push('');

  // Metadata section
  if (metadata) {
    lines.push('--- Metadata ---');

    if (metadata.confidence) {
      const confidenceEmoji = metadata.confidence === 'high' ? '✅' : metadata.confidence === 'medium' ? '⚠️' : '❓';
      lines.push(`${confidenceEmoji} Confidence: ${metadata.confidence}`);
    }

    if (metadata.source) {
      lines.push(`📁 Source: ${metadata.source}`);
    }

    if (metadata.reasoning) {
      lines.push(`💭 Reasoning: ${metadata.reasoning}`);
    }

    lines.push('');
  }

  // Footer
  lines.push('---');
  lines.push('Author: Kenneth AI (Demo Mode)');
  lines.push('💡 Using mock data from mockLLMResponse.ts');

  return lines.join('\n');
}

/**
 * Build consolidated comment text for table operations
 */
function buildTableCommentText(
  tableIndex: number,
  modifiedCells: Array<{ row: number; cell: number; value: string }>,
  metadata?: { confidence?: string; source?: string; reasoning?: string }
): string {
  const lines: string[] = [];

  // Header
  lines.push(`🤖 Kenneth AI - fillTableCell`);
  lines.push('');
  lines.push(`Updated ${modifiedCells.length} cells in table ${tableIndex}`);
  lines.push('');

  // Show a sample of the changes (first few cells)
  const sampleSize = Math.min(3, modifiedCells.length);
  for (let i = 0; i < sampleSize; i++) {
    const cell = modifiedCells[i];
    const displayValue = cell.value.length > 50
      ? cell.value.substring(0, 50) + '...'
      : cell.value;
    lines.push(`  Row ${cell.row}, Cell ${cell.cell}: "${displayValue}"`);
  }

  if (modifiedCells.length > sampleSize) {
    lines.push(`  ... and ${modifiedCells.length - sampleSize} more cells`);
  }

  lines.push('');

  // Metadata section
  if (metadata) {
    lines.push('--- Metadata ---');

    if (metadata.confidence) {
      const confidenceEmoji = metadata.confidence === 'high' ? '✅' : metadata.confidence === 'medium' ? '⚠️' : '❓';
      lines.push(`${confidenceEmoji} Confidence: ${metadata.confidence}`);
    }

    if (metadata.source) {
      lines.push(`📁 Source: ${metadata.source}`);
    }

    if (metadata.reasoning) {
      lines.push(`💭 Reasoning: ${metadata.reasoning}`);
    }

    lines.push('');
  }

  // Footer
  lines.push('---');
  lines.push('Author: Kenneth AI (Demo Mode)');
  lines.push('💡 Using mock data from mockLLMResponse.ts');

  return lines.join('\n');
}
