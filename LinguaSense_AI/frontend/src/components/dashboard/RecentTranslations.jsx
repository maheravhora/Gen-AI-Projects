import { motion } from 'framer-motion';
import { HiOutlineGlobeAlt, HiOutlineClock } from 'react-icons/hi2';
import { getLanguageName, getLanguageFlag } from '../../utils/languages';

export default function RecentTranslations({ translations = [] }) {
  if (translations.length === 0) {
    return (
      <div className="rounded-2xl border border-white/8 bg-[#1E293B]/60 backdrop-blur-sm p-8 text-center">
        <HiOutlineClock className="h-12 w-12 text-[#94A3B8]/30 mx-auto mb-3" />
        <h3 className="text-sm font-medium text-[#F8FAFC] mb-1">No Recent Translations</h3>
        <p className="text-xs text-[#94A3B8]">Start translating to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-[#1E293B]/60 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
        <h3 className="text-sm font-semibold text-[#F8FAFC]">Recent Translations</h3>
        <span className="text-xs text-[#94A3B8]">{translations.length} results</span>
      </div>
      <div className="divide-y divide-white/5">
        {translations.map((t, index) => (
          <motion.div
            key={t.id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex items-start gap-4 px-6 py-4 hover:bg-white/3 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#3B82F6] flex-shrink-0">
              <HiOutlineGlobeAlt className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#F8FAFC] truncate">{t.source_text || t.original || 'Untitled translation'}</p>
              <p className="text-xs text-[#94A3B8] truncate mt-0.5">{t.translated_text || t.translation || ''}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] text-[#94A3B8]">
                  {getLanguageFlag(t.source_language || 'en')} {getLanguageName(t.source_language || 'en')}
                </span>
                <span className="text-[10px] text-[#94A3B8]">→</span>
                <span className="text-[10px] text-[#94A3B8]">
                  {getLanguageFlag(t.target_language || 'es')} {getLanguageName(t.target_language || 'es')}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-[#94A3B8] flex-shrink-0 whitespace-nowrap">
              {t.created_at ? new Date(t.created_at).toLocaleDateString() : 'Today'}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
