import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiClock, HiTrash, HiStar, HiMagnifyingGlass, HiArrowDownTray } from 'react-icons/hi2'
import { staggerContainer, staggerItem } from '../animations/variants'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import { useHistory } from '../hooks/useHistory'
import { formatDate, truncateText } from '../utils/helpers'

export default function HistoryPage() {
  const {
    history, isLoading, error,
    searchQuery, setSearchQuery,
    fetchHistory, deleteItem, toggleFavorite, exportCSV,
  } = useHistory()

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={staggerItem} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">History</h2>
          <p className="mt-1 text-text-secondary">View and manage your translation history.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={exportCSV} leftIcon={<HiArrowDownTray className="h-4 w-4" />}>
          Export CSV
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div variants={staggerItem} className="relative max-w-md">
        <HiMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search history…"
          className="w-full h-10 rounded-xl border border-white/8 bg-white/5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none focus:border-primary/50"
        />
      </motion.div>

      {error && <p className="text-sm text-danger">{error}</p>}

      {/* History list */}
      {history.length > 0 ? (
        <motion.div variants={staggerItem} className="space-y-3">
          {history.map((item) => (
            <Card key={item.id} padding="md" className="group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary">{truncateText(item.source_text || item.sourceText, 120)}</p>
                  <p className="mt-1 text-sm text-accent">{truncateText(item.translated_text || item.translatedText, 120)}</p>
                  <p className="mt-2 text-xs text-text-secondary">
                    {item.source_lang || item.sourceLang} → {item.target_lang || item.targetLang}
                    {' · '}
                    {formatDate(item.timestamp || item.created_at)}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleFavorite(item)} className="rounded-lg p-1.5 text-text-secondary hover:text-warning hover:bg-white/5 transition-colors">
                    <HiStar className={`h-4 w-4 ${item.favorite ? 'text-warning fill-warning' : ''}`} />
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="rounded-lg p-1.5 text-text-secondary hover:text-danger hover:bg-white/5 transition-colors">
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      ) : !isLoading ? (
        <EmptyState
          icon={<HiClock className="h-8 w-8" />}
          title="No history yet"
          description="Your translation history will appear here once you start translating."
        />
      ) : null}
    </motion.div>
  )
}
