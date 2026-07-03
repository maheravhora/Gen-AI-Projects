import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { HiArrowUpTray } from 'react-icons/hi2'
import { staggerContainer, staggerItem } from '../animations/variants'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import DragDropUpload from '../components/ocr/DragDropUpload'
import { extractOcr } from '../services/api'

export default function OcrPage() {
  const [file, setFile] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileSelect = useCallback((selected) => {
    setFile(selected)
    if (!selected) {
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

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold text-text-primary">OCR Scanner</h2>
        <p className="mt-1 text-text-secondary">Extract text from images using AI-powered optical character recognition.</p>
      </motion.div>

      <motion.div variants={staggerItem} className="grid gap-6 lg:grid-cols-2">
        {/* Upload area */}
        <Card padding="lg" className="flex flex-col justify-between">
          <div>
            <DragDropUpload onFileSelect={handleFileSelect} accept="image/*" label="Upload Image for OCR" />
          </div>

          {file && (
            <div className="mt-6">
              <Button variant="primary" onClick={handleExtract} isLoading={isLoading} leftIcon={<HiArrowUpTray className="h-5 w-5" />} className="w-full">
                Extract Text
              </Button>
            </div>
          )}
          {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        </Card>

        {/* Result */}
        <Card padding="lg" header="Extracted Text">
          {extractedText ? (
            <div className="p-4 rounded-xl bg-white/5 border border-white/8 min-h-[200px]">
              <p className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap break-words">{extractedText}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-text-secondary/50">
              <p className="text-sm">Extracted text will appear here…</p>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}
