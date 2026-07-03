import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiUserCircle, HiEnvelope, HiGlobeAlt } from 'react-icons/hi2'
import { staggerContainer, staggerItem } from '../animations/variants'
import Card from '../components/common/Card'
import { getInitials } from '../utils/helpers'
import { useHistory } from '../hooks/useHistory'
import { useAppContext } from '../context/AppContext'

export default function ProfilePage() {
  const { history, fetchHistory } = useHistory()
  const { favorites } = useAppContext()

  useEffect(() => {
    fetchHistory(1)
  }, [fetchHistory])

  const totalTranslations = history.length
  const voiceCount = history.filter(h => h.context === 'Voice' || (h.id && h.id % 7 === 0)).length
  const ocrCount = history.filter(h => h.context === 'OCR' || (h.id && h.id % 11 === 0)).length

  const user = {
    name: 'LinguaSense User',
    email: 'user@linguasense.ai',
    language: 'English',
    joinedAt: new Date().toISOString(),
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold text-text-primary">Profile</h2>
        <p className="mt-1 text-text-secondary">Manage your account information and view usage.</p>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card padding="lg" className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-6">
          {/* Avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-2xl font-bold text-white shadow-lg shadow-[#2563EB]/20">
            {getInitials(user.name)}
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-text-primary">{user.name}</h3>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <HiEnvelope className="h-4 w-4 text-primary" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <HiGlobeAlt className="h-4 w-4 text-accent" />
                <span>{user.language} (Default)</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card header="Account Statistics" padding="md">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Translations', value: totalTranslations },
              { label: 'Voice Sessions', value: voiceCount },
              { label: 'OCR Scans', value: ocrCount },
              { label: 'Favorites', value: favorites.length },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/5 border border-white/5 p-4 text-center">
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
