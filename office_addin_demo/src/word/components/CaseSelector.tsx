import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Briefcase, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

type CaseSelectorProps = {
  caseName?: string;
};

export function CaseSelector({ caseName = 'Lehman Brothers Limited - CVLLB205' }: CaseSelectorProps) {
  const [selectedCase, setSelectedCase] = useState<string>(caseName);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cases = [
    'Lehman Brothers Limited - CVLLB205',
    'Northern Rock plc - ADM2034/2007',
    'Carillion plc - CVL4521/2018',
    'Thomas Cook Group - CVL3892/2019',
    'British Steel Limited - CVL5623/2019',
    'Monarch Airlines - ADM2847/2017',
    'Toys R Us UK - CVL1934/2018',
    'Debenhams plc - ADM4156/2019',
  ];

  // Filter cases based on search
  const filteredCases = cases.filter(caseItem =>
    caseItem.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Briefcase className="w-4 h-4 text-gray-600" />
          <span className="truncate">{selectedCase}</span>
        </div>
        <ChevronDown className={`w-4 h-4 ml-2 flex-shrink-0 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
          <div className="p-2 max-h-64 overflow-y-auto">
            <div className="space-y-1">
              {filteredCases.length > 0 ? (
                filteredCases.map((caseItem) => (
                  <button
                    key={caseItem}
                    onClick={() => {
                      setSelectedCase(caseItem);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors ${
                      selectedCase === caseItem ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    {caseItem}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No cases found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
