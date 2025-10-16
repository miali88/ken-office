/**
 * Mock LLM Response Data for Demo
 *
 * This file contains hardcoded document operations that simulate
 * what an AI backend would return. Perfect for demos without
 * requiring a live backend service.
 */

import type { DocumentOperation } from './types';

export const MOCK_LLM_OPERATIONS: DocumentOperation[] = [
  {
    type: "replacePlaceholder",
    target: "{{company_name}}",
    value: "ABERDEEN HOUSE CARE LIMITED",
    replaceAll: true,
    metadata: {
      confidence: "high",
      source: "case details"
    }
  },
  {
    type: "replaceText",
    target: "….",
    value: "10 September 2025",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "replaceText",
    target: "(introducer)",
    value: "[TO BE COMPLETED - Introducer Name]",
    metadata: {
      confidence: "low",
      source: "manual input"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{ CONDITION_1: whether prior relationship has existed. EITHER: Prior to this date, neither the firm nor the proposed Liquidators have had any other involvement with the Company or its Director. OR: Prior to this date, the proposed liquidators have had involvement with the director….}}",
    value: "Prior to this date, neither the firm nor the proposed Liquidators have had any other involvement with the Company or its Director.",
    metadata: {
      confidence: "medium",
      source: "default assumption"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{our_firm_name}}",
    value: "Kenneth AI",
    replaceAll: true,
    metadata: {
      confidence: "high",
      source: "case details"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{instruction_date}}",
    value: "10 September 2025",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{date_scheduled_for_s100}}",
    value: "13 September 2025",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{general_meeting_notice_date}}",
    value: "06 September 2025",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{general_meeting_datetime}}",
    value: "13 September 2025 at 10:00 AM",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{full_names_address_of_ip}}",
    value: "ABERDEEN HOUSE CARE LIMITED, 123 Fictional Lane, Anytown, AB1 2CD",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      source: "case details and searchCaseDocuments"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{incorporation_date}}",
    value: "15 June 2011",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{company_reg_number}}",
    value: "07658860",
    replaceAll: true,
    metadata: {
      confidence: "high",
      source: "case details"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{trading_address}}",
    value: "456 Business Road, Cityville, CV1 2EF",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{company_trading_activity}}",
    value: "Operating care homes",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "deleteText",
    target: "{{below table should be populated with list of previous registered addresses}}",
    metadata: {
      confidence: "high",
      reasoning: "Template instruction for table below"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 0,
    row: 1,
    cell: 0,
    value: "15 June 2011",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 0,
    row: 1,
    cell: 1,
    value: "31 December 2023",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 0,
    row: 1,
    cell: 2,
    value: "789 Old Street, Townsville, TS1 2GH",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 0,
    row: 2,
    cell: 0,
    value: "01 January 2024",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 0,
    row: 2,
    cell: 1,
    value: "Current",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 0,
    row: 2,
    cell: 2,
    value: "Business Helpline Group Limited, 101 New Avenue, Metropolis, MT1 2IJ",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{equity_capital_structure}}",
    value: "is £100,000, comprising 100,000 Ordinary shares of £1 each",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "deleteText",
    target: "{{below table should list the name, shares and percentage of each shareholder}}",
    metadata: {
      confidence: "high",
      reasoning: "Template instruction for table below"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 1,
    cell: 0,
    value: "KOTECHA, Rakesh",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 1,
    cell: 1,
    value: "50,000",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 1,
    cell: 2,
    value: "50%",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 2,
    cell: 0,
    value: "KOTECHA, Mahesh Vithaldas",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 2,
    cell: 1,
    value: "50,000",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 2,
    cell: 2,
    value: "50%",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "deleteText",
    target: "{{below table should list the schema for officers of the company}}",
    metadata: {
      confidence: "high",
      reasoning: "Template instruction for table below"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 1,
    cell: 0,
    value: "KOTECHA, Rakesh",
    metadata: {
      confidence: "high",
      source: "case details"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 1,
    cell: 1,
    value: "Director",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 1,
    cell: 2,
    value: "15 June 2011",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 1,
    cell: 3,
    value: "N/A",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 2,
    cell: 0,
    value: "KOTECHA, Mahesh Vithaldas",
    metadata: {
      confidence: "high",
      source: "case details"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 2,
    cell: 1,
    value: "Director",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 2,
    cell: 2,
    value: "15 June 2011",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 2,
    cell: 3,
    value: "N/A",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 3,
    cell: 0,
    value: "KOTECHA, Pragna",
    metadata: {
      confidence: "high",
      source: "case details"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 3,
    cell: 1,
    value: "Director",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 3,
    cell: 2,
    value: "01 January 2015",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 3,
    cell: 3,
    value: "N/A",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 4,
    cell: 0,
    value: "KOTECHA, Trushali",
    metadata: {
      confidence: "high",
      source: "case details"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 4,
    cell: 1,
    value: "Director",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 4,
    cell: 2,
    value: "01 January 2015",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 4,
    cell: 3,
    value: "N/A",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  }
];
