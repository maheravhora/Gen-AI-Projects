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
        <Card padding="lg" className="flex flex-col justify-between">
          <div>
            <label className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-white/15 py-16 cursor-pointer hover:border-primary/40 hover:bg-white/[0.02] transition-all bg-[#1E293B]/30">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <HiDocumentText className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-text-primary">
                  {file ? file.name : 'Upload a PDF Document'}
                </p>
                <p className="text-xs text-text-secondary mt-1">PDF format up to 20MB</p>
              </div>
              <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {file && (
            <div className="mt-6 flex gap-3">
              <Button variant="primary" size="md" onClick={handleExtract} isLoading={isLoading} leftIcon={<HiArrowUpTray className="h-5 w-5" />} className="flex-1">
                Extract Text
              </Button>
              <Button variant="ghost" size="md" onClick={() => { setFile(null); setExtractedText(''); setError(null) }} leftIcon={<HiXMark className="h-5 w-5" />}>
                Clear
              </Button>
            </div>
          )}
          {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        </Card>

        <Card padding="lg" header="Extracted Text">
          {extractedText ? (
            <div className="p-4 rounded-xl bg-white/5 border border-white/8 min-h-[200px] max-h-[500px] overflow-y-auto">
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
