import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, FileText, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type DocumentSelectorProps = {
  documentName?: string;
};

export function DocumentSelector({ documentName = 'sip6_report.docx' }: DocumentSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCaseFile, setSelectedCaseFile] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [caseFileSearch, setCaseFileSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const templates = [
    'Employment Contract Template',
    'NDA Template',
    'Service Agreement Template',
    'Lease Agreement Template',
  ];

  const caseFiles = [
    'Case #2024-001 - Smith v. Johnson',
    'Case #2024-002 - Tech Corp Merger',
    'Case #2024-003 - Property Dispute',
    'Case #2024-004 - IP Infringement',
  ];

  // Filter templates based on search
  const filteredTemplates = templates.filter(template =>
    template.toLowerCase().includes(templateSearch.toLowerCase())
  );

  // Filter case files based on search
  const filteredCaseFiles = caseFiles.filter(caseFile =>
    caseFile.toLowerCase().includes(caseFileSearch.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        className="w-full justify-between bg-white hover:bg-gray-50 border-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-600" />
          <span className="truncate">{documentName}</span>
        </div>
        <ChevronDown className={`w-4 h-4 ml-2 flex-shrink-0 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="w-full grid grid-cols-2 rounded-none border-b bg-gray-50">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="casefiles">Case Files</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="p-0 mt-0">
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search templates..."
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </div>
              <div className="p-2 max-h-56 overflow-y-auto">
                <div className="space-y-1">
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                      <button
                        key={template}
                        onClick={() => {
                          setSelectedTemplate(template);
                          setIsOpen(false);
                          setTemplateSearch('');
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors ${
                          selectedTemplate === template ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        {template}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No templates found</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="casefiles" className="p-0 mt-0">
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search case files..."
                    value={caseFileSearch}
                    onChange={(e) => setCaseFileSearch(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </div>
              <div className="p-2 max-h-56 overflow-y-auto">
                <div className="space-y-1">
                  {filteredCaseFiles.length > 0 ? (
                    filteredCaseFiles.map((caseFile) => (
                      <button
                        key={caseFile}
                        onClick={() => {
                          setSelectedCaseFile(caseFile);
                          setIsOpen(false);
                          setCaseFileSearch('');
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors ${
                          selectedCaseFile === caseFile ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        {caseFile}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No case files found</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
