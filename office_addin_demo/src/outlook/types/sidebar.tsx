export type ThreadStatus = "following" | "not_following";

export type FilingItem = {
  id: string;
  filename: string;
  type?: string;
  confidence?: number;
  proposedDestination?: string;
  status: "unfiled" | "filed" | "needs_review" | "error";
  sourceMessageId: string;
  detectedEntities?: string[];
};

export type SidebarState = {
  threadId: string;
  threadStatus: ThreadStatus;
  filings: FilingItem[];
  email: {
    subject: string;
    bodyPreview: string;
    attachments: { id: string; name: string; mime: string }[];
  };
};

export type StatusFilter = "all" | "unfiled" | "filed" | "needs_review" | "error";
