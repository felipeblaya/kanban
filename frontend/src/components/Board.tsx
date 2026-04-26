'use client'

import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import Column from './Column'
import { BoardState, Card } from '@/lib/types'

interface BoardProps {
  state: BoardState
  moveCard: (cardId: string, sourceColId: string, destColId: string, sourceIndex: number, destIndex: number) => void
  addCard: (colId: string, title: string, details: string) => void
  deleteCard: (cardId: string, colId: string) => void
  renameColumn: (colId: string, newName: string) => void
  editCard: (cardId: string, updates: Partial<Pick<Card, 'title' | 'details'>>) => void
}

export default function Board({ state, moveCard, addCard, deleteCard, renameColumn, editCard }: BoardProps) {
  function onDragEnd(result: DropResult) {
    const { draggableId, source, destination } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    moveCard(draggableId, source.droppableId, destination.droppableId, source.index, destination.index)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-screen w-full overflow-hidden bg-navy">
        <div className="flex h-full w-full gap-4 overflow-x-auto p-6 pb-4">
          {state.columns.map(column => (
            <Column
              key={column.id}
              column={column}
              cards={column.cardIds.map(id => state.cards[id]).filter(Boolean)}
              addCard={addCard}
              deleteCard={deleteCard}
              renameColumn={renameColumn}
              editCard={editCard}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  )
}
