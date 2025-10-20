/**
 * Mock Checklist Data for Creditors' Voluntary Liquidation - Checklist 3
 *
 * This file contains hardcoded checklist operations that simulate
 * auto-reviewing a CVL Checklist 3 document and filling in:
 * 1. Header table (Case Name, Case Code, etc.) - NO COMMENTS
 * 2. Checklist table Status column with initials - WITH DETAILED COMMENTS
 */

import type { FillChecklistCellOperation } from './types';

export const MOCK_CHECKLIST_OPERATIONS: FillChecklistCellOperation[] = [
  // ====================
  // HEADER TABLE (Table 0) - NO COMMENTS
  // ====================
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 0, // Case Name
    cell: 1, // Value column
    value: "Lehman Brothers Limited (In Liquidation)"
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 1, // Case Code
    cell: 1,
    value: "CVLLB205"
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 2, // Case Type
    cell: 1,
    value: "Creditors' Voluntary Liquidation (CVL)"
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 3, // Date of Appointment
    cell: 1,
    value: "15/09/2008"
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 4, // Office Holder(s)
    cell: 1,
    value: "Anthony Lomas, Licensed Insolvency Practitioner"
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 5, // Manager/Administrator
    cell: 1,
    value: "Michael Ali, Senior Case Manager"
  },

  // ====================
  // CHECKLIST TABLE (Table 1) - Status Column WITH DETAILED COMMENTS
  // ====================
  {
    type: "fillChecklistCell",
    tableIndex: 1,
    row: 1, // Task 1: Before proceeding with General Meeting - QFCH Notice
    cell: 3, // Status column (4th column, 0-indexed)
    value: "MA\n16/09/2008",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Notice to Qualifying Floating Charge Holders issued on 06/09/2008 with required 5 business days' notice period satisfied. Members' resolution passed on 13/09/2008.",
      references: [
        "cvl102_notice_to_qfch_06_09_2008.pdf",
        "engagement_planning_checklist_1.docx",
        "members_resolution_13_09_2008.pdf"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 1,
    row: 2, // Task 2: SoA verification and delivery
    cell: 3,
    value: "MA\n16/09/2008",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Statement of Affairs verified by director on 12/09/2008 and delivered to creditors on 26/09/2008, one business day before creditors' decision date.",
      references: [
        "statement_of_affairs_05_09_2008.pdf",
        "director_statement_of_truth_fuld.pdf",
        "creditor_distribution_records_26_09_2008.pdf"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 1,
    row: 3, // Task 3: Directors' meeting for SoA approval
    cell: 3,
    value: "MA\n16/09/2008",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Directors' meeting held on 11/09/2008 to approve Statement of Affairs and deficiency account. All directors provided statements of truth. Employee and creditor schedules prepared and included.",
      references: [
        "directors_meeting_minutes_11_09_2008.pdf",
        "draft_soa_and_deficiency_account.pdf",
        "statement_of_truth_fuld.pdf",
        "employee_claims_schedule.xlsx",
        "creditor_schedules.xlsx"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 1,
    row: 4, // Task 4: Limited disclosure assessment
    cell: 3,
    value: "N/A",
    checklistMetadata: {
      status: "⚠️ Not Required",
      commentary: "Disclosure risk assessment completed on 12/09/2008. No prejudice or violence risks identified. Full disclosure of Statement of Affairs applied.",
      references: [
        "disclosure_risk_assessment_12_09_2008.pdf",
        "creditor_analysis_report.pdf"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 1,
    row: 6, // Task 6: General Meeting notice requirements
    cell: 3,
    value: "MA\n16/09/2008",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "General Meeting notice issued on 01/09/2008 satisfying 14 days' notice requirement under s307 CA06. Notice included details of resolutions for liquidation and liquidator appointment per s302 CA06.",
      references: [
        "general_meeting_notice_01_09_2008.pdf",
        "company_articles_of_association.pdf",
        "members_register_extract.pdf"
      ]
    }
  }
];
