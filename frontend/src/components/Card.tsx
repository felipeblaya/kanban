'use client'

import { Draggable } from '@hello-pangea/dnd'
import { Card as CardType } from '@/lib/types'

interface CardProps {
  card: CardType
  index: number
  onClick: () => void
  onDelete: () => void
}

export default function Card({ card, index, onClick, onDelete }: CardProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          data-testid="card"
          className={[
            'group relative rounded-xl bg-white px-4 py-3 shadow-sm cursor-pointer select-none',
            'transition-all duration-150',
            'hover:shadow-md hover:border-primary hover:border',
            'border border-transparent',
            snapshot.isDragging ? 'rotate-1 opacity-95 shadow-xl ring-2 ring-primary/30' : '',
          ].join(' ')}
        >
          <button
            onClick={e => { e.stopPropagation(); onDelete() }}
            aria-label="Delete card"
            className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
          >
            ×
          </button>
          <p className="text-sm font-semibold text-navy leading-snug pr-5">{card.title}</p>
          {card.details && (
            <p className="mt-1.5 text-xs text-muted leading-relaxed line-clamp-2">{card.details}</p>
          )}
        </div>
      )}
    </Draggable>
  )
}
