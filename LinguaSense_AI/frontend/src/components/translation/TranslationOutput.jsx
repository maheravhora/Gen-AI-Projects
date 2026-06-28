import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineClipboardDocument,
  HiOutlineSpeakerWave,
  HiOutlineArrowDownTray,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';

export default function TranslationOutput({ text, targetLanguage, isLoading = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLanguage || 'en';
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <div className="min-h-[200px] rounded-2xl border border-white/8 bg-[#1E293B]/40 backdrop-blur-sm px-5 py-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                className="h-4 rounded-lg bg-white/10"
                style={{ width: `${80 - i * 15}%` }}
              />
            ))}
          </div>
        ) : text ? (
          <p className="text-base text-[#F8FAFC] leading-relaxed whitespace-pre-wrap">{text}</p>
        ) : (
          <p className="text-[#94A3B8]/60 text-base">Translation will appear here...</p>
        )}
      </div>

      {/* Action buttons */}
      {text && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 right-3 flex items-center gap-1"
        >
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-[#94A3B8] hover:bg-white/10 hover:text-[#F8FAFC] transition-colors cursor-pointer border-none"
          >
            {copied ? (
              <>
                <HiOutlineCheckCircle className="h-3.5 w-3.5 text-[#10B981]" />
                <span className="text-[#10B981]">Copied</span>
              </>
            ) : (
              <>
                <HiOutlineClipboardDocument className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={handleSpeak}
            className="flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-[#94A3B8] hover:bg-white/10 hover:text-[#F8FAFC] transition-colors cursor-pointer border-none"
          >
            <HiOutlineSpeakerWave className="h-3.5 w-3.5" />
            Speak
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-[#94A3B8] hover:bg-white/10 hover:text-[#F8FAFC] transition-colors cursor-pointer border-none"
          >
            <HiOutlineArrowDownTray className="h-3.5 w-3.5" />
            TXT
          </button>
        </motion.div>
      )}
    </div>
  );
}
