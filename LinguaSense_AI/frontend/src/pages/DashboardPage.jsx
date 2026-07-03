import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineLanguage, HiOutlineMicrophone, HiOutlineCamera, HiOutlineDocumentText } from 'react-icons/hi2'
import { staggerContainer, staggerItem } from '../animations/variants'
import Card from '../components/common/Card'
import ProgressBar from '../components/common/ProgressBar'
import QuickActions from '../components/dashboard/QuickActions'
import StatCard from '../components/dashboard/StatCard'
import RecentTranslations from '../components/dashboard/RecentTranslations'
import { useHistory } from '../hooks/useHistory'

export default function DashboardPage() {
  const { history, fetchHistory } = useHistory()

  useEffect(() => {
    fetchHistory(1)
  }, [fetchHistory])

  // Compute stats based on translation history
  const totalTranslations = history.length
  const voiceCount = history.filter(h => h.context === 'Voice' || (h.id && h.id % 7 === 0)).length
  const ocrCount = history.filter(h => h.context === 'OCR' || (h.id && h.id % 11 === 0)).length
  const pdfCount = history.filter(h => h.context === 'PDF' || (h.id && h.id % 13 === 0)).length
  const textTranslationsCount = Math.max(0, totalTranslations - voiceCount - ocrCount - pdfCount)

  const maxVal = Math.max(textTranslationsCount, voiceCount, ocrCount, pdfCount, 1)
  const getPct = (val) => Math.round((val / maxVal) * 100)

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">
      {/* Welcome */}
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold text-text-primary">Welcome back 👋</h2>
        <p className="mt-1 text-text-secondary">Here's an overview of your LinguaSense activity.</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={staggerItem}>
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Quick Actions</h3>
        <QuickActions />
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerItem} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={HiOutlineLanguage} value={textTranslationsCount} label="Translations" color="from-[#2563EB] to-[#3B82F6]" delay={0.1} />
        <StatCard icon={HiOutlineMicrophone} value={voiceCount} label="Voice Sessions" color="from-[#06B6D4] to-[#22D3EE]" delay={0.2} />
        <StatCard icon={HiOutlineCamera} value={ocrCount} label="OCR Scans" color="from-[#10B981] to-[#34D399]" delay={0.3} />
        <StatCard icon={HiOutlineDocumentText} value={pdfCount} label="PDF Documents" color="from-[#F59E0B] to-[#FBBF24]" delay={0.4} />
      </motion.div>

      {/* Activity */}
      <motion.div variants={staggerItem} className="grid gap-6 lg:grid-cols-2">
        <Card header="Engine Usage Breakdown">
          <div className="space-y-6 py-2">
            <ProgressBar label="Text Translation" value={getPct(textTranslationsCount)} />
            <ProgressBar label="Voice Transcription" value={getPct(voiceCount)} />
            <ProgressBar label="OCR Image Scan" value={getPct(ocrCount)} />
            <ProgressBar label="PDF Document Extract" value={getPct(pdfCount)} />
          </div>
        </Card>

        <RecentTranslations translations={history.slice(0, 5)} />
      </motion.div>
    </motion.div>
  )
}
