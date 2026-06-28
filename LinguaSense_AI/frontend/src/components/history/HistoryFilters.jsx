import { motion } from 'framer-motion';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineXMark } from 'react-icons/hi2';
import languages from '../../utils/languages';

export default function HistoryFilters({ search, onSearchChange, languageFilter, onLanguageFilterChange, dateFilter, onDateFilterChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row gap-3"
    >
      {/* Search */}
      <div className="relative flex-1">
        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search translations..."
          className="w-full rounded-xl border border-white/8 bg-[#1E293B] pl-10 pr-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8] outline-none focus:border-[#2563EB]/40 focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] bg-transparent border-none cursor-pointer"
          >
            <HiOutlineXMark className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Language filter */}
      <select
        value={languageFilter}
        onChange={(e) => onLanguageFilterChange(e.target.value)}
        className="rounded-xl border border-white/8 bg-[#1E293B] px-4 py-2.5 text-sm text-[#F8FAFC] outline-none focus:border-[#2563EB]/40 focus:ring-2 focus:ring-[#2563EB]/20 cursor-pointer appearance-none min-w-[160px]"
      >
        <option value="">All Languages</option>
        {languages.filter((l) => l.code !== 'auto').slice(0, 30).map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>

      {/* Date filter */}
      <select
        value={dateFilter}
        onChange={(e) => onDateFilterChange(e.target.value)}
        className="rounded-xl border border-white/8 bg-[#1E293B] px-4 py-2.5 text-sm text-[#F8FAFC] outline-none focus:border-[#2563EB]/40 focus:ring-2 focus:ring-[#2563EB]/20 cursor-pointer appearance-none min-w-[140px]"
      >
        <option value="">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>
    </motion.div>
  );
}
