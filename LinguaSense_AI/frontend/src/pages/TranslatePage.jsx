import { motion } from 'framer-motion'
import { HiLanguage, HiArrowsRightLeft, HiClipboard, HiSpeakerWave, HiTrash } from 'react-icons/hi2'
import { staggerContainer, staggerItem } from '../animations/variants'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useTranslation } from '../hooks/useTranslation'
import { LANGUAGES, TONES, CONTEXTS } from '../utils/constants'
import { copyToClipboard } from '../utils/helpers'
import AnalysisPanel from '../components/translation/AnalysisPanel'

export default function TranslatePage() {
  const {
    sourceText, setSourceText,
    translatedText,
    sourceLang, setSourceLang,
    targetLang, setTargetLang,
    tone, setTone,
    context, setContext,
    isLoading, error,
    result,
    translate, swapLanguages, clear,
  } = useTranslation()

  const handleReadAloud = () => {
    if (!translatedText) return
    const utterance = new SpeechSynthesisUtterance(translatedText)
    speechSynthesis.cancel()
    speechSynthesis.speak(utterance)
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold text-text-primary">Translate</h2>
        <p className="mt-1 text-text-secondary">AI-powered translation with tone and context awareness.</p>
      </motion.div>

      {/* Main layout container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left side: Translation panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Language and style selectors */}
          <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-3">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="h-10 rounded-xl border border-white/8 bg-white/5 px-3 text-sm text-text-primary outline-none focus:border-primary/50"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-card text-text-primary">{l.name}</option>
              ))}
            </select>

            <Button variant="ghost" size="sm" onClick={swapLanguages} leftIcon={<HiArrowsRightLeft className="h-4 w-4" />}>
              Swap
            </Button>

            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="h-10 rounded-xl border border-white/8 bg-white/5 px-3 text-sm text-text-primary outline-none focus:border-primary/50"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-card text-text-primary">{l.name}</option>
              ))}
            </select>

            <select value={tone} onChange={(e) => setTone(e.target.value)} className="h-10 rounded-xl border border-white/8 bg-white/5 px-3 text-sm text-text-primary outline-none focus:border-primary/50">
              {TONES.map((t) => <option key={t} value={t} className="bg-card">{t}</option>)}
            </select>

            <select value={context} onChange={(e) => setContext(e.target.value)} className="h-10 rounded-xl border border-white/8 bg-white/5 px-3 text-sm text-text-primary outline-none focus:border-primary/50">
              {CONTEXTS.map((c) => <option key={c} value={c} className="bg-card">{c}</option>)}
            </select>
          </motion.div>

          {/* Textareas */}
          <motion.div variants={staggerItem} className="grid gap-6 md:grid-cols-2">
            <Card padding="none" className="overflow-hidden">
              <div className="p-4">
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Enter text to translate…"
                  rows={8}
                  className="w-full resize-none bg-transparent text-text-primary placeholder:text-text-secondary/50 outline-none text-sm leading-relaxed"
                />
              </div>
              <div className="flex items-center justify-between border-t border-white/8 px-4 py-2.5">
                <span className="text-xs text-text-secondary">{sourceText.length} chars</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={clear} leftIcon={<HiTrash className="h-3.5 w-3.5" />}>Clear</Button>
                </div>
              </div>
            </Card>

            <Card padding="none" className="overflow-hidden relative">
              <div className="p-4 min-h-[200px]">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-sm">Translating…</span>
                  </div>
                ) : translatedText ? (
                  <p className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap">{translatedText}</p>
                ) : (
                  <p className="text-sm text-text-secondary/50">Translation will appear here…</p>
                )}
              </div>
              <div className="flex items-center justify-between border-t border-white/8 px-4 py-2.5">
                <span className="text-xs text-text-secondary">{translatedText.length} chars</span>
                <div className="flex gap-2">
                  {translatedText && (
                    <Button variant="ghost" size="sm" onClick={handleReadAloud} leftIcon={<HiSpeakerWave className="h-3.5 w-3.5" />}>Speak</Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(translatedText)} disabled={!translatedText} leftIcon={<HiClipboard className="h-3.5 w-3.5" />}>Copy</Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {error && (
            <motion.p variants={staggerItem} className="text-sm text-danger">{error}</motion.p>
          )}

          <motion.div variants={staggerItem}>
            <Button
              variant="primary"
              size="lg"
              onClick={translate}
              isLoading={isLoading}
              disabled={!sourceText.trim()}
              leftIcon={<HiLanguage className="h-5 w-5" />}
            >
              Translate
            </Button>
          </motion.div>
        </div>

        {/* Right side: AI Analysis Panel */}
        <div className="lg:col-span-1">
          <Card padding="lg" header="AI Translation Analysis" className="h-full">
            <AnalysisPanel analysis={result} isLoading={isLoading} />
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
