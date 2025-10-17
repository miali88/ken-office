import React from "react";
import { FilingItem } from "../types/sidebar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { FileText, FileSpreadsheet, File, AlertCircle, Check, Edit2, FolderOpen, Mail } from "lucide-react";

interface FilingItemCardProps {
  item: FilingItem;
  onApprove: (id: string) => void;
  onEdit: (id: string) => void;
  onRefile: (id: string) => void;
  onOpenSource: (messageId: string) => void;
}

const getFileIcon = (filename: string, type?: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf' || type?.toLowerCase().includes('pdf')) {
    return <FileText className="w-4 h-4" />;
  }
  if (ext === 'xlsx' || ext === 'xls' || type?.toLowerCase().includes('spreadsheet')) {
    return <FileSpreadsheet className="w-4 h-4" />;
  }
  if (ext === 'docx' || ext === 'doc') {
    return <FileText className="w-4 h-4" />;
  }
  return <File className="w-4 h-4" />;
};

const getStatusBadge = (status: FilingItem['status']) => {
  switch (status) {
    case 'filed':
      return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100"><Check className="w-3 h-3 mr-1" />Filed</Badge>;
    case 'unfiled':
      return <Badge variant="secondary">Unfiled</Badge>;
    case 'needs_review':
      return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Needs Review</Badge>;
    case 'error':
      return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
  }
};

export function FilingItemCard({ item, onApprove, onEdit, onRefile, onOpenSource }: FilingItemCardProps) {
  return (
    <Card className="p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <div className="mt-1 text-gray-500">
            {getFileIcon(item.filename, item.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate">{item.filename}</div>
            {item.type && (
              <div className="text-sm text-gray-500">{item.type}</div>
            )}
          </div>
        </div>
        {getStatusBadge(item.status)}
      </div>

      {item.detectedEntities && item.detectedEntities.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.detectedEntities.map((entity, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {entity}
            </Badge>
          ))}
        </div>
      )}

      {item.confidence !== undefined && (
        <div className="text-sm text-gray-600">
          Confidence: <span className={item.confidence > 0.8 ? "text-green-600" : item.confidence > 0.6 ? "text-yellow-600" : "text-red-600"}>{Math.round(item.confidence * 100)}%</span>
        </div>
      )}

      {item.proposedDestination && (
        <div className="text-sm text-gray-600 flex items-center gap-1">
          <FolderOpen className="w-3 h-3" />
          <span className="truncate">{item.proposedDestination}</span>
        </div>
      )}

      {item.status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-700">
          Could not process this document. Please review manually.
          <Button variant="link" size="sm" className="h-auto p-0 ml-2 text-red-700">
            Retry
          </Button>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        {item.status === 'unfiled' && (
          <Button size="sm" onClick={() => onApprove(item.id)} className="flex-1">
            <Check className="w-3 h-3 mr-1" />
            Approve
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={() => onEdit(item.id)} className="flex-1">
          <Edit2 className="w-3 h-3 mr-1" />
          Edit
        </Button>
        {item.status !== 'filed' && (
          <Button size="sm" variant="outline" onClick={() => onRefile(item.id)}>
            Refile
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => onOpenSource(item.sourceMessageId)}>
          <Mail className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
}
