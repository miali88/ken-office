/**
 * Mock LLM Response Data for Demo - Lehman Brothers Limited
 *
 * This file contains hardcoded document operations that simulate
 * what an AI backend would return. Perfect for demos without
 * requiring a live backend service.
 */

import type { DocumentOperation } from './types';

export const MOCK_LLM_OPERATIONS: DocumentOperation[] = [
  {
    type: "replaceText",
    target: "(years ending DD MM YYYY",
    value: "years ending 30 September 2007",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      sources: [
        "financial_records_2007.pdf",
        "annual_report_30_sept_2007.pdf"
      ]
    }
  },
  {
    type: "replacePlaceholder",
    target: "company_name",
    value: "LEHMAN BROTHERS LIMITED",
    replaceAll: true
  },
  {
    type: "replaceText",
    target: "….",
    value: "15 September 2008",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "replaceText",
    target: "(introducer)",
    value: "Michael Thompson, Barclays Capital",
    metadata: {
      confidence: "medium",
      sources: [
        "initial_advice.pdf"
      ]
    }
  },
  {
    type: "replaceText",
    target: "{{ CONDITION_1:",
    value: "",
    matchCase: false
  },
  {
    type: "replaceText",
    target: "EITHER: Prior to this date, neither the firm nor the proposed Liquidators have had any other involvement with the Company or its Director. OR: Prior to this date, the proposed liquidators have had involvement with the director",
    value: "Prior to this date, neither the firm nor the proposed Liquidators have had any other involvement with the Company or its Directors.",
    matchCase: false,
    metadata: {
      confidence: "medium",
      sources: [
        "conflict_ethical_checklist.docx"
      ]
    }
  },
  {
    type: "replaceText",
    target: "whether prior relationship has existed.",
    value: "",
    matchCase: false
  },
  {
    type: "replaceText",
    target: "}}",
    value: "",
    matchCase: false
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
    value: "15 September 2008",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{date_scheduled_for_s100}}",
    value: "19 September 2008",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{general_meeting_notice_date}}",
    value: "12 September 2008",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{general_meeting_datetime}}",
    value: "19 September 2008 at 11:00 AM",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{full_names_address_of_ip}}",
    value: "LEHMAN BROTHERS LIMITED, 25 Bank Street, Canary Wharf, London, E14 5LE",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      source: "case details and searchCaseDocuments"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{incorporation_date}}",
    value: "10 March 1988",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{company_reg_number}}",
    value: "02271988",
    replaceAll: true,
    metadata: {
      confidence: "high",
      source: "case details"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{trading_address}}",
    value: "25 Bank Street, Canary Wharf, London, E14 5LE",
    replaceAll: true,
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{company_trading_activity}}",
    value: "Investment banking and financial services",
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
    value: "10 March 1988",
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
    value: "15 May 2005",
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
    value: "1 Broadgate, London, EC2M 7HA",
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
    value: "16 May 2005",
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
    value: "25 Bank Street, Canary Wharf, London, E14 5LE",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "replacePlaceholder",
    target: "{{equity_capital_structure}}",
    value: "is £10,000,000, comprising 10,000,000 Ordinary shares of £1 each",
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
  // ====================
  // SHAREHOLDERS TABLE (Table 1) - 13 members
  // ====================
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 1,
    cell: 0,
    value: "Global Investment Holdings Ltd",
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
    value: "2,000,000",
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
    value: "20.0%",
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
    value: "Mr James Michael Richardson",
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
    value: "1,500,000",
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
    value: "15.0%",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 3,
    cell: 0,
    value: "Ms Sarah Wei Chen",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 3,
    cell: 1,
    value: "1,200,000",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 3,
    cell: 2,
    value: "12.0%",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 4,
    cell: 0,
    value: "Mr Amir Shah Patel",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 4,
    cell: 1,
    value: "1,000,000",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 4,
    cell: 2,
    value: "10.0%",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 5,
    cell: 0,
    value: "Metropolitan Capital Partners LLP",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 5,
    cell: 1,
    value: "800,000",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 5,
    cell: 2,
    value: "8.0%",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 6,
    cell: 0,
    value: "Ms Catherine Anne O'Brien",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 6,
    cell: 1,
    value: "800,000",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 6,
    cell: 2,
    value: "8.0%",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 7,
    cell: 0,
    value: "Mr Marcus Lee Anderson",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 7,
    cell: 1,
    value: "700,000",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 7,
    cell: 2,
    value: "7.0%",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 8,
    cell: 0,
    value: "Ms Rebecca Jane Thompson",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 8,
    cell: 1,
    value: "600,000",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 8,
    cell: 2,
    value: "6.0%",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 9,
    cell: 0,
    value: "Mr David Anthony Williams",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 9,
    cell: 1,
    value: "500,000",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 9,
    cell: 2,
    value: "5.0%",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 10,
    cell: 0,
    value: "Ms Sofia Isabel Martinez",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 10,
    cell: 1,
    value: "400,000",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 10,
    cell: 2,
    value: "4.0%",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 11,
    cell: 0,
    value: "Sterling Equity Fund LP",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 11,
    cell: 1,
    value: "300,000",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 11,
    cell: 2,
    value: "3.0%",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 12,
    cell: 0,
    value: "Phoenix Asset Management Ltd",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 12,
    cell: 1,
    value: "200,000",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 1,
    row: 12,
    cell: 2,
    value: "2.0%",
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
  // ====================
  // OFFICERS TABLE (Table 2) - 5 officers
  // ====================
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 1,
    cell: 0,
    value: "Mr James Michael Richardson",
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
    value: "Chief Executive Officer / Director",
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
    value: "10 March 1988",
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
    value: "Ms Sarah Wei Chen",
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
    value: "Chief Financial Officer / Director",
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
    value: "15 June 1995",
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
    value: "Mr Amir Shah Patel",
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
    value: "01 January 2000",
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
    value: "Ms Rebecca Jane Thompson",
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
    value: "Non-Executive Director",
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
    value: "12 March 2003",
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
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 5,
    cell: 0,
    value: "Mr Marcus Lee Anderson",
    metadata: {
      confidence: "high",
      source: "case details"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 5,
    cell: 1,
    value: "Company Secretary",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 5,
    cell: 2,
    value: "20 July 2005",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  },
  {
    type: "fillTableCell",
    tableIndex: 2,
    row: 5,
    cell: 3,
    value: "N/A",
    metadata: {
      confidence: "medium",
      source: "searchCaseDocuments"
    }
  }
];
