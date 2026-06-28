import { motion } from 'framer-motion'
import { HiUserCircle, HiEnvelope, HiGlobeAlt } from 'react-icons/hi2'
import { staggerContainer, staggerItem } from '../animations/variants'
import Card from '../components/common/Card'
import { getInitials } from '../utils/helpers'

export default function ProfilePage() {
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
        <p className="mt-1 text-text-secondary">Manage your account information.</p>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card padding="lg" className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-6">
          {/* Avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-2xl font-bold text-primary">
            {getInitials(user.name)}
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-text-primary">{user.name}</h3>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <HiEnvelope className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <HiGlobeAlt className="h-4 w-4" />
                <span>{user.language}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card header="Account Statistics" padding="md">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Translations', value: '0' },
              { label: 'Voice Sessions', value: '0' },
              { label: 'OCR Scans', value: '0' },
              { label: 'Favorites', value: '0' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
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
