/**
 * Mock Checklist Data for Creditors' Voluntary Liquidation - Checklist 3
 *
 * This file contains hardcoded checklist operations that simulate
 * auto-reviewing a CVL checklist and filling in the "Initials & Date" column
 * with user initials and adding comments with status, commentary, and references.
 */

import type { FillChecklistCellOperation } from './types';

export const MOCK_CHECKLIST_OPERATIONS: FillChecklistCellOperation[] = [
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 1, // Task 1: Before proceeding with General Meeting
    cell: 4, // 5th column: "Initials & Date"
    value: "MA\n16/10/2025",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Based on review of company filings (CVL102.pdf), notice was sent on 06 September 2025 to all qualifying floating charge holders. The required 5 business day period has elapsed as of 13 September 2025.",
      references: [
        "CVL102.pdf (QFCH Notice dated 06/09/2025)",
        "Case Timeline Document",
        "Companies House filing dated 06/09/2025"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 2, // Task 2: Identify restrictions notices
    cell: 4,
    value: "MA\n16/10/2025",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Conducted comprehensive review of shareholder register and Companies House filings. No restriction notices found. Both shareholders (Rakesh Kotecha and Mahesh Kotecha) hold 50% each and have confirmed ability to exercise voting rights without restrictions.",
      references: [
        "Shareholder Register (current)",
        "Companies House PSC Register",
        "Director confirmation emails dated 10/09/2025"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 3, // Task 3: Decision date for creditors nomination
    cell: 4,
    value: "MA\n16/10/2025",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Members' resolution to wind up passed on 13 September 2025 at 10:00 AM. Creditors' decision date scheduled for 27 September 2025 (14 days after members' resolution), which complies with the statutory requirement.",
      references: [
        "Members' Resolution dated 13/09/2025",
        "Creditors' Decision Notice dated 13/09/2025",
        "s84(2A) Insolvency Act 1986"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 4, // Task 4: Ensure SoA is verified and delivered
    cell: 4,
    value: "MA\n16/10/2025",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Statement of Affairs verified by director Rakesh Kotecha on 12 September 2025 with statement of truth. SoA made up to date of 05 September 2025 (8 days before winding-up resolution). Copy delivered to creditors on 26 September 2025, one business day before creditors' decision date of 27 September 2025. All timing requirements under R6.14(7) and s99 satisfied.",
      references: [
        "Verified SoA dated 05/09/2025",
        "Director's Statement of Truth (R. Kotecha) dated 12/09/2025",
        "Creditor distribution records dated 26/09/2025",
        "R6.14(7) and s99 Insolvency Act 1986"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 5, // Task 5: Convene directors' meeting
    cell: 4,
    value: "MA\n16/10/2025",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Directors' meeting held on 11 September 2025 to review and approve draft SoA and deficiency account. SoA verified by Rakesh Kotecha (statement of truth). Mahesh Kotecha, Pragna Kotecha, and Trushali Kotecha submitted statements of concurrence. Directors were advised of penalties for false statements per s235 Insolvency Act 1986. Minutes signed by chairman R. Kotecha. All schedules prepared including employee claims schedule (3 employees, total £45,200) and consumer creditors schedule (none identified). HMRC secondary preferential status correctly reflected for VAT and PAYE owed since December 2020.",
      references: [
        "Directors' Meeting Minutes dated 11/09/2025",
        "CVL301-F (Statement of Affairs)",
        "Employee Claims Schedule (3 employees)",
        "Director Statements of Concurrence (M. Kotecha, P. Kotecha, T. Kotecha)",
        "s235 Insolvency Act 1986",
        "Insolvency Act 1986 (HMRC Debts: Priority on Insolvency) Regulations 2020"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 6, // Task 6: Limited disclosure if applicable
    cell: 4,
    value: "N/A",
    checklistMetadata: {
      status: "⚠️ Not Required",
      commentary: "No application to court for limited disclosure has been made. The liquidator has determined that full disclosure of the Statement of Affairs does not prejudice the conduct of the liquidation and is not reasonably expected to lead to violence against any person. Standard full disclosure procedures apply.",
      references: [
        "Liquidator's disclosure assessment dated 12/09/2025",
        "R6.6 Insolvency Rules 2016"
      ]
    }
  }
];
