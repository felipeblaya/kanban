import { useState, useCallback } from 'react'
import { nanoid } from 'nanoid'
import { BoardState, Card } from '@/lib/types'
import { INITIAL_DATA } from '@/lib/initialData'

export function useBoard() {
  const [state, setState] = useState<BoardState>(INITIAL_DATA)

  const moveCard = useCallback((
    cardId: string,
    sourceColId: string,
    destColId: string,
    sourceIndex: number,
    destIndex: number,
  ) => {
    setState(prev => {
      const sourceCol = prev.columns.find(c => c.id === sourceColId)
      const destCol = prev.columns.find(c => c.id === destColId)
      if (!sourceCol || !destCol) return prev

      const newSourceIds = [...sourceCol.cardIds]
      newSourceIds.splice(sourceIndex, 1)

      if (sourceColId === destColId) {
        newSourceIds.splice(destIndex, 0, cardId)
        return {
          ...prev,
          columns: prev.columns.map(col =>
            col.id === sourceColId ? { ...col, cardIds: newSourceIds } : col
          ),
        }
      }

      const newDestIds = [...destCol.cardIds]
      newDestIds.splice(destIndex, 0, cardId)

      return {
        ...prev,
        columns: prev.columns.map(col => {
          if (col.id === sourceColId) return { ...col, cardIds: newSourceIds }
          if (col.id === destColId) return { ...col, cardIds: newDestIds }
          return col
        }),
      }
    })
  }, [])

  const addCard = useCallback((colId: string, title: string, details: string) => {
    const id = nanoid()
    setState(prev => ({
      ...prev,
      cards: { ...prev.cards, [id]: { id, title, details } },
      columns: prev.columns.map(col =>
        col.id === colId ? { ...col, cardIds: [...col.cardIds, id] } : col
      ),
    }))
  }, [])

  const deleteCard = useCallback((cardId: string, colId: string) => {
    setState(prev => {
      const { [cardId]: _removed, ...remainingCards } = prev.cards
      return {
        ...prev,
        cards: remainingCards,
        columns: prev.columns.map(col =>
          col.id === colId ? { ...col, cardIds: col.cardIds.filter(id => id !== cardId) } : col
        ),
      }
    })
  }, [])

  const renameColumn = useCallback((colId: string, newName: string) => {
    if (!newName.trim()) return
    setState(prev => ({
      ...prev,
      columns: prev.columns.map(col =>
        col.id === colId ? { ...col, name: newName.trim() } : col
      ),
    }))
  }, [])

  const editCard = useCallback((cardId: string, updates: Partial<Pick<Card, 'title' | 'details'>>) => {
    setState(prev => ({
      ...prev,
      cards: {
        ...prev.cards,
        [cardId]: { ...prev.cards[cardId], ...updates },
      },
    }))
  }, [])

  return { state, moveCard, addCard, deleteCard, renameColumn, editCard }
}
