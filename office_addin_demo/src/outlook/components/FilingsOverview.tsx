import React from "react";
import { useState } from "react";
import { FilingItem, StatusFilter, ThreadStatus } from "../types/sidebar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { FilingItemCard } from "./FilingItemCard";
import { FileText, AlertCircle, Folder } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface FilingsOverviewProps {
  filings: FilingItem[];
  threadStatus: ThreadStatus;
  onToggleThreadStatus: () => void;
  onApprove: (id: string) => void;
  onApproveAll: () => void;
  onEdit: (id: string) => void;
  onRefile: (id: string) => void;
  onOpenSource: (messageId: string) => void;
}

export function FilingsOverview({
  filings,
  threadStatus,
  onToggleThreadStatus,
  onApprove,
  onApproveAll,
  onEdit,
  onRefile,
  onOpenSource,
}: FilingsOverviewProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const fileCount = filings.length;
  const unfiledCount = filings.filter((f) => f.status === "unfiled").length;
  const errorsCount = filings.filter((f) => f.status === "error").length;

  const filteredFilings = filings.filter((filing) => {
    if (statusFilter === "all") return true;
    return filing.status === statusFilter;
  });

  // Group by source message
  const groupedByMessage = filteredFilings.reduce((acc, filing) => {
    if (!acc[filing.sourceMessageId]) {
      acc[filing.sourceMessageId] = [];
    }
    acc[filing.sourceMessageId].push(filing);
    return acc;
  }, {} as Record<string, FilingItem[]>);

  return (
    <div className="space-y-4">
      {/* Thread status control */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Label htmlFor="follow-thread">Follow this thread</Label>
          {threadStatus === "following" && (
            <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
              Following
            </Badge>
          )}
        </div>
        <Switch
          id="follow-thread"
          checked={threadStatus === "following"}
          onCheckedChange={onToggleThreadStatus}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Files</SelectItem>
            <SelectItem value="unfiled">Unfiled</SelectItem>
            <SelectItem value="filed">Filed</SelectItem>
            <SelectItem value="needs_review">Needs Review</SelectItem>
            <SelectItem value="error">Errors</SelectItem>
          </SelectContent>
        </Select>

        {unfiledCount > 0 && (
          <Button size="sm" onClick={onApproveAll}>
            Approve All ({unfiledCount})
          </Button>
        )}
      </div>

      <Separator />

      {/* Filings list */}
      {fileCount === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No documents found in this thread</p>
        </div>
      ) : filteredFilings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No documents match the current filter</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByMessage).map(([messageId, items], idx) => (
            <div key={messageId} className="space-y-2">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span>Message {idx + 1}</span>
                <Badge variant="outline" className="text-xs">
                  {items.length} {items.length === 1 ? "file" : "files"}
                </Badge>
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <FilingItemCard
                    key={item.id}
                    item={item}
                    onApprove={onApprove}
                    onEdit={onEdit}
                    onRefile={onRefile}
                    onOpenSource={onOpenSource}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function FilingsOverviewSummary({
  fileCount,
  unfiledCount,
  errorsCount,
  threadStatus,
}: {
  fileCount: number;
  unfiledCount: number;
  errorsCount: number;
  threadStatus: ThreadStatus;
}) {
  return (
    <div className="flex items-center justify-between w-full min-w-0 gap-2 overflow-hidden">
      <div className="flex items-center gap-2 flex-shrink-0">
        <FileText className="w-4 h-4" />
        <span className="font-medium text-sm">Filings</span>
      </div>
      <div className="flex items-center gap-1 flex-wrap justify-end">
        {fileCount > 0 && <Badge variant="outline">{fileCount}</Badge>}
        {unfiledCount > 0 && <Badge variant="secondary">{unfiledCount} unfiled</Badge>}
        {errorsCount > 0 && (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            {errorsCount}
          </Badge>
        )}
        <Badge variant={threadStatus === "following" ? "default" : "outline"} className={threadStatus === "following" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : ""}>
          {threadStatus === "following" ? "Following" : "Not following"}
        </Badge>
      </div>
    </div>
  );
}
