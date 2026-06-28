import { useState, useCallback } from 'react'
import { translateText } from '../services/api'
import { useAppContext } from '../context/AppContext'

export function useTranslation() {
  const { settings, addRecentTranslation } = useAppContext()

  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLang, setSourceLang] = useState(settings.defaultSourceLang || 'en')
  const [targetLang, setTargetLang] = useState(settings.defaultTargetLang || 'es')
  const [tone, setTone] = useState(settings.defaultTone || 'Professional')
  const [context, setContext] = useState(settings.defaultContext || 'General')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const translate = useCallback(async () => {
    if (!sourceText.trim()) {
      setError('Please enter text to translate')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await translateText({
        text: sourceText,
        source_lang: sourceLang,
        target_lang: targetLang,
        tone,
        context,
      })

      const data = response.data
      setTranslatedText(data.translated_text || data.translation || '')
      setResult(data)

      addRecentTranslation({
        sourceText,
        translatedText: data.translated_text || data.translation || '',
        sourceLang,
        targetLang,
        tone,
        context,
      })

      return data
    } catch (err) {
      const message = err.message || 'Translation failed. Please try again.'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [sourceText, sourceLang, targetLang, tone, context, addRecentTranslation])

  const swapLanguages = useCallback(() => {
    setSourceLang((prev) => {
      setTargetLang(prev)
      return targetLang
    })
    // Also swap text if there's a translation
    if (translatedText) {
      setSourceText(translatedText)
      setTranslatedText(sourceText)
    }
  }, [sourceText, translatedText, targetLang])

  const clear = useCallback(() => {
    setSourceText('')
    setTranslatedText('')
    setResult(null)
    setError(null)
  }, [])

  return {
    sourceText,
    setSourceText,
    translatedText,
    setTranslatedText,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    tone,
    setTone,
    context,
    setContext,
    isLoading,
    result,
    error,
    translate,
    swapLanguages,
    clear,
  }
}

export default useTranslation
