/**
 * Word Agent Operation Types (Copy for frontend use)
 */

export type DocumentOperation =
  | FillTableCellOperation
  | ReplacePlaceholderOperation
  | ReplaceTextOperation
  | DeleteTextOperation
  | InsertTextOperation
  | FillChecklistCellOperation;

export interface FillTableCellOperation {
  type: 'fillTableCell';
  tableIndex: number;
  row: number;
  cell: number;
  value: string;
  metadata?: OperationMetadata;
}

export interface ReplacePlaceholderOperation {
  type: 'replacePlaceholder';
  target: string;
  value: string;
  replaceAll?: boolean;
  metadata?: OperationMetadata;
}

export interface ReplaceTextOperation {
  type: 'replaceText';
  target: string;
  value: string;
  matchCase?: boolean;
  matchWholeWord?: boolean;
  metadata?: OperationMetadata;
}

export interface DeleteTextOperation {
  type: 'deleteText';
  target: string;
  metadata?: OperationMetadata;
}

export interface InsertTextOperation {
  type: 'insertText';
  location: 'start' | 'end' | { after: string } | { before: string };
  value: string;
  metadata?: OperationMetadata;
}

export interface OperationMetadata {
  confidence: 'high' | 'medium' | 'low';
  source?: string;
  reasoning?: string;
}

export interface ChecklistMetadata {
  status: string;
  commentary: string;
  references: string[];
}

export interface FillChecklistCellOperation {
  type: 'fillChecklistCell';
  tableIndex: number;
  row: number;
  cell: number;
  value: string;
  checklistMetadata: ChecklistMetadata;
}

export interface DocumentStructure {
  text: string;
  tables: TableStructure[];
  placeholders: string[];
  sections?: SectionStructure[];
}

export interface TableStructure {
  index: number;
  rowCount: number;
  columnCount: number;
  headers?: string[];
  cells: string[][];
  location: {
    beforeText?: string;
    afterText?: string;
  };
}

export interface SectionStructure {
  heading?: string;
  content: string;
  level?: number;
}
