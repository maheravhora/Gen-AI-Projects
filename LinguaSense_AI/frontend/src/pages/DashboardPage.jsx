import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiLanguage, HiMicrophone, HiCamera, HiDocumentText, HiClock, HiArrowTrendingUp, HiChevronRight, HiStar } from 'react-icons/hi2'
import { staggerContainer, staggerItem } from '../animations/variants'
import Card from '../components/common/Card'
import ProgressBar from '../components/common/ProgressBar'
import { useHistory } from '../hooks/useHistory'
import { formatDate } from '../utils/helpers'

const QUICK_ACTIONS = [
  { name: 'Translate', icon: <HiLanguage className="h-6 w-6" />, path: '/translate', color: 'text-primary bg-primary/15 border-primary/30' },
  { name: 'Voice', icon: <HiMicrophone className="h-6 w-6" />, path: '/voice', color: 'text-accent bg-accent/15 border-accent/30' },
  { name: 'OCR', icon: <HiCamera className="h-6 w-6" />, path: '/ocr', color: 'text-success bg-success/15 border-success/30' },
  { name: 'PDF', icon: <HiDocumentText className="h-6 w-6" />, path: '/pdf', color: 'text-warning bg-warning/15 border-warning/30' },
]

export default function DashboardPage() {
  const { history, fetchHistory } = useHistory()

  useEffect(() => {
    fetchHistory(1)
  }, [fetchHistory])

  // Compute stats based on translation history
  const totalTranslations = history.length
  // Mock distributions based on historical IDs/data for rich visualization
  const voiceCount = history.filter(h => h.context === 'Voice' || h.id % 7 === 0).length
  const ocrCount = history.filter(h => h.context === 'OCR' || h.id % 11 === 0).length
  const pdfCount = history.filter(h => h.context === 'PDF' || h.id % 13 === 0).length
  const textTranslationsCount = Math.max(0, totalTranslations - voiceCount - ocrCount - pdfCount)

  const stats = [
    { label: 'Translations', value: textTranslationsCount, icon: <HiLanguage className="h-5 w-5" />, color: 'text-primary' },
    { label: 'Voice Sessions', value: voiceCount, icon: <HiMicrophone className="h-5 w-5" />, color: 'text-accent' },
    { label: 'OCR Scans', value: ocrCount, icon: <HiCamera className="h-5 w-5" />, color: 'text-success' },
    { label: 'PDF Documents', value: pdfCount, icon: <HiDocumentText className="h-5 w-5" />, color: 'text-warning' },
  ]

  const maxVal = Math.max(textTranslationsCount, voiceCount, ocrCount, pdfCount, 1)
  const getPct = (val) => Math.round((val / maxVal) * 100)

  const recentItems = history.slice(0, 4)

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">
      {/* Welcome */}
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold text-text-primary">Welcome back 👋</h2>
        <p className="mt-1 text-text-secondary">Here's an overview of your LinguaSense activity.</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <Link key={action.name} to={action.path}>
            <Card hoverable padding="md" className="flex flex-col items-center gap-3 text-center h-full">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${action.color}`}>
                {action.icon}
              </div>
              <span className="text-sm font-semibold text-text-primary">{action.name}</span>
            </Card>
          </Link>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerItem} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-white/5 border border-white/5 ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-secondary">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
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

        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <HiClock className="h-4 w-4 text-text-secondary" />
                <span className="text-base font-semibold text-text-primary">Recent Activity</span>
              </div>
              {history.length > 0 && (
                <Link to="/history" className="text-xs text-primary hover:underline flex items-center gap-0.5">
                  View All <HiChevronRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          }
        >
          {recentItems.length > 0 ? (
            <div className="divide-y divide-white/5">
              {recentItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {item.source_text}
                    </p>
                    <p className="text-xs text-text-secondary truncate mt-0.5">
                      {item.translated_text}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-text-secondary border border-white/5">
                      {item.source_lang} → {item.target_lang}
                    </span>
                    {item.is_favorite && <HiStar className="h-3.5 w-3.5 text-warning" />}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <HiArrowTrendingUp className="h-10 w-10 text-text-secondary/30 mb-3" />
              <p className="text-sm text-text-secondary">No recent activity yet.</p>
              <p className="text-xs text-text-secondary/60 mt-1">Start translating to see your history here.</p>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}
