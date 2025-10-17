import React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { FileText, FileSpreadsheet, File, Paperclip, Sparkles, FileType, Database, Edit2 } from "lucide-react";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";

interface EmailResponseCardProps {
  subject: string;
  bodyPreview: string;
  attachments: { id: string; name: string; mime: string }[];
  onDraftReply: () => void;
  onSummarize: () => void;
  onExtractData: () => void;
  onInsertTemplate: () => void;
}

const getFileIcon = (mime: string) => {
  if (mime.includes("pdf")) {
    return <FileText className="w-4 h-4" />;
  }
  if (mime.includes("spreadsheet") || mime.includes("excel")) {
    return <FileSpreadsheet className="w-4 h-4" />;
  }
  if (mime.includes("word") || mime.includes("document")) {
    return <FileText className="w-4 h-4" />;
  }
  return <File className="w-4 h-4" />;
};

export function EmailResponseCard({
  subject,
  bodyPreview,
  attachments,
  onDraftReply,
  onSummarize,
  onExtractData,
  onInsertTemplate,
}: EmailResponseCardProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [draftBody, setDraftBody] = useState("");
  const [editableSubject, setEditableSubject] = useState(subject);
  const [subjectEditable, setSubjectEditable] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState<string[]>([]);

  const handleDraftReply = () => {
    onDraftReply();
    setShowEditor(true);
    // Simulate AI-generated draft
    setDraftBody(
      "Hi there,\n\nThank you for your email. I've reviewed the documents you sent and everything looks good. I'll process these right away.\n\nBest regards,\nKenneth AI Assistant"
    );
  };

  const toggleAttachment = (id: string) => {
    setSelectedAttachments((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {/* Current email preview */}
      <div>
        <Label className="text-sm text-gray-600">Current Email</Label>
        <Card className="p-3 mt-2 bg-gray-50">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">Subject:</span>
              <span>{subject}</span>
            </div>
            <Separator />
            <div className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-4">
              {bodyPreview}
            </div>
          </div>
        </Card>
      </div>

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div>
          <Label className="text-sm text-gray-600">Attachments ({attachments.length})</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {attachments.map((att) => (
              <Badge key={att.id} variant="outline" className="gap-1 pr-2">
                {getFileIcon(att.mime)}
                <span className="text-xs">{att.name}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Quick actions */}
      {!showEditor && (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="default" size="sm" onClick={handleDraftReply} className="gap-2">
            <Sparkles className="w-4 h-4" />
            Draft Reply
          </Button>
          <Button variant="outline" size="sm" onClick={onSummarize} className="gap-2">
            <FileType className="w-4 h-4" />
            Summarize
          </Button>
          <Button variant="outline" size="sm" onClick={onExtractData} className="gap-2">
            <Database className="w-4 h-4" />
            Extract Data
          </Button>
          <Button variant="outline" size="sm" onClick={onInsertTemplate} className="gap-2">
            <FileText className="w-4 h-4" />
            Templates
          </Button>
        </div>
      )}

      {/* Draft editor */}
      {showEditor && (
        <div className="space-y-4 p-4 border rounded-lg bg-white">
          <div className="flex items-center justify-between">
            <Label>Draft Reply</Label>
            <Button variant="ghost" size="sm" onClick={() => setShowEditor(false)}>
              Cancel
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="subject">Subject</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="edit-subject" className="text-xs text-gray-500">
                  Edit
                </Label>
                <Switch
                  id="edit-subject"
                  checked={subjectEditable}
                  onCheckedChange={setSubjectEditable}
                  className="scale-75"
                />
              </div>
            </div>
            <Input
              id="subject"
              value={editableSubject}
              onChange={(e) => setEditableSubject(e.target.value)}
              disabled={!subjectEditable}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="draft-body">Message</Label>
            <Textarea
              id="draft-body"
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              rows={8}
              placeholder="Compose your reply..."
            />
          </div>

          {attachments.length > 0 && (
            <div className="space-y-2">
              <Label>Include Attachments</Label>
              <div className="flex flex-wrap gap-2">
                {attachments.map((att) => (
                  <Badge
                    key={att.id}
                    variant={selectedAttachments.includes(att.id) ? "default" : "outline"}
                    className="gap-1 cursor-pointer"
                    onClick={() => toggleAttachment(att.id)}
                  >
                    {getFileIcon(att.mime)}
                    <span className="text-xs">{att.name}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button className="flex-1">Send Reply</Button>
            <Button variant="outline">Save Draft</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function EmailResponseSummary({
  subject,
  attachmentCount,
}: {
  subject: string;
  attachmentCount: number;
}) {
  return (
    <div className="flex items-center justify-between w-full min-w-0 gap-2 overflow-hidden">
      <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
        <Sparkles className="w-4 h-4 flex-shrink-0" />
        <span className="truncate font-medium text-sm">{subject}</span>
      </div>
      {attachmentCount > 0 && (
        <Badge variant="outline" className="gap-1 flex-shrink-0">
          <Paperclip className="w-3 h-3" />
          {attachmentCount}
        </Badge>
      )}
    </div>
  );
}
