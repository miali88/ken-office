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
    value: "Acme Manufacturing Ltd (In Liquidation)"
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 1, // Case Code
    cell: 1,
    value: "CVL519/2024"
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
    value: "15/03/2024"
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 4, // Office Holder(s)
    cell: 1,
    value: "Sarah Mitchell, Licensed Insolvency Practitioner"
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 5, // Manager/Administrator
    cell: 1,
    value: "David Thompson, Case Manager"
  },

  // ====================
  // CHECKLIST TABLE (Table 1) - Status Column WITH DETAILED COMMENTS
  // ====================
  {
    type: "fillChecklistCell",
    tableIndex: 1,
    row: 1, // Task 1: Before proceeding with General Meeting - QFCH Notice
    cell: 3, // Status column (4th column, 0-indexed)
    value: "MA\n16/10/2025",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "CVL102 (Notice to Qualifying Floating Charge Holders) was issued on 06 September 2025 as part of engagement planning documented in Checklist 1. The notice provided the required 5 business days' notice period. Notice period calculation: issued 06/09/2025, 5 business days elapsed by 13/09/2025 (excluding weekends). Members' resolution passed on 13/09/2025 after the full notice period elapsed. No QFCH consented to proceed sooner. All timing requirements under s84(2A) and s84(2B) Insolvency Act 1986 have been satisfied.",
      references: [
        "CVL102 - Notice to QFCH dated 06/09/2025",
        "Engagement planning documentation (Checklist 1)",
        "Members' Resolution dated 13/09/2025",
        "Notice period calculation (06/09 + 5 business days = 13/09)",
        "s84(2A) Insolvency Act 1986",
        "s84(2B) Insolvency Act 1986"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 1,
    row: 2, // Task 2: SoA verification and delivery
    cell: 3,
    value: "MA\n16/10/2025",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Statement of Affairs verified by director Rakesh Kotecha on 12 September 2025 with formal statement of truth in accordance with R6.14(7). SoA made up to date of 05 September 2025. Verification that SoA date is within 14 days of winding-up resolution: SoA date 05/09/2025 to resolution date 13/09/2025 = 8 days (compliant). Copy of verified SoA delivered to all creditors on 26 September 2025, which is one business day before the creditors' decision date of 27 September 2025, satisfying the requirement to deliver 'not later than on the business day before the planned creditors' decision date' per s99 Insolvency Act 1986.",
      references: [
        "Statement of Affairs made up to 05/09/2025",
        "Director's statement of truth (R. Kotecha) dated 12/09/2025",
        "14-day calculation: 05/09/2025 to 13/09/2025 = 8 days",
        "Creditor distribution records dated 26/09/2025",
        "Creditors' decision date: 27/09/2025",
        "R6.14(7) Insolvency Rules 2016",
        "s99 Insolvency Act 1986"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 1,
    row: 3, // Task 3: Directors' meeting for SoA approval
    cell: 3,
    value: "MA\n16/10/2025",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Directors' meeting convened and held on 11 September 2025 to discuss and approve draft Statement of Affairs and deficiency account. SoA verified by director Rakesh Kotecha via statement of truth dated 12/09/2025. Remaining directors (Mahesh Kotecha, Pragna Kotecha, Trushali Kotecha) submitted statements of concurrence verified by statements of truth. All directors were advised of penalties for making false statements under s235 Insolvency Act 1986. Meeting minutes produced and signed by chairman R. Kotecha. Separate schedules prepared: (1) Employee/former employee claims schedule showing 3 employees with total claims of £45,200; (2) Consumer creditors schedule (none identified). Schedules included in SoA distributed to creditors but excluded from Companies House filing. SoA content accurately reflects HMRC's secondary preferential status for VAT and PAYE owed from December 2020 onwards per Insolvency Act 1986 (HMRC Debts: Priority on Insolvency) Regulations 2020 (effective 01/12/2020).",
      references: [
        "Directors' meeting minutes dated 11/09/2025 (signed by chairman)",
        "Draft SoA and deficiency account (approved 11/09/2025)",
        "Statement of truth - R. Kotecha dated 12/09/2025",
        "Statements of concurrence - M. Kotecha, P. Kotecha, T. Kotecha",
        "s235 penalty warning documentation",
        "Employee claims schedule (3 employees, £45,200 total)",
        "Consumer creditors schedule (nil)",
        "HMRC secondary preferential debt calculations (VAT/PAYE from Dec 2020)",
        "Insolvency Act 1986 (HMRC Debts: Priority on Insolvency) Regulations 2020"
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
      commentary: "Liquidator conducted assessment on 12 September 2025 to determine whether disclosure of the whole or part of the Statement of Affairs may prejudice the conduct of the liquidation or might reasonably be expected to lead to violence against any person per R6.6 Insolvency Rules 2016. Assessment concluded that no such risk exists. The company operated a straightforward manufacturing business with no contentious creditors, no evidence of fraud, and no threats or safety concerns identified. Standard full disclosure of SoA determined appropriate. No application to court for limited disclosure order required. No restricted SoA or Form LIQ05 filing necessary.",
      references: [
        "Liquidator's disclosure risk assessment dated 12/09/2025",
        "Assessment conclusion: no prejudice/violence risk identified",
        "Company nature: straightforward manufacturing business",
        "Creditor analysis: no contentious parties identified",
        "Standard disclosure applied",
        "R6.6 Insolvency Rules 2016 (limited disclosure provisions)",
        "No court application filed",
        "No Form LIQ05 required"
      ]
    }
  }
];
