/**
 * Mock Data for Corporate - 12 Month Periodic Case Review
 *
 * This file contains hardcoded operations that simulate auto-reviewing
 * a periodic case review document and filling in all required fields
 * with synthetic data, commentary, and references.
 */

import type { DocumentOperation } from './types';

export const MOCK_PERIODIC_CASE_REVIEW_OPERATIONS: DocumentOperation[] = [
  // ====================
  // HEADER INFORMATION
  // ====================
  {
    type: "fillTableCell",
    tableIndex: 0,
    row: 0, // Case Name row
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
    type: "fillTableCell",
    tableIndex: 0,
    row: 1, // Case Code row
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
    type: "fillTableCell",
    tableIndex: 0,
    row: 2, // Case Type row
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
    type: "fillTableCell",
    tableIndex: 0,
    row: 3, // Date of Appointment row
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
    type: "fillTableCell",
    tableIndex: 0,
    row: 4, // Office Holder(s) row
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
    type: "fillTableCell",
    tableIndex: 0,
    row: 5, // Manager/Administrator row
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
  // REVIEW INFORMATION (Right side table)
  // ====================
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 0, // Date of last case review
    cell: 1,
    value: "15",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Previous 6-month case review completed 15 September 2024. All actions from prior review addressed.",
      references: [
        "Previous case review file dated 15/09/2024",
        "Action log (all items closed)"
      ]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 0, // Month
    cell: 2,
    value: "09",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Month of last review: September 2024",
      references: ["Previous case review documentation"]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 0, // Year
    cell: 3,
    value: "24",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Year of last review: 2024",
      references: ["Previous case review documentation"]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 1, // Review carried out by
    cell: 1,
    value: "Michael Ali, Senior Manager",
    checklistMetadata: {
      status: "✅ Verified",
      commentary: "Current 12-month review conducted by Michael Ali (Senior Manager) with oversight from Sarah Mitchell (Office Holder).",
      references: [
        "Review assignment email dated 01/03/2025",
        "Quality assurance checklist"
      ]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 1, // Date - Day
    cell: 2,
    value: "15",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Review date: 15 March 2025 (12 months post-appointment)",
      references: ["Review documentation"]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 1, // Date - Month
    cell: 3,
    value: "03",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Review month: March 2025",
      references: ["Review documentation"]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 1, // Date - Year
    cell: 4,
    value: "25",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Review year: 2025",
      references: ["Review documentation"]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 2, // Office Holder sign-off - Day
    cell: 2,
    value: "18",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Office holder sign-off date: 18 March 2025. Review approved by Sarah Mitchell after quality review.",
      references: [
        "Sign-off email dated 18/03/2025",
        "Quality review checklist"
      ]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 2, // Office Holder sign-off - Month
    cell: 3,
    value: "03",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Sign-off month: March 2025",
      references: ["Sign-off documentation"]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 2, // Office Holder sign-off - Year
    cell: 4,
    value: "25",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Sign-off year: 2025",
      references: ["Sign-off documentation"]
    }
  },

  // ====================
  // CASE PROGRESSION - OVERVIEW
  // ====================
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 1, // Assets - Yes column
    cell: 1,
    value: "X",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "All company assets have been realised. Plant & machinery sold at auction (£125,000), stock sold to trade buyer (£45,000), and debtor book collected (£23,400 recovered from £67,000). No CVA contributions applicable. Total realisations: £193,400.",
      references: [
        "Asset realisation schedule dated 15/03/2025",
        "Auction report - Jones & Co Auctioneers dated 20/05/2024",
        "Stock sale agreement with TradeWorks Ltd dated 15/06/2024",
        "Debtor collection summary as at 28/02/2025",
        "Asset register (all items marked as realised)"
      ]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 2, // Investigations - N/A column
    cell: 3,
    value: "X",
    checklistMetadata: {
      status: "⚠️ Not Required",
      commentary: "This is a CVL case. Director conduct investigations under the Company Directors Disqualification Act 1986 do not apply to CVL cases. Investigations are only mandatory for compulsory liquidations (CWU), administrations (ADM), and administrative receiverships. The liquidator has conducted preliminary enquiries and found no evidence of fraudulent or wrongful trading requiring separate investigation.",
      references: [
        "CDDA 1986 s7(3) - applies to CWU/ADM only",
        "Preliminary enquiries memo dated 20/04/2024",
        "Director conduct assessment (no concerns identified)",
        "SIP 2 guidance notes"
      ]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 5, // Dividends - Yes column
    cell: 1,
    value: "X",
    checklistMetadata: {
      status: "✅ Anticipated",
      commentary: "A dividend is anticipated to preferential creditors and unsecured creditors including prescribed part. Based on current asset realisations of £193,400 and estimated total costs of £45,000, we project: Preferential creditors (employees): 100p/£ on claims of £45,200. Prescribed part: estimated £8,000 available. Unsecured creditors: estimated 12-15p/£ on claims of £234,567. No secured creditors. First and final dividend targeted for Q3 2025 pending completion of final reconciliations.",
      references: [
        "Dividend projection dated 01/03/2025",
        "Asset realisation schedule (£193,400 total)",
        "Cost estimate (£45,000 including time costs and disbursements)",
        "Preferential creditor claims (verified £45,200)",
        "Unsecured creditor claims (£234,567 admitted)",
        "Prescribed part calculation per s176A IA 1986"
      ]
    }
  },

  // ====================
  // CASE PROGRESSION - DETAILED ITEMS
  // ====================
  {
    type: "fillTableCell",
    tableIndex: 3,
    row: 0, // Period end date of last progress report - Day
    cell: 1,
    value: "14",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Last progress report to creditors covered period ending 14 September 2024 (6 months post-appointment). Report issued to all creditors on 28 September 2024 in compliance with s192 IA 1986 requirement (within 14 days of period end).",
      references: [
        "Progress report dated 28/09/2024",
        "Creditor mailing list (67 creditors)",
        "Proof of postage dated 28/09/2024",
        "s192 Insolvency Act 1986",
        "Rule 18.3 Insolvency Rules 2016"
      ]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 3,
    row: 0, // Month
    cell: 2,
    value: "09",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Last progress report period end month: September 2024",
      references: ["Progress report dated 28/09/2024"]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 3,
    row: 0, // Year
    cell: 3,
    value: "24",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Last progress report period end year: 2024",
      references: ["Progress report dated 28/09/2024"]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 3,
    row: 2, // First progress report due - Day (if no reports issued)
    cell: 1,
    value: "N/A",
    checklistMetadata: {
      status: "⚠️ Not Applicable",
      commentary: "Not applicable - progress reports have been issued. First report was due by 29 March 2024 (covering period to 14/03/2024) and was issued on 25 March 2024. Subsequent reports issued on schedule.",
      references: [
        "First progress report dated 25/03/2024",
        "Second progress report dated 28/09/2024"
      ]
    }
  },

  // ====================
  // VAT RETURNS
  // ====================
  {
    type: "fillTableCell",
    tableIndex: 4,
    row: 0, // VAT returns up to date - Yes
    cell: 1,
    value: "X",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "All post-appointment VAT returns are up to date. Final return submitted for period ending 28 February 2025 (submitted 31/03/2025). Company deregistered for VAT effective 31 March 2025 following completion of all trading activity and asset realisations. VAT on debt factoring fees has been recovered where applicable (£3,450 recovered). No outstanding VAT compliance issues.",
      references: [
        "VAT return periods: 01/04/24-30/06/24, 01/07/24-30/09/24, 01/10/24-31/12/24, 01/01/25-28/02/25",
        "Final VAT return submitted 31/03/2025",
        "VAT deregistration confirmation from HMRC dated 15/04/2025",
        "VAT recovery schedule (debt factoring fees £3,450)",
        "HMRC correspondence file"
      ]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 4,
    row: 2, // De-registered for VAT - Yes
    cell: 1,
    value: "X",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Company successfully deregistered for VAT effective 31 March 2025. Deregistration application submitted 15 March 2025 following completion of all taxable activities. HMRC confirmation received 15 April 2025. No further VAT obligations remain.",
      references: [
        "VAT deregistration application dated 15/03/2025",
        "HMRC deregistration confirmation letter dated 15/04/2025",
        "VAT certificate of deregistration",
        "Final VAT account reconciliation"
      ]
    }
  },

  // ====================
  // BANK RECONCILIATIONS
  // ====================
  {
    type: "fillTableCell",
    tableIndex: 5,
    row: 0, // Date of latest bank reconciliation - Day
    cell: 1,
    value: "28",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Latest bank reconciliation completed for month ending 28 February 2025. Reconciliation shows closing balance of £67,234.56 in liquidation account (Barclays a/c ****1234). All receipts and payments verified against supporting documentation. No unreconciled items. Copy appended to case file.",
      references: [
        "Bank reconciliation dated 28/02/2025 (appended to review)",
        "Bank statement Barclays a/c ****1234 (Feb 2025)",
        "Receipts & payments ledger",
        "Supporting vouchers file (all items verified)",
        "Cash book balance: £67,234.56"
      ]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 5,
    row: 0, // Month
    cell: 2,
    value: "02",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Latest bank reconciliation month: February 2025",
      references: ["Bank reconciliation dated 28/02/2025"]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 5,
    row: 0, // Year
    cell: 3,
    value: "25",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "Latest bank reconciliation year: 2025",
      references: ["Bank reconciliation dated 28/02/2025"]
    }
  },

  // ====================
  // CT RETURNS
  // ====================
  {
    type: "fillTableCell",
    tableIndex: 6,
    row: 0, // CT returns outstanding - No
    cell: 2,
    value: "X",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "No corporation tax returns are outstanding. Final CT return for period ending 14 March 2024 (date of liquidation) submitted to HMRC on 15 January 2025. Return showed trading loss of £156,789 with no tax liability. HMRC confirmation of receipt obtained. All prior year returns were filed pre-appointment and verified as up to date. No outstanding CT compliance issues.",
      references: [
        "Final CT return for period ending 14/03/2024 (submitted 15/01/2025)",
        "HMRC filing confirmation dated 20/01/2025",
        "Tax computation showing loss of £156,789",
        "Director confirmation that prior years filed",
        "Companies House accounts filing history (verified current)",
        "HMRC CT account statement (no balance outstanding)"
      ]
    }
  },

  // ====================
  // BRIBERY ACT
  // ====================
  {
    type: "fillTableCell",
    tableIndex: 7,
    row: 0, // Bribery Act concerns - No
    cell: 2,
    value: "X",
    checklistMetadata: {
      status: "✅ Reviewed",
      commentary: "No factors have come to light since appointment or the last case review that give rise to any concern under the Bribery Act 2010. Company operated in low-risk domestic manufacturing sector. Review of books and records, director interviews, and creditor correspondence revealed no indicators of bribery, corruption, or facilitation payments. No overseas operations or high-risk jurisdictions involved. No suspicious payments identified in bank account review. No concerns raised by employees or third parties.",
      references: [
        "Bribery Act risk assessment dated 15/03/2025",
        "Books and records review (no concerns)",
        "Director interviews dated 20/03/2024 and 15/09/2024",
        "Bank account review (all payments verified as legitimate)",
        "Supplier and customer base analysis (all UK-based)",
        "Bribery Act 2010 s7 (failure to prevent bribery)"
      ]
    }
  },

  // ====================
  // ETHICAL REVIEW
  // ====================
  {
    type: "fillTableCell",
    tableIndex: 8,
    row: 0, // Ethical issues - No
    cell: 2,
    value: "X",
    checklistMetadata: {
      status: "✅ Reviewed",
      commentary: "No matters have come to light since appointment or last review that raise a potential threat to the five fundamental principles of the IESBA Code of Ethics (integrity, objectivity, professional competence and due care, confidentiality, professional behaviour). Pre-appointment ethical considerations remain appropriate and effective. No conflicts of interest identified. Professional indemnity insurance current. Independence maintained throughout the appointment. No complaints received from stakeholders. Compliance with SIP 3 (ethics) confirmed.",
      references: [
        "Pre-appointment ethical risk assessment dated 10/03/2024",
        "Ongoing ethical review dated 15/03/2025",
        "Conflicts of interest register (nil entries)",
        "Professional indemnity insurance certificate (current to 31/12/2025)",
        "Stakeholder correspondence log (no complaints)",
        "SIP 3 compliance checklist",
        "IESBA Code of Ethics fundamental principles review"
      ]
    }
  },

  // ====================
  // 3RD PARTY INSTRUCTIONS
  // ====================
  {
    type: "fillTableCell",
    tableIndex: 9,
    row: 0, // 3rd party instructions documented - Yes
    cell: 1,
    value: "X",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "All third-party adviser and service provider instructions have been documented in accordance with SIP 9. Service providers: (1) Jones & Co Auctioneers - asset disposal services, instructed 01/04/2024; (2) TradeWorks Ltd - stock purchase, negotiated 15/05/2024; (3) Debt Collection Services - debtor recovery, instructed 01/05/2024; (4) Smith & Partners Solicitors - employment law advice, instructed 20/03/2024. All instructions include documented terms, fee arrangements, and approval by Office Holder. Best value assessments conducted via competitive quotes where appropriate (3 quotes obtained for auctioneers). Service quality monitored throughout engagement. No issues identified.",
      references: [
        "3rd party instruction letters (all on file)",
        "Jones & Co engagement letter dated 01/04/2024",
        "TradeWorks stock purchase agreement dated 15/06/2024",
        "Debt Collection Services instruction letter dated 01/05/2024",
        "Smith & Partners engagement letter dated 20/03/2024",
        "Competitive quote analysis (auctioneers - 3 quotes)",
        "Best value assessment memo dated 25/03/2024",
        "Service provider performance reviews",
        "SIP 9 compliance checklist",
        "Office Holder approval emails (all engagements)"
      ]
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 9,
    row: 1, // Best value review - Yes
    cell: 1,
    value: "X",
    checklistMetadata: {
      status: "✅ Completed",
      commentary: "All third-party instructions have been reviewed with regard to best value and service quality at 12-month review date. Review confirmed: (1) Auctioneers achieved strong realisation (£125k vs. estimate £95-110k); (2) Stock sale negotiated effectively (£45k for inventory); (3) Debt collection service recovered 34.8% of book value (industry average 25-30%); (4) Legal fees for employment matters reasonable and necessary. All services delivered satisfactorily. No changes to service providers required. Best value achieved across all engagements.",
      references: [
        "Best value review memo dated 15/03/2025",
        "Auctioneer performance: realisations vs. estimates analysis",
        "Debt recovery analysis: 34.8% vs. industry benchmark 25-30%",
        "Legal fees review: £4,500 for 3 employment tribunal matters",
        "Service provider satisfaction assessment",
        "SIP 9 ongoing review requirements",
        "Alternative service provider market analysis (no change required)"
      ]
    }
  }
];
