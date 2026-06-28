import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { HiCamera, HiArrowUpTray, HiXMark } from 'react-icons/hi2'
import { staggerContainer, staggerItem } from '../animations/variants'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { extractOcr } from '../services/api'

export default function OcrPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = useCallback((e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
      setExtractedText('')
      setError(null)
    }
  }, [])

  const handleExtract = useCallback(async () => {
    if (!file) return
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await extractOcr(formData)
      setExtractedText(response.data.text || response.data.extracted_text || '')
    } catch (err) {
      setError(err.message || 'OCR extraction failed')
    } finally {
      setIsLoading(false)
    }
  }, [file])

  const clearAll = () => {
    setFile(null)
    setPreview(null)
    setExtractedText('')
    setError(null)
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold text-text-primary">OCR Scanner</h2>
        <p className="mt-1 text-text-secondary">Extract text from images using AI-powered OCR.</p>
      </motion.div>

      <motion.div variants={staggerItem} className="grid gap-6 lg:grid-cols-2">
        {/* Upload area */}
        <Card padding="lg">
          {!preview ? (
            <label className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-white/15 py-16 cursor-pointer hover:border-primary/40 hover:bg-white/[0.02] transition-all">
              <HiCamera className="h-10 w-10 text-text-secondary" />
              <div className="text-center">
                <p className="text-sm font-semibold text-text-primary">Upload an image</p>
                <p className="text-xs text-text-secondary mt-1">PNG, JPG, WEBP up to 10MB</p>
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full rounded-xl object-contain max-h-80" />
              <button onClick={clearAll} className="absolute top-2 right-2 rounded-lg bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors">
                <HiXMark className="h-4 w-4" />
              </button>
            </div>
          )}

          {file && (
            <div className="mt-4">
              <Button variant="primary" onClick={handleExtract} isLoading={isLoading} leftIcon={<HiArrowUpTray className="h-4 w-4" />} className="w-full">
                Extract Text
              </Button>
            </div>
          )}
          {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        </Card>

        {/* Result */}
        <Card padding="lg" header="Extracted Text">
          {extractedText ? (
            <p className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap">{extractedText}</p>
          ) : (
            <p className="text-sm text-text-secondary/50 py-8 text-center">Extracted text will appear here…</p>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}
