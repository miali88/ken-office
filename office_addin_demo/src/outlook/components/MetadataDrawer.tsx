import React from "react";
import { useState } from "react";
import { FilingItem } from "../types/sidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "./ui/sheet";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";

interface MetadataDrawerProps {
  item: FilingItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, metadata: Partial<FilingItem>) => void;
}

export function MetadataDrawer({ item, open, onClose, onSave }: MetadataDrawerProps) {
  const [filename, setFilename] = useState(item?.filename || "");
  const [type, setType] = useState(item?.type || "");
  const [destination, setDestination] = useState(item?.proposedDestination || "");
  const [tags, setTags] = useState<string[]>(item?.detectedEntities || []);
  const [newTag, setNewTag] = useState("");

  const handleSave = () => {
    if (item) {
      onSave(item.id, {
        filename,
        type,
        proposedDestination: destination,
        detectedEntities: tags,
      });
      onClose();
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  if (!item) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Metadata</SheetTitle>
          <SheetDescription>
            Update the filing information for this document
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="filename">File Name</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Document Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Contract Amendment">Contract Amendment</SelectItem>
                <SelectItem value="Invoice">Invoice</SelectItem>
                <SelectItem value="Financial Report">Financial Report</SelectItem>
                <SelectItem value="Meeting Notes">Meeting Notes</SelectItem>
                <SelectItem value="Correspondence">Correspondence</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Contracts/2024"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add a tag"
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-600"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div className="text-sm text-gray-600">{item.status}</div>
          </div>

          {item.confidence !== undefined && (
            <div className="space-y-2">
              <Label>Confidence</Label>
              <div className="text-sm text-gray-600">
                {Math.round(item.confidence * 100)}%
              </div>
            </div>
          )}
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
