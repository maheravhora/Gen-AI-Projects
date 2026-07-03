import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiClock, HiArrowDownTray } from 'react-icons/hi2'
import { staggerContainer, staggerItem } from '../animations/variants'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import HistoryFilters from '../components/history/HistoryFilters'
import HistoryCard from '../components/history/HistoryCard'
import { useHistory } from '../hooks/useHistory'

export default function HistoryPage() {
  const {
    history, isLoading, error,
    searchQuery, setSearchQuery,
    filters = { type: 'all', dateRange: 'all' }, setFilters,
    fetchHistory, deleteItem, toggleFavorite, exportCSV,
  } = useHistory()

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleToggleFav = (id) => {
    const item = history.find((h) => h.id === id)
    if (item) {
      toggleFavorite(item)
    }
  }

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

      {/* Filters & Search */}
      <motion.div variants={staggerItem}>
        <HistoryFilters
          search={searchQuery}
          onSearchChange={setSearchQuery}
          languageFilter={filters.type === 'all' ? '' : filters.type}
          onLanguageFilterChange={(val) => setFilters && setFilters(prev => ({ ...prev, type: val || 'all' }))}
          dateFilter={filters.dateRange === 'all' ? '' : filters.dateRange}
          onDateFilterChange={(val) => setFilters && setFilters(prev => ({ ...prev, dateRange: val || 'all' }))}
        />
      </motion.div>

      {error && <p className="text-sm text-danger">{error}</p>}

      {/* History list */}
      {history.length > 0 ? (
        <motion.div variants={staggerItem} className="space-y-4">
          <AnimatePresence>
            {history.map((item, index) => (
              <HistoryCard
                key={item.id || index}
                item={item}
                onDelete={deleteItem}
                onToggleFavorite={handleToggleFav}
                delay={index * 0.05}
              />
            ))}
          </AnimatePresence>
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
