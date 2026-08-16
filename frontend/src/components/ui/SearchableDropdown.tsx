'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropdownOption {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  name,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full text-sm" ref={containerRef}>
      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={value} />}
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3.5 rounded-xl bg-white border border-border shadow-sm flex items-center justify-between transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
        }`}
      >
        <span className={`truncate ${!selectedOption ? 'text-text-muted' : 'text-text-primary'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white border border-border rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-2 border-b border-border flex items-center gap-2">
              <Search className="w-4 h-4 text-text-muted shrink-0 ml-1" />
              <input
                type="text"
                className="w-full text-sm outline-none placeholder:text-text-muted text-text-primary py-1"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between transition-colors ${
                      opt.value === value ? 'bg-slate-50 text-primary font-medium' : 'text-text-primary'
                    }`}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <span className="truncate">{opt.label}</span>
                    {opt.value === value && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-text-muted text-center text-sm">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
