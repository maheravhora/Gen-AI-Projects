import { useState, useCallback } from 'react'
import { getHistory, deleteHistory, toggleFavorite } from '../services/api'
import { downloadAsFile } from '../utils/helpers'

export function useHistory() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    type: 'all',
    dateRange: 'all',
    favorite: false,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    hasMore: false,
  })

  const fetchHistory = useCallback(
    async (page = 1) => {
      setIsLoading(true)
      setError(null)

      try {
        const params = {
          page,
          limit: 20,
          ...(searchQuery && { q: searchQuery }),
          ...(filters.type !== 'all' && { type: filters.type }),
          ...(filters.dateRange !== 'all' && { range: filters.dateRange }),
          ...(filters.favorite && { favorite: true }),
        }

        const response = await getHistory(params)
        const data = response.data

        const items = data.items || data.history || data || []
        setHistory(page === 1 ? items : (prev) => [...prev, ...items])
        setPagination({
          page,
          total: data.total || items.length,
          hasMore: data.has_more ?? items.length === 20,
        })
      } catch (err) {
        setError(err.message || 'Failed to load history')
      } finally {
        setIsLoading(false)
      }
    },
    [searchQuery, filters]
  )

  const deleteItem = useCallback(async (id) => {
    try {
      await deleteHistory(id)
      setHistory((prev) => prev.filter((item) => item.id !== id))
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }))
    } catch (err) {
      setError(err.message || 'Failed to delete item')
    }
  }, [])

  const toggleFav = useCallback(async (item) => {
    try {
      await toggleFavorite({ id: item.id, favorite: !item.favorite })
      setHistory((prev) =>
        prev.map((h) => (h.id === item.id ? { ...h, favorite: !h.favorite } : h))
      )
    } catch (err) {
      setError(err.message || 'Failed to update favorite')
    }
  }, [])

  const exportCSV = useCallback(() => {
    if (!history.length) return

    const headers = ['Date', 'Source Text', 'Translated Text', 'Source Lang', 'Target Lang', 'Tone']
    const rows = history.map((item) => [
      item.timestamp || item.created_at || '',
      `"${(item.source_text || item.sourceText || '').replace(/"/g, '""')}"`,
      `"${(item.translated_text || item.translatedText || '').replace(/"/g, '""')}"`,
      item.source_lang || item.sourceLang || '',
      item.target_lang || item.targetLang || '',
      item.tone || '',
    ])

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    downloadAsFile(csv, `linguasense_history_${Date.now()}.csv`, 'text/csv')
  }, [history])

  const loadMore = useCallback(() => {
    if (pagination.hasMore && !isLoading) {
      fetchHistory(pagination.page + 1)
    }
  }, [pagination, isLoading, fetchHistory])

  return {
    history,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    pagination,
    fetchHistory,
    deleteItem,
    toggleFavorite: toggleFav,
    exportCSV,
    loadMore,
  }
}

export default useHistory
