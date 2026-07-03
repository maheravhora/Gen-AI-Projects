import { motion } from 'framer-motion'
import { HiLanguage, HiArrowsRightLeft } from 'react-icons/hi2'
import { staggerContainer, staggerItem } from '../animations/variants'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useTranslation } from '../hooks/useTranslation'
import AnalysisPanel from '../components/translation/AnalysisPanel'
import LanguageSelector from '../components/translation/LanguageSelector'
import ToneSelector from '../components/translation/ToneSelector'
import ContextSelector from '../components/translation/ContextSelector'
import TranslationInput from '../components/translation/TranslationInput'
import TranslationOutput from '../components/translation/TranslationOutput'

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
          {/* Language selectors and Swap */}
          <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <LanguageSelector
                value={sourceLang}
                onChange={setSourceLang}
                showAutoDetect={true}
                label="Source Language"
              />
            </div>

            <div className="sm:col-span-2 flex justify-center pb-1">
              <Button variant="ghost" size="md" onClick={swapLanguages} leftIcon={<HiArrowsRightLeft className="h-4 w-4" />} className="w-full sm:w-auto min-h-[48px]">
                Swap
              </Button>
            </div>

            <div className="sm:col-span-5">
              <LanguageSelector
                value={targetLang}
                onChange={setTargetLang}
                showAutoDetect={false}
                label="Target Language"
              />
            </div>
          </motion.div>

          {/* Style selectors */}
          <motion.div variants={staggerItem} className="grid gap-4 sm:grid-cols-2">
            <ToneSelector value={tone} onChange={setTone} />
            <ContextSelector value={context} onChange={setContext} />
          </motion.div>

          {/* Input & Output boxes */}
          <motion.div variants={staggerItem} className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-text-secondary mb-2">Source Text</label>
              <TranslationInput
                value={sourceText}
                onChange={setSourceText}
                onClear={clear}
                placeholder="Enter text to translate…"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Translation Result</label>
              <TranslationOutput
                text={translatedText}
                targetLanguage={targetLang}
                isLoading={isLoading}
              />
            </div>
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
              className="w-full sm:w-auto"
            >
              Translate Now
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
