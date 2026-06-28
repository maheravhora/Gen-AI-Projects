import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineChevronDown, HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2';
import languages from '../../utils/languages';

export default function LanguageSelector({ value, onChange, showAutoDetect = false, label = 'Language' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const filteredLanguages = useMemo(() => {
    const list = showAutoDetect ? languages : languages.filter((l) => l.code !== 'auto');
    if (!search) return list;
    return list.filter(
      (l) =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, showAutoDetect]);

  const selectedLang = languages.find((l) => l.code === value) || languages[1];

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      {label && (
        <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 rounded-xl border border-white/8 bg-[#1E293B] px-4 py-2.5 text-sm text-[#F8FAFC] transition-all hover:border-white/15 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 cursor-pointer"
      >
        <span className="text-base">{selectedLang.flag}</span>
        <span className="flex-1 text-left truncate">{selectedLang.name}</span>
        <HiOutlineChevronDown className={`h-4 w-4 text-[#94A3B8] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full min-w-[240px] rounded-xl border border-white/10 bg-[#1E293B] shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Search */}
            <div className="flex items-center gap-2 border-b border-white/8 px-3 py-2">
              <HiOutlineMagnifyingGlass className="h-4 w-4 text-[#94A3B8] flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search languages..."
                className="flex-1 bg-transparent text-sm text-[#F8FAFC] placeholder-[#94A3B8] outline-none border-none"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-[#94A3B8] hover:text-[#F8FAFC] bg-transparent border-none cursor-pointer"
                >
                  <HiOutlineXMark className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto scrollbar-thin py-1">
              {filteredLanguages.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-[#94A3B8]">
                  No languages found
                </div>
              ) : (
                filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      onChange(lang.code);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors cursor-pointer border-none ${
                      value === lang.code
                        ? 'bg-[#2563EB]/15 text-[#3B82F6]'
                        : 'text-[#F8FAFC] hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span className="flex-1 text-left">{lang.name}</span>
                    {value === lang.code && (
                      <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
