import { SidebarState } from "../types/sidebar";

export const mockSidebarState: SidebarState = {
  threadId: "thread-12345",
  threadStatus: "following",
  filings: [
    {
      id: "filing-1",
      filename: "Contract_Amendment_2024.pdf",
      type: "Contract Amendment",
      confidence: 0.95,
      proposedDestination: "Contracts/Amendments/2024",
      status: "unfiled",
      sourceMessageId: "msg-001",
      detectedEntities: ["Acme Corp", "Q4 2024"],
    },
    {
      id: "filing-2",
      filename: "Invoice_45782.pdf",
      type: "Invoice",
      confidence: 0.88,
      proposedDestination: "Invoices/2024/October",
      status: "unfiled",
      sourceMessageId: "msg-001",
      detectedEntities: ["Invoice #45782", "$12,450"],
    },
    {
      id: "filing-3",
      filename: "Meeting_Notes.docx",
      type: "Meeting Notes",
      confidence: 0.72,
      proposedDestination: "Notes/Client Meetings",
      status: "needs_review",
      sourceMessageId: "msg-002",
      detectedEntities: ["John Smith", "Project Alpha"],
    },
    {
      id: "filing-4",
      filename: "Budget_Spreadsheet.xlsx",
      type: "Financial Report",
      confidence: 0.91,
      proposedDestination: "Finance/Reports/Q4",
      status: "filed",
      sourceMessageId: "msg-002",
      detectedEntities: ["Q4 Budget", "Department Summary"],
    },
    {
      id: "filing-5",
      filename: "Unknown_Document.pdf",
      type: undefined,
      confidence: 0.45,
      proposedDestination: undefined,
      status: "error",
      sourceMessageId: "msg-003",
      detectedEntities: [],
    },
  ],
  email: {
    subject: "Re: Q4 Contract Amendments and Invoice Review",
    bodyPreview:
      "Hi Sarah,\n\nThank you for sending over the contract amendments and the latest invoice. I've reviewed the terms and everything looks good from our end. Let me know if you need any additional information...",
    attachments: [
      { id: "att-1", name: "Contract_Amendment_2024.pdf", mime: "application/pdf" },
      { id: "att-2", name: "Invoice_45782.pdf", mime: "application/pdf" },
      { id: "att-3", name: "Budget_Spreadsheet.xlsx", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    ],
  },
};
