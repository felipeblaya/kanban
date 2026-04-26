'use client'

import { Draggable } from '@hello-pangea/dnd'
import { Card as CardType } from '@/lib/types'

interface CardProps {
  card: CardType
  index: number
  onClick: () => void
}

export default function Card({ card, index, onClick }: CardProps) {
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
            'rounded-xl bg-white px-4 py-3 shadow-sm cursor-pointer select-none',
            'transition-all duration-150',
            'hover:shadow-md hover:border-primary hover:border',
            'border border-transparent',
            snapshot.isDragging ? 'rotate-1 opacity-95 shadow-xl ring-2 ring-primary/30' : '',
          ].join(' ')}
        >
          <p className="text-sm font-semibold text-navy leading-snug">{card.title}</p>
          {card.details && (
            <p className="mt-1.5 text-xs text-muted leading-relaxed line-clamp-2">{card.details}</p>
          )}
        </div>
      )}
    </Draggable>
  )
}
