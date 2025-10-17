import React, { useState } from "react";
import { mockSidebarState } from "./lib/mock-data";
import { SidebarState, FilingItem } from "./types/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import {
  FilingsOverview,
  FilingsOverviewSummary,
} from "./components/FilingsOverview";
import {
  EmailResponseCard,
  EmailResponseSummary,
} from "./components/EmailResponseCard";
import { MetadataDrawer } from "./components/MetadataDrawer";
import { ScrollArea } from "./components/ui/scroll-area";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

export default function App() {
  const [state, setState] =
    useState<SidebarState>(mockSidebarState);
  const [selectedItem, setSelectedItem] =
    useState<FilingItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleToggleThreadStatus = () => {
    setState((prev) => ({
      ...prev,
      threadStatus:
        prev.threadStatus === "following"
          ? "not_following"
          : "following",
    }));
    toast.success(
      state.threadStatus === "following"
        ? "Stopped following thread"
        : "Now following thread",
    );
  };

  const handleApprove = (id: string) => {
    setState((prev) => ({
      ...prev,
      filings: prev.filings.map((f) =>
        f.id === id ? { ...f, status: "filed" as const } : f,
      ),
    }));
    toast.success("Document approved and filed");
  };

  const handleApproveAll = () => {
    setState((prev) => ({
      ...prev,
      filings: prev.filings.map((f) =>
        f.status === "unfiled"
          ? { ...f, status: "filed" as const }
          : f,
      ),
    }));
    const count = state.filings.filter(
      (f) => f.status === "unfiled",
    ).length;
    toast.success(
      `${count} document${count !== 1 ? "s" : ""} approved and filed`,
    );
  };

  const handleEdit = (id: string) => {
    const item = state.filings.find((f) => f.id === id);
    if (item) {
      setSelectedItem(item);
      setDrawerOpen(true);
    }
  };

  const handleSaveMetadata = (
    id: string,
    metadata: Partial<FilingItem>,
  ) => {
    setState((prev) => ({
      ...prev,
      filings: prev.filings.map((f) =>
        f.id === id ? { ...f, ...metadata } : f,
      ),
    }));
    toast.success("Metadata updated");
  };

  const handleRefile = (id: string) => {
    toast.info("Refile dialog would open here");
  };

  const handleOpenSource = (messageId: string) => {
    toast.info(`Opening message: ${messageId}`);
  };

  const handleDraftReply = () => {
    toast.success("AI is generating a reply...");
  };

  const handleSummarize = () => {
    toast.success("Summarizing email...");
  };

  const handleExtractData = () => {
    toast.success("Extracting key data...");
  };

  const handleInsertTemplate = () => {
    toast.info("Template library would open here");
  };

  const fileCount = state.filings.length;
  const unfiledCount = state.filings.filter(
    (f) => f.status === "unfiled",
  ).length;
  const errorsCount = state.filings.filter(
    (f) => f.status === "error",
  ).length;

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Kenneth AI Assistant Header */}
      <header className="border-b px-4 py-3 flex-shrink-0">
        <h2 className="text-gray-900">
          Kenneth AI Assistant
        </h2>
        <p className="text-sm text-gray-500">
          Thread-aware dashboard
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
          <Accordion
            type="multiple"
            defaultValue={[]}
            className="space-y-2"
          >
              <AccordionItem
                value="filings"
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <FilingsOverviewSummary
                    fileCount={fileCount}
                    unfiledCount={unfiledCount}
                    errorsCount={errorsCount}
                    threadStatus={state.threadStatus}
                  />
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <FilingsOverview
                    filings={state.filings}
                    threadStatus={state.threadStatus}
                    onToggleThreadStatus={
                      handleToggleThreadStatus
                    }
                    onApprove={handleApprove}
                    onApproveAll={handleApproveAll}
                    onEdit={handleEdit}
                    onRefile={handleRefile}
                    onOpenSource={handleOpenSource}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="email-response"
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <EmailResponseSummary
                    subject={state.email.subject}
                    attachmentCount={
                      state.email.attachments.length
                    }
                  />
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <EmailResponseCard
                    subject={state.email.subject}
                    bodyPreview={state.email.bodyPreview}
                    attachments={state.email.attachments}
                    onDraftReply={handleDraftReply}
                    onSummarize={handleSummarize}
                    onExtractData={handleExtractData}
                    onInsertTemplate={handleInsertTemplate}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </main>

      <MetadataDrawer
        item={selectedItem}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSaveMetadata}
      />

      <Toaster />
    </div>
  );
}