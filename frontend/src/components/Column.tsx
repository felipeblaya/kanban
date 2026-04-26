'use client'

import { useState, useRef, useEffect } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import Card from './Card'
import AddCardForm from './AddCardForm'
import CardModal from './CardModal'
import { Column as ColumnType, Card as CardType } from '@/lib/types'

interface ColumnProps {
  column: ColumnType
  cards: CardType[]
  addCard: (colId: string, title: string, details: string) => void
  deleteCard: (cardId: string, colId: string) => void
  renameColumn: (colId: string, newName: string) => void
  editCard: (cardId: string, updates: Partial<Pick<CardType, 'title' | 'details'>>) => void
}

export default function Column({ column, cards, addCard, deleteCard, renameColumn, editCard }: ColumnProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(column.name)
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeCard = activeCardId ? (cards.find(c => c.id === activeCardId) ?? null) : null

  useEffect(() => {
    if (isRenaming) inputRef.current?.focus()
  }, [isRenaming])

  function startRename() {
    setRenameValue(column.name)
    setIsRenaming(true)
  }

  function commitRename() {
    if (renameValue.trim()) renameColumn(column.id, renameValue)
    setIsRenaming(false)
  }

  function handleRenameKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitRename()
    if (e.key === 'Escape') setIsRenaming(false)
  }

  function handleAddCard(title: string, details: string) {
    addCard(column.id, title, details)
    setShowAddForm(false)
  }

  function handleDeleteCard(cardId: string) {
    deleteCard(cardId, column.id)
    setActiveCardId(null)
  }

  return (
    <>
      <div
        data-testid="column"
        className="flex h-full w-72 flex-none flex-col rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.07)' }}
      >
        {/* Column header */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-3">
          {isRenaming ? (
            <input
              ref={inputRef}
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={handleRenameKey}
              data-testid="column-rename-input"
              className="flex-1 rounded-lg bg-white/20 px-2.5 py-1 text-sm font-bold text-white outline-none ring-2 ring-accent"
            />
          ) : (
            <button
              onClick={startRename}
              data-testid="column-name"
              className="flex-1 text-left text-sm font-bold text-white/90 hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              {column.name}
            </button>
          )}
          <span
            data-testid="card-count"
            className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/15 px-1.5 text-xs font-semibold text-white/70"
          >
            {cards.length}
          </span>
        </div>

        {/* Droppable card list */}
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={[
                'flex flex-1 flex-col gap-2.5 overflow-y-auto px-3 py-1 min-h-0',
                snapshot.isDraggingOver ? 'bg-white/5 rounded-xl' : '',
              ].join(' ')}
            >
              {cards.length === 0 && !snapshot.isDraggingOver && (
                <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-white/15 py-10 text-xs text-white/30">
                  Drop cards here
                </div>
              )}
              {cards.map((card, index) => (
                <Card
                  key={card.id}
                  card={card}
                  index={index}
                  onClick={() => setActiveCardId(card.id)}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Add card footer */}
        <div className="px-3 pb-3 pt-2">
          {showAddForm ? (
            <AddCardForm
              onSave={handleAddCard}
              onCancel={() => setShowAddForm(false)}
            />
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full rounded-xl border-2 border-dashed border-white/15 py-2.5 text-sm text-white/50 transition-all hover:border-accent/60 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              + Add card
            </button>
          )}
        </div>
      </div>

      {activeCard && (
        <CardModal
          card={activeCard}
          onClose={() => setActiveCardId(null)}
          onDelete={() => handleDeleteCard(activeCard.id)}
          onEdit={updates => editCard(activeCard.id, updates)}
        />
      )}
    </>
  )
}
