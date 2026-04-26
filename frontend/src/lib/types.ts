export interface Card {
  id: string
  title: string
  details: string
}

export interface Column {
  id: string
  name: string
  cardIds: string[]
}

export interface BoardState {
  cards: Record<string, Card>
  columns: Column[]
}
