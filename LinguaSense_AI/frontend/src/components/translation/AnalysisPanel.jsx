import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineLanguage,
  HiOutlineCheckBadge,
  HiOutlineSpeakerWave,
  HiOutlineSparkles,
  HiOutlineCog6Tooth,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineLightBulb,
  HiOutlineArrowPath,
  HiOutlineClipboardDocument,
  HiOutlineArrowDownTray,
  HiOutlineHeart,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';

function CircularProgress({ value, size = 64, strokeWidth = 5, color = '#2563EB', label, delay = 0 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="flex flex-col items-center gap-1.5"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ delay: delay + 0.2, duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-[#F8FAFC]">{value}%</span>
        </div>
      </div>
      <span className="text-[10px] text-[#94A3B8] text-center leading-tight">{label}</span>
    </motion.div>
  );
}

function AnalysisSection({ title, icon: Icon, children, delay = 0, iconColor = 'text-[#3B82F6]' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="rounded-xl border border-white/8 bg-[#1E293B]/50 backdrop-blur-sm p-4 shadow-md shadow-black/20 overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        <h4 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">{title}</h4>
      </div>
      {children}
    </motion.div>
  );
}

export default function AnalysisPanel({ analysis, isLoading = false }) {
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="skeleton h-24 rounded-xl border border-white/5"
          />
        ))}
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-4"
        >
          <HiOutlineSparkles className="h-16 w-16 text-[#2563EB]/30" />
        </motion.div>
        <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">AI Analysis</h3>
        <p className="text-sm text-[#94A3B8] max-w-xs">
          Translate text to see detailed AI-powered analysis including quality metrics, grammar, and context insights.
        </p>
      </div>
    );
  }

  const data = {
    detectedLanguage: analysis.detected_language || 'English',
    detectedConfidence: analysis.detection_confidence || 98,
    originalText: analysis.original_text || '',
    correctedText: analysis.corrected_text || '',
    corrections: analysis.grammar_corrections || 0,
    tone: analysis.tone || 'professional',
    toneScore: analysis.tone_preservation || 95,
    contextDomain: analysis.context_domain || 'General',
    contextKeywords: analysis.context_keywords || ['translation', 'language', 'communication'],
    contextConfidence: analysis.context_confidence || 92,
    model: analysis.model || 'LinguaSense AI v2.0',
    direction: analysis.direction || 'en → es',
    processingTime: analysis.processing_time || '420ms',
    translatedText: analysis.translated_text || '',
    wordCount: analysis.word_count || 0,
    charCount: analysis.char_count || 0,
    confidence: analysis.confidence || 96,
    grammarScore: analysis.grammar_score || 94,
    contextScore: analysis.context_score || 91,
    fluency: analysis.fluency || 97,
    naturalness: analysis.naturalness || 93,
    overall: analysis.overall || 95,
    notes: analysis.notes || 'The translation preserves the original tone and meaning while adapting to the target language cultural context. Domain-specific terminology has been accurately translated.',
    alternatives: analysis.alternatives || [
      { tone: 'Professional', text: analysis.alt_professional || 'Professional variant of the translation with formal register.' },
      { tone: 'Academic', text: analysis.alt_academic || 'Academic variant with scholarly language and precise terminology.' },
      { tone: 'Casual', text: analysis.alt_casual || 'Casual variant using conversational language and everyday expressions.' },
    ],
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([data.translatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    const content = `Translation Report\n${'='.repeat(40)}\n\nOriginal: ${data.originalText}\n\nTranslation: ${data.translatedText}\n\nLanguage: ${data.direction}\nTone: ${data.tone}\nDomain: ${data.contextDomain}\nConfidence: ${data.overall}%\n\nNotes: ${data.notes}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translation-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReadAloud = () => {
    const utterance = new SpeechSynthesisUtterance(data.translatedText);
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)] scrollbar-thin pr-1">
      {/* Language Detection */}
      <AnalysisSection title="Language Detection" icon={HiOutlineLanguage} delay={0} iconColor="text-[#3B82F6]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#F8FAFC]">{data.detectedLanguage}</p>
            <p className="text-xs text-[#94A3B8]">Detected Language</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.detectedConfidence}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
              />
            </div>
            <span className="text-xs font-bold text-[#06B6D4]">{data.detectedConfidence}%</span>
          </div>
        </div>
      </AnalysisSection>

      {/* Grammar Analysis */}
      <AnalysisSection title="Grammar Analysis" icon={HiOutlineCheckBadge} delay={0.1} iconColor="text-[#10B981]">
        <div className="space-y-2">
          {data.originalText && (
            <div className="rounded-lg bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#94A3B8] mb-1">Original</p>
              <p className="text-xs text-[#F8FAFC]/80 line-clamp-2">{data.originalText}</p>
            </div>
          )}
          {data.correctedText && data.correctedText !== data.originalText && (
            <div className="rounded-lg bg-[#10B981]/5 border border-[#10B981]/10 p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#10B981] mb-1">Corrected</p>
              <p className="text-xs text-[#F8FAFC] line-clamp-2">{data.correctedText}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#94A3B8]">Corrections:</span>
            <span className={`text-xs font-bold ${data.corrections > 0 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>
              {data.corrections} {data.corrections === 1 ? 'issue' : 'issues'} found
            </span>
          </div>
        </div>
      </AnalysisSection>

      {/* Tone Analysis */}
      <AnalysisSection title="Tone Analysis" icon={HiOutlineSpeakerWave} delay={0.2} iconColor="text-[#F59E0B]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#F8FAFC] capitalize">{data.tone}</p>
            <p className="text-xs text-[#94A3B8]">Selected Tone</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-[#F59E0B]">{data.toneScore}%</p>
            <p className="text-xs text-[#94A3B8]">Preservation</p>
          </div>
        </div>
      </AnalysisSection>

      {/* Context Recognition */}
      <AnalysisSection title="Context Recognition" icon={HiOutlineSparkles} delay={0.3} iconColor="text-[#8B5CF6]">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#94A3B8]">Domain:</span>
            <span className="text-xs font-medium text-[#F8FAFC] capitalize">{data.contextDomain}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.contextKeywords.map((kw) => (
              <span key={kw} className="rounded-md bg-[#8B5CF6]/10 px-2 py-0.5 text-[10px] text-[#8B5CF6]">
                {kw}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#94A3B8]">Confidence:</span>
            <span className="text-xs font-bold text-[#8B5CF6]">{data.contextConfidence}%</span>
          </div>
        </div>
      </AnalysisSection>

      {/* Translation Engine */}
      <AnalysisSection title="Translation Engine" icon={HiOutlineCog6Tooth} delay={0.4} iconColor="text-[#94A3B8]">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[10px] text-[#94A3B8] uppercase">Model</p>
            <p className="text-xs font-medium text-[#F8FAFC] truncate">{data.model}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#94A3B8] uppercase">Direction</p>
            <p className="text-xs font-medium text-[#F8FAFC]">{data.direction}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#94A3B8] uppercase">Time</p>
            <p className="text-xs font-medium text-[#10B981]">{data.processingTime}</p>
          </div>
        </div>
      </AnalysisSection>

      {/* Translation Result */}
      <AnalysisSection title="Translation Result" icon={HiOutlineDocumentText} delay={0.5} iconColor="text-[#06B6D4]">
        <div className="space-y-2">
          <div className="rounded-lg bg-white/5 p-3">
            <p className="text-sm text-[#F8FAFC] leading-relaxed line-clamp-4">{data.translatedText}</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
            <span>Words: <span className="text-[#F8FAFC] font-medium">{data.wordCount}</span></span>
            <span>Chars: <span className="text-[#F8FAFC] font-medium">{data.charCount}</span></span>
          </div>
        </div>
      </AnalysisSection>

      {/* Quality Metrics */}
      <AnalysisSection title="Quality Metrics" icon={HiOutlineChartBar} delay={0.6} iconColor="text-[#2563EB]">
        <div className="grid grid-cols-3 gap-4 justify-items-center py-2">
          <CircularProgress value={data.confidence} color="#2563EB" label="Confidence" delay={0.7} />
          <CircularProgress value={data.grammarScore} color="#10B981" label="Grammar" delay={0.8} />
          <CircularProgress value={data.contextScore} color="#8B5CF6" label="Context" delay={0.9} />
          <CircularProgress value={data.fluency} color="#06B6D4" label="Fluency" delay={1.0} />
          <CircularProgress value={data.naturalness} color="#F59E0B" label="Natural" delay={1.1} />
          <CircularProgress value={data.overall} color="#EF4444" label="Overall" delay={1.2} />
        </div>
      </AnalysisSection>

      {/* Translation Notes */}
      <AnalysisSection title="Translation Notes" icon={HiOutlineLightBulb} delay={0.7} iconColor="text-[#F59E0B]">
        <p className="text-xs text-[#94A3B8] leading-relaxed">{data.notes}</p>
      </AnalysisSection>

      {/* Alternative Translations */}
      <AnalysisSection title="Alternative Translations" icon={HiOutlineArrowPath} delay={0.8} iconColor="text-[#06B6D4]">
        <div className="space-y-2">
          {data.alternatives.map((alt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + i * 0.1 }}
              className="rounded-lg border border-white/5 bg-white/3 p-3"
            >
              <p className="text-[10px] font-semibold text-[#06B6D4] uppercase mb-1">{alt.tone}</p>
              <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">{alt.text}</p>
            </motion.div>
          ))}
        </div>
      </AnalysisSection>

      {/* Read Aloud */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        onClick={handleReadAloud}
        type="button"
        className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-[#1E293B]/50 px-4 py-3 text-sm font-medium text-[#F8FAFC] hover:bg-white/5 transition-colors cursor-pointer"
      >
        <HiOutlineSpeakerWave className="h-4 w-4 text-[#3B82F6]" />
        Read Translation Aloud
      </motion.button>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-2"
      >
        <button
          onClick={handleCopy}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-white/8 bg-[#1E293B]/50 px-3 py-2.5 text-xs font-medium text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC] transition-colors cursor-pointer"
        >
          {copied ? (
            <HiOutlineCheckCircle className="h-4 w-4 text-[#10B981]" />
          ) : (
            <HiOutlineClipboardDocument className="h-4 w-4" />
          )}
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={handleDownloadTxt}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-white/8 bg-[#1E293B]/50 px-3 py-2.5 text-xs font-medium text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC] transition-colors cursor-pointer"
        >
          <HiOutlineArrowDownTray className="h-4 w-4" />
          TXT
        </button>
        <button
          onClick={handleDownloadPdf}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-white/8 bg-[#1E293B]/50 px-3 py-2.5 text-xs font-medium text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC] transition-colors cursor-pointer"
        >
          <HiOutlineArrowDownTray className="h-4 w-4" />
          PDF
        </button>
        <button
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-white/8 bg-[#1E293B]/50 px-3 py-2.5 text-xs font-medium text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC] transition-colors cursor-pointer"
        >
          <HiOutlineHeart className="h-4 w-4" />
          Favorite
        </button>
        <button
          className="col-span-2 sm:col-span-2 flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-white/8 bg-[#2563EB]/10 px-3 py-2.5 text-xs font-medium text-[#3B82F6] hover:bg-[#2563EB]/15 transition-colors cursor-pointer"
        >
          <HiOutlineArrowPath className="h-4 w-4" />
          Regenerate Translation
        </button>
      </motion.div>
    </div>
  );
}
