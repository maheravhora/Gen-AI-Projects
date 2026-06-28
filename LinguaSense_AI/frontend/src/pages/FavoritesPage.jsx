import { motion } from 'framer-motion'
import { HiStar } from 'react-icons/hi2'
import { staggerContainer, staggerItem } from '../animations/variants'
import Card from '../components/common/Card'
import EmptyState from '../components/common/EmptyState'
import { useAppContext } from '../context/AppContext'
import { truncateText, formatDate } from '../utils/helpers'

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useAppContext()

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold text-text-primary">Favorites</h2>
        <p className="mt-1 text-text-secondary">Your saved translations for quick access.</p>
      </motion.div>

      {favorites.length > 0 ? (
        <motion.div variants={staggerItem} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((item) => (
            <Card key={item.id} padding="md" hoverable>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary">{truncateText(item.sourceText, 80)}</p>
                  <p className="mt-1 text-sm text-accent">{truncateText(item.translatedText, 80)}</p>
                  <p className="mt-2 text-xs text-text-secondary">
                    {item.sourceLang} → {item.targetLang}
                    {item.favoritedAt && ` · ${formatDate(item.favoritedAt)}`}
                  </p>
                </div>
                <button onClick={() => removeFavorite(item.id)} className="ml-2 shrink-0 rounded-lg p-1.5 text-warning hover:bg-white/5 transition-colors">
                  <HiStar className="h-4 w-4 fill-current" />
                </button>
              </div>
            </Card>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={<HiStar className="h-8 w-8" />}
          title="No favorites yet"
          description="Star translations to save them here for quick access."
        />
      )}
    </motion.div>
  )
}
