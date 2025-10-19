/**
 * Mock Checklist Data for Creditors' Voluntary Liquidation - Checklist 3
 *
 * This file contains hardcoded checklist operations that simulate
 * auto-reviewing a CVL Checklist 3 document and filling in:
 * 1. Header table (Case Name, Case Code, etc.)
 * 2. Checklist table Status column with initials
 */

import type { FillChecklistCellOperation } from './types';

export const MOCK_CHECKLIST_OPERATIONS: FillChecklistCellOperation[] = [
  // ====================
  // HEADER TABLE (Table 0)
  // ====================
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 0, // Case Name
    cell: 1, // Value column
    value: "Acme Manufacturing Ltd (In Liquidation)",
    checklistMetadata: {
      status: "✅ Verified",
      commentary: "Company name confirmed from Companies House register and appointment documentation. Entity entered creditors' voluntary liquidation on 15 March 2024.",
      references: [
        "Companies House Certificate of Incorporation",
        "Form 600 (Notice of appointment) dated 15/03/2024",
        "Creditors' Resolution dated 15/03/2024"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 1, // Case Code
    cell: 1,
    value: "CVL519/2024",
    checklistMetadata: {
      status: "✅ Verified",
      commentary: "Internal case reference assigned upon appointment. Follows firm's CVL case numbering convention.",
      references: [
        "Internal case management system",
        "File opening documentation"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 2, // Case Type
    cell: 1,
    value: "Creditors' Voluntary Liquidation (CVL)",
    checklistMetadata: {
      status: "✅ Verified",
      commentary: "Case type confirmed as CVL under s90 Insolvency Act 1986. Members' resolution passed on 15 March 2024 followed by creditors' decision.",
      references: [
        "Members' Resolution s84 IA 1986",
        "Creditors' Decision dated 15/03/2024",
        "Statement of Affairs dated 14/03/2024"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 3, // Date of Appointment
    cell: 1,
    value: "15/03/2024",
    checklistMetadata: {
      status: "✅ Verified",
      commentary: "Liquidator appointment effective 15 March 2024 at 14:30 following creditors' decision procedure. Appointment confirmed via Companies House filing.",
      references: [
        "Form 600 filed 18/03/2024",
        "Creditors' Decision Notice",
        "Certificate of Appointment"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 4, // Office Holder(s)
    cell: 1,
    value: "Sarah Mitchell, Licensed Insolvency Practitioner",
    checklistMetadata: {
      status: "✅ Verified",
      commentary: "Sarah Mitchell (IP number 12345) appointed as sole liquidator. Authorised by ICAEW. Bond in place for £500,000.",
      references: [
        "IP License verification",
        "Professional indemnity insurance certificate",
        "Bond certificate ref: BOND-2024-0519"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 0,
    row: 5, // Manager/Administrator
    cell: 1,
    value: "David Thompson, Case Manager",
    checklistMetadata: {
      status: "✅ Verified",
      commentary: "David Thompson assigned as primary case manager, supported by junior associate Emma Williams. Both have relevant CVL experience.",
      references: [
        "Internal assignment documentation",
        "Case team org chart"
      ]
    }
  },

  // ====================
  // CHECKLIST TABLE (Table 1) - Status Column
  // ====================
  {
    type: "fillChecklistCell",
    tableIndex: 1,
    row: 1, // Task 1: Before proceeding with General Meeting
    cell: 3, // Status column (4th column, 0-indexed)
    value: "MA\n16/10/2025",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Based on review of company filings (CVL102.pdf), notice was sent on 06 September 2025 to all qualifying floating charge holders. The required 5 business day period has elapsed as of 13 September 2025. CVL102 issued as part of engagement planning per Checklist 1.",
      references: [
        "CVL102.pdf (QFCH Notice dated 06/09/2025)",
        "CVL103-L engagement letter",
        "Case Timeline Document",
        "Companies House filing dated 06/09/2025",
        "s84(2A) and s84(2B) Insolvency Act 1986"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 1,
    row: 2, // Task 2: Identify restrictions notices
    cell: 3,
    value: "MA\n16/10/2025",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Conducted comprehensive review of shareholder register and Companies House filings. No restriction notices found. Both shareholders (Rakesh Kotecha and Mahesh Kotecha) hold 50% each and have confirmed ability to exercise voting rights without restrictions. This is a small owner-managed company with no significant control restrictions.",
      references: [
        "Shareholder Register (current)",
        "Companies House PSC Register",
        "Director confirmation emails dated 10/09/2025",
        "Voting rights verification"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 1,
    row: 3, // Task 3: Decision date for creditors nomination
    cell: 3,
    value: "MA\n16/10/2025",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Members' resolution to wind up passed on 13 September 2025 at 10:00 AM. Creditors' decision date scheduled for 27 September 2025, which is exactly 14 days after the members' resolution. This complies with the statutory requirement that the decision date must be no later than 14 days after the resolution to wind up the company has been passed by the members.",
      references: [
        "Members' Resolution dated 13/09/2025",
        "Creditors' Decision Notice dated 13/09/2025",
        "s84(2A) Insolvency Act 1986",
        "Calendar calculation (13/09/2025 + 14 days = 27/09/2025)"
      ]
    }
  },
  {
    type: "fillChecklistCell",
    tableIndex: 1,
    row: 4, // Task 4: Ensure SoA is verified and delivered
    cell: 3,
    value: "MA\n16/10/2025",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Statement of Affairs verified by director Rakesh Kotecha on 12 September 2025 with statement of truth. SoA made up to date of 05 September 2025 (8 days before winding-up resolution). Copy delivered to creditors on 26 September 2025, one business day before creditors' decision date of 27 September 2025. The SoA is made up to a date not more than 14 days before the date of the winding-up resolution (05/09/2025 to 13/09/2025 = 8 days). All timing requirements under R6.14(7) and s99 satisfied.",
      references: [
        "Verified SoA dated 05/09/2025",
        "Director's Statement of Truth (R. Kotecha) dated 12/09/2025",
        "Creditor distribution records dated 26/09/2025",
        "R6.14(7) Insolvency Rules 2016",
        "s99 Insolvency Act 1986"
      ]
    }
  }
];
