/**
 * Document Type Detector
 * Detects which type of document is currently open in Word
 */

/* global Word */

import { DocumentType } from './types';

/**
 * Detect the type of document currently open
 */
export async function detectDocumentType(): Promise<DocumentType> {
  return Word.run(async (context) => {
    console.log('[DocumentDetector] Starting document type detection...');

    // Get document body
    const body = context.document.body;
    body.load('text');

    // Get tables
    const tables = context.document.body.tables;
    tables.load('items');

    await context.sync();

    // Get first table (table 0) text
    let table0Text = '';
    if (tables.items.length > 0) {
      const table0 = tables.items[0];
      const rows0 = table0.rows;
      rows0.load('items');
      await context.sync();

      if (rows0.items.length > 0) {
        const firstRow = rows0.items[0];
        const cells = firstRow.cells;
        cells.load('items');
        await context.sync();

        for (const cell of cells.items) {
          cell.body.load('text');
        }
        await context.sync();

        table0Text = cells.items.map(cell => cell.body.text).join(' ').toLowerCase();
      }
    }

    // Get second table (table 1) text
    let table1Text = '';
    if (tables.items.length > 1) {
      const table1 = tables.items[1];
      const rows1 = table1.rows;
      rows1.load('items');
      await context.sync();

      if (rows1.items.length > 0) {
        const firstRow = rows1.items[0];
        const cells = firstRow.cells;
        cells.load('items');
        await context.sync();

        for (const cell of cells.items) {
          cell.body.load('text');
        }
        await context.sync();

        table1Text = cells.items.map(cell => cell.body.text).join(' ').toLowerCase();
      }
    }

    const bodyText = body.text.toLowerCase();

    console.log('[DocumentDetector] Body text sample:', bodyText.substring(0, 200));
    console.log('[DocumentDetector] Table 0 text:', table0Text);
    console.log('[DocumentDetector] Table 1 text:', table1Text);

    // Detection logic for Checklist 3 (CHECK THIS FIRST!)
    // Look for distinctive markers in document title/body AND second table
    const isChecklist3 =
      (bodyText.includes('checklist 3') && bodyText.includes('appointing the liquidator')) ||
      (bodyText.includes('cvl') && bodyText.includes('checklist 3')) ||
      table1Text.includes('preparation') ||
      (table1Text.includes('docs') && table1Text.includes('ref') && table1Text.includes('status'));

    if (isChecklist3) {
      console.log('[DocumentDetector] Detected: CHECKLIST_3');
      return DocumentType.CHECKLIST_3;
    }

    // Detection logic for Periodic Case Review (CHECK SECOND)
    // Use more specific markers that won't conflict with Checklist 3
    const isPeriodicCaseReview =
      bodyText.includes('periodic case review') ||
      bodyText.includes('12 month case review') ||
      bodyText.includes('case progression - overview') ||
      (bodyText.includes('date of last case review') && bodyText.includes('office holder sign-off'));

    if (isPeriodicCaseReview) {
      console.log('[DocumentDetector] Detected: PERIODIC_CASE_REVIEW');
      return DocumentType.PERIODIC_CASE_REVIEW;
    }

    // Unknown document type
    console.log('[DocumentDetector] Detected: UNKNOWN');
    return DocumentType.UNKNOWN;
  });
}

/**
 * Get human-readable document type name
 */
export function getDocumentTypeName(docType: DocumentType): string {
  switch (docType) {
    case DocumentType.CHECKLIST_3:
      return "Creditors' Voluntary Liquidation - Checklist 3";
    case DocumentType.PERIODIC_CASE_REVIEW:
      return 'Corporate - 12 Month Case Review';
    case DocumentType.UNKNOWN:
      return 'Unknown Document Type';
    default:
      return 'Unknown';
  }
}
