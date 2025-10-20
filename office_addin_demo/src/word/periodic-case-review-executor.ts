/**
 * Periodic Case Review Executor
 * Handles execution of operations specific to Periodic Case Review documents
 */

/* global Word */

import type { DocumentOperation, CheckBoxOperation, FillFormFieldOperation } from './types';

/**
 * Execute Periodic Case Review operations on Word document
 */
export async function executePeriodicCaseReviewOperations(
  operations: DocumentOperation[],
  onProgress?: (progress: number) => void
): Promise<void> {
  return Word.run(async (context) => {
    console.log('[PeriodicCaseReview] Starting execution, count:', operations.length);

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
      console.log(`[Operation ${i + 1}/${operations.length}] Type: ${operation.type}`);

      try {
        switch (operation.type) {
          case 'fillTableCell':
            await executeFillTableCell(context, operation);
            break;
          case 'checkbox':
            await executeCheckBox(context, operation as CheckBoxOperation);
            break;
          case 'fillFormField':
            await executeFillFormField(context, operation as FillFormFieldOperation);
            break;
          default:
            console.warn(`Unsupported operation type for Periodic Case Review: ${operation.type}`);
        }

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

    console.log('[PeriodicCaseReview] Complete:', { total: operations.length, success: successCount, failed: failureCount });
  });
}

/**
 * Execute fillTableCell operation (shared with checklist)
 */
async function executeFillTableCell(
  context: Word.RequestContext,
  operation: any
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

  // Add comment if metadata exists
  if (operation.checklistMetadata) {
    try {
      const commentText = buildCommentText(operation.checklistMetadata);
      insertedRange.insertComment(commentText);
      console.log('Comment added successfully to cell:', operation.row, operation.cell);
    } catch (e) {
      console.warn('Could not add comment to cell:', e);
    }
  }
}

/**
 * Execute checkbox operation
 */
async function executeCheckBox(
  context: Word.RequestContext,
  operation: CheckBoxOperation
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

  // Add comment if metadata exists
  if (operation.checklistMetadata) {
    try {
      const commentText = buildCommentText(operation.checklistMetadata);
      insertedRange.insertComment(commentText);
      console.log('Comment added successfully to checkbox cell:', operation.row, operation.cell);
    } catch (e) {
      console.warn('Could not add comment to checkbox:', e);
    }
  }
}

/**
 * Execute form field operation
 */
async function executeFillFormField(
  context: Word.RequestContext,
  operation: FillFormFieldOperation
): Promise<void> {
  // Try to find form field by name
  const contentControls = context.document.contentControls;
  contentControls.load('items');
  await context.sync();

  let foundField = false;

  for (const control of contentControls.items) {
    control.load(['title', 'tag']);
    await context.sync();

    if (control.title === operation.fieldName || control.tag === operation.fieldName) {
      control.insertText(operation.value, Word.InsertLocation.replace);
      foundField = true;

      // Add comment if metadata exists
      if (operation.checklistMetadata) {
        try {
          const commentText = buildCommentText(operation.checklistMetadata);
          control.insertComment(commentText);
          console.log('Comment added successfully to form field:', operation.fieldName);
        } catch (e) {
          console.warn('Could not add comment to form field:', e);
        }
      }
      break;
    }
  }

  if (!foundField) {
    console.warn(`Form field not found: ${operation.fieldName}`);
  }
}

/**
 * Build comment text from checklist metadata
 */
function buildCommentText(metadata: any): string {
  const lines: string[] = [];

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
    metadata.references.forEach((ref: string, index: number) => {
      // Add numerical reference with hyperlink
      const linkUrl = `https://example.com/documents/${encodeURIComponent(ref)}`;
      lines.push(`  ${index + 1}. ${ref} - ${linkUrl}`);
    });
    lines.push('');
  }

  return lines.join('\n');
}
