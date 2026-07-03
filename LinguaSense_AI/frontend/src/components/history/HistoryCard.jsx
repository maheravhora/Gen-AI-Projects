import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineGlobeAlt,
  HiOutlineHeart,
  HiOutlineTrash,
  HiOutlineClipboardDocument,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import { HiHeart } from 'react-icons/hi2';
import { getLanguageName, getLanguageFlag } from '../../utils/languages';

export default function HistoryCard({ item, onDelete, onToggleFavorite, delay = 0 }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(item.translated_text || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ delay, duration: 0.3 }}
      layout
      className="rounded-2xl border border-white/8 bg-[#1E293B]/60 backdrop-blur-sm p-5 shadow-md shadow-black/20 hover:border-white/12 transition-colors overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <span>{getLanguageFlag(item.source_language || 'en')}</span>
          <span>{getLanguageName(item.source_language || 'en')}</span>
          <span>→</span>
          <span>{getLanguageFlag(item.target_language || 'es')}</span>
          <span>{getLanguageName(item.target_language || 'es')}</span>
        </div>
        <span className="text-[10px] text-[#94A3B8] flex-shrink-0">
          {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Today'}
        </span>
      </div>

      {/* Source */}
      <div className="rounded-lg bg-white/5 p-3 mb-2">
        <p className="text-[10px] uppercase tracking-wider text-[#94A3B8] mb-1">Source</p>
        <p className="text-sm text-[#F8FAFC] line-clamp-2">{item.source_text || item.original || ''}</p>
      </div>

      {/* Translation */}
      <div className="rounded-lg bg-[#2563EB]/5 border border-[#2563EB]/10 p-3 mb-3">
        <p className="text-[10px] uppercase tracking-wider text-[#3B82F6] mb-1">Translation</p>
        <p className="text-sm text-[#F8FAFC] line-clamp-2">{item.translated_text || item.translation || ''}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="flex min-h-[36px] items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-[#94A3B8] hover:bg-white/10 hover:text-[#F8FAFC] transition-colors cursor-pointer border-none"
        >
          {copied ? (
            <HiOutlineCheckCircle className="h-4 w-4 text-[#10B981]" />
          ) : (
            <HiOutlineClipboardDocument className="h-4 w-4" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          onClick={() => onToggleFavorite?.(item.id)}
          className={`flex min-h-[36px] items-center gap-1 rounded-lg px-3 py-1.5 text-xs transition-colors cursor-pointer border-none ${
            item.is_favorite
              ? 'bg-[#EF4444]/10 text-[#EF4444]'
              : 'bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-[#F8FAFC]'
          }`}
        >
          {item.is_favorite ? (
            <HiHeart className="h-4 w-4" />
          ) : (
            <HiOutlineHeart className="h-4 w-4" />
          )}
          {item.is_favorite ? 'Favorited' : 'Favorite'}
        </button>
        <div className="flex-1" />
        <button
          onClick={() => onDelete?.(item.id)}
          className="flex min-h-[36px] items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-[#94A3B8] hover:bg-[#EF4444]/10 hover:text-[#EF4444] transition-colors cursor-pointer border-none"
        >
          <HiOutlineTrash className="h-4 w-4" />
          Delete
        </button>
      </div>
    </motion.div>
  );
}
