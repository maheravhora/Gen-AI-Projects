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
      <div className="min-h-[200px] rounded-xl border border-white/8 bg-[#1E293B]/40 backdrop-blur-sm px-5 pt-4 pb-14">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="skeleton h-4 rounded-lg"
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
          className="absolute bottom-3 right-3 flex items-center gap-1.5"
        >
          <button
            onClick={handleCopy}
            className="flex min-h-[44px] items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-[#F8FAFC] hover:bg-white/20 transition-colors cursor-pointer border-none"
          >
            {copied ? (
              <>
                <HiOutlineCheckCircle className="h-4 w-4 text-[#10B981]" />
                <span className="text-[#10B981]">Copied</span>
              </>
            ) : (
              <>
                <HiOutlineClipboardDocument className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={handleSpeak}
            className="flex min-h-[44px] items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-[#F8FAFC] hover:bg-white/20 transition-colors cursor-pointer border-none"
          >
            <HiOutlineSpeakerWave className="h-4 w-4" />
            Speak
          </button>
          <button
            onClick={handleDownload}
            className="flex min-h-[44px] items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-[#F8FAFC] hover:bg-white/20 transition-colors cursor-pointer border-none"
          >
            <HiOutlineArrowDownTray className="h-4 w-4" />
            TXT
          </button>
        </motion.div>
      )}
    </div>
  );
}
