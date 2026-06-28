import { motion } from 'framer-motion'
import { HiCog6Tooth } from 'react-icons/hi2'
import { staggerContainer, staggerItem } from '../animations/variants'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useAppContext } from '../context/AppContext'
import { LANGUAGES, TONES, CONTEXTS } from '../utils/constants'

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useAppContext()

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
        <p className="mt-1 text-text-secondary">Configure your translation preferences.</p>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card header="Translation Defaults" padding="md">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Default Source Language</label>
              <select
                value={settings.defaultSourceLang}
                onChange={(e) => updateSettings({ defaultSourceLang: e.target.value })}
                className="w-full h-10 rounded-xl border border-white/8 bg-white/5 px-3 text-sm text-text-primary outline-none focus:border-primary/50"
              >
                {LANGUAGES.map((l) => <option key={l.code} value={l.code} className="bg-card">{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Default Target Language</label>
              <select
                value={settings.defaultTargetLang}
                onChange={(e) => updateSettings({ defaultTargetLang: e.target.value })}
                className="w-full h-10 rounded-xl border border-white/8 bg-white/5 px-3 text-sm text-text-primary outline-none focus:border-primary/50"
              >
                {LANGUAGES.map((l) => <option key={l.code} value={l.code} className="bg-card">{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Default Tone</label>
              <select
                value={settings.defaultTone}
                onChange={(e) => updateSettings({ defaultTone: e.target.value })}
                className="w-full h-10 rounded-xl border border-white/8 bg-white/5 px-3 text-sm text-text-primary outline-none focus:border-primary/50"
              >
                {TONES.map((t) => <option key={t} value={t} className="bg-card">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Default Context</label>
              <select
                value={settings.defaultContext}
                onChange={(e) => updateSettings({ defaultContext: e.target.value })}
                className="w-full h-10 rounded-xl border border-white/8 bg-white/5 px-3 text-sm text-text-primary outline-none focus:border-primary/50"
              >
                {CONTEXTS.map((c) => <option key={c} value={c} className="bg-card">{c}</option>)}
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card header="Preferences" padding="md">
          <div className="space-y-4">
            {[
              { key: 'autoDetect', label: 'Auto-detect source language' },
              { key: 'saveHistory', label: 'Save translation history' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-text-primary">{label}</span>
                <button
                  onClick={() => updateSettings({ [key]: !settings[key] })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${settings[key] ? 'bg-primary' : 'bg-white/20'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings[key] ? 'translate-x-5' : ''}`} />
                </button>
              </label>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Button variant="danger" size="sm" onClick={resetSettings}>
          Reset to Defaults
        </Button>
      </motion.div>
    </motion.div>
  )
}
