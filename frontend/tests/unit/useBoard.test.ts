import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBoard } from '@/hooks/useBoard'

describe('useBoard', () => {
  it('returns initial state with 5 columns and correct card counts', () => {
    const { result } = renderHook(() => useBoard())
    expect(result.current.state.columns).toHaveLength(5)
    expect(result.current.state.columns[0].cardIds).toHaveLength(3)
    expect(result.current.state.columns[1].cardIds).toHaveLength(3)
    expect(result.current.state.columns[2].cardIds).toHaveLength(2)
    expect(result.current.state.columns[3].cardIds).toHaveLength(2)
    expect(result.current.state.columns[4].cardIds).toHaveLength(2)
  })

  it('moveCard within same column reorders correctly', () => {
    const { result } = renderHook(() => useBoard())
    const col = result.current.state.columns[0]
    const movedCard = col.cardIds[0]
    act(() => {
      result.current.moveCard(movedCard, 'col-1', 'col-1', 0, 2)
    })
    expect(result.current.state.columns[0].cardIds[2]).toBe(movedCard)
    expect(result.current.state.columns[0].cardIds).toHaveLength(3)
  })

  it('moveCard across columns: source loses card, dest gains it at correct index', () => {
    const { result } = renderHook(() => useBoard())
    const cardId = result.current.state.columns[0].cardIds[0]
    act(() => {
      result.current.moveCard(cardId, 'col-1', 'col-2', 0, 0)
    })
    expect(result.current.state.columns[0].cardIds).not.toContain(cardId)
    expect(result.current.state.columns[1].cardIds[0]).toBe(cardId)
    expect(result.current.state.columns[0].cardIds).toHaveLength(2)
    expect(result.current.state.columns[1].cardIds).toHaveLength(4)
  })

  it('addCard appends card to column and adds entry to cards map', () => {
    const { result } = renderHook(() => useBoard())
    const initialCount = result.current.state.columns[0].cardIds.length
    act(() => {
      result.current.addCard('col-1', 'New Task', 'Details here')
    })
    expect(result.current.state.columns[0].cardIds).toHaveLength(initialCount + 1)
    const newId = result.current.state.columns[0].cardIds[initialCount]
    expect(result.current.state.cards[newId]).toMatchObject({ title: 'New Task', details: 'Details here' })
  })

  it('deleteCard removes card from column and cards map', () => {
    const { result } = renderHook(() => useBoard())
    const cardId = result.current.state.columns[0].cardIds[0]
    act(() => {
      result.current.deleteCard(cardId, 'col-1')
    })
    expect(result.current.state.columns[0].cardIds).not.toContain(cardId)
    expect(result.current.state.cards[cardId]).toBeUndefined()
  })

  it('renameColumn updates name and leaves other columns unchanged', () => {
    const { result } = renderHook(() => useBoard())
    act(() => {
      result.current.renameColumn('col-1', 'Sprint 1')
    })
    expect(result.current.state.columns[0].name).toBe('Sprint 1')
    expect(result.current.state.columns[1].name).toBe('To Do')
  })

  it('editCard updates title without changing other fields', () => {
    const { result } = renderHook(() => useBoard())
    const cardId = result.current.state.columns[0].cardIds[0]
    const originalDetails = result.current.state.cards[cardId].details
    act(() => {
      result.current.editCard(cardId, { title: 'Updated Title' })
    })
    expect(result.current.state.cards[cardId].title).toBe('Updated Title')
    expect(result.current.state.cards[cardId].details).toBe(originalDetails)
  })

  it('editCard updates details correctly', () => {
    const { result } = renderHook(() => useBoard())
    const cardId = result.current.state.columns[0].cardIds[0]
    act(() => {
      result.current.editCard(cardId, { details: 'New details' })
    })
    expect(result.current.state.cards[cardId].details).toBe('New details')
  })

  it('renameColumn with empty string does not update name', () => {
    const { result } = renderHook(() => useBoard())
    const originalName = result.current.state.columns[0].name
    act(() => {
      result.current.renameColumn('col-1', '')
    })
    expect(result.current.state.columns[0].name).toBe(originalName)
  })

  it('renameColumn with whitespace-only string does not update name', () => {
    const { result } = renderHook(() => useBoard())
    const originalName = result.current.state.columns[0].name
    act(() => {
      result.current.renameColumn('col-1', '   ')
    })
    expect(result.current.state.columns[0].name).toBe(originalName)
  })

  it('moveCard to non-existent column leaves state unchanged', () => {
    const { result } = renderHook(() => useBoard())
    const cardId = result.current.state.columns[0].cardIds[0]
    const prevState = result.current.state
    act(() => {
      result.current.moveCard(cardId, 'col-1', 'col-99', 0, 0)
    })
    expect(result.current.state).toBe(prevState)
  })
})
