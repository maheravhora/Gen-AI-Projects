import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { HiDocumentText, HiArrowUpTray, HiXMark } from 'react-icons/hi2'
import { staggerContainer, staggerItem } from '../animations/variants'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { extractPdf } from '../services/api'

export default function PdfPage() {
  const [file, setFile] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = useCallback((e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
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
      const response = await extractPdf(formData)
      setExtractedText(response.data.text || response.data.extracted_text || '')
    } catch (err) {
      setError(err.message || 'PDF extraction failed')
    } finally {
      setIsLoading(false)
    }
  }, [file])

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold text-text-primary">PDF Extractor</h2>
        <p className="mt-1 text-text-secondary">Extract and process text from PDF documents.</p>
      </motion.div>

      <motion.div variants={staggerItem} className="grid gap-6 lg:grid-cols-2">
        <Card padding="lg">
          <label className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-white/15 py-16 cursor-pointer hover:border-primary/40 hover:bg-white/[0.02] transition-all">
            <HiDocumentText className="h-10 w-10 text-text-secondary" />
            <div className="text-center">
              <p className="text-sm font-semibold text-text-primary">
                {file ? file.name : 'Upload a PDF'}
              </p>
              <p className="text-xs text-text-secondary mt-1">PDF up to 20MB</p>
            </div>
            <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
          </label>

          {file && (
            <div className="mt-4 flex gap-3">
              <Button variant="primary" onClick={handleExtract} isLoading={isLoading} leftIcon={<HiArrowUpTray className="h-4 w-4" />} className="flex-1">
                Extract Text
              </Button>
              <Button variant="ghost" onClick={() => { setFile(null); setExtractedText(''); setError(null) }} leftIcon={<HiXMark className="h-4 w-4" />}>
                Clear
              </Button>
            </div>
          )}
          {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        </Card>

        <Card padding="lg" header="Extracted Text">
          {extractedText ? (
            <div className="max-h-[500px] overflow-y-auto">
              <p className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap">{extractedText}</p>
            </div>
          ) : (
            <p className="text-sm text-text-secondary/50 py-8 text-center">Extracted text will appear here…</p>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}
