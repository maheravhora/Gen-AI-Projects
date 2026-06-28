import { motion } from 'framer-motion';
import { HiOutlineXMark } from 'react-icons/hi2';

export default function TranslationInput({ value, onChange, onClear, maxLength = 5000, placeholder = 'Enter text to translate...' }) {
  const charCount = value.length;
  const percentage = (charCount / maxLength) * 100;

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={8}
        className="w-full resize-none rounded-2xl border border-white/8 bg-[#1E293B]/60 backdrop-blur-sm px-5 py-4 text-base text-[#F8FAFC] placeholder-[#94A3B8]/60 outline-none transition-all focus:border-[#2563EB]/40 focus:ring-2 focus:ring-[#2563EB]/20 scrollbar-thin"
      />
      <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onClear}
              type="button"
              className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-xs text-[#94A3B8] hover:bg-white/10 hover:text-[#F8FAFC] transition-colors cursor-pointer border-none"
            >
              <HiOutlineXMark className="h-3 w-3" />
              Clear
            </motion.button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1 w-16 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                percentage > 90 ? 'bg-[#EF4444]' : percentage > 70 ? 'bg-[#F59E0B]' : 'bg-[#2563EB]'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <span className={`text-xs font-mono ${percentage > 90 ? 'text-[#EF4444]' : 'text-[#94A3B8]'}`}>
            {charCount}/{maxLength}
          </span>
        </div>
      </div>
    </div>
  );
}
