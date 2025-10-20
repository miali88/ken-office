/**
 * Checklist Executor
 * Handles execution of checklist operations
 */

/* global Word */

import type { FillChecklistCellOperation } from './types';

/**
 * Execute checklist operations on Word document
 */
export async function executeChecklistOperations(
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
  if (operation.checklistMetadata) {
    try {
      const commentText = buildChecklistCommentText(operation);
      insertedRange.insertComment(commentText);
      console.log('Comment added successfully to cell:', operation.row, operation.cell);
    } catch (e) {
      console.warn('Could not add comment to checklist cell:', e);
    }
  }
}

/**
 * Build comment text with checklist metadata
 */
function buildChecklistCommentText(operation: FillChecklistCellOperation): string {
  const lines: string[] = [];
  const metadata = operation.checklistMetadata!;

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
    metadata.references.forEach((ref, index) => {
      // Add numerical reference with hyperlink
      const linkUrl = `https://example.com/documents/${encodeURIComponent(ref)}`;
      lines.push(`  ${index + 1}. ${ref} - ${linkUrl}`);
    });
    lines.push('');
  }

  return lines.join('\n');
}
