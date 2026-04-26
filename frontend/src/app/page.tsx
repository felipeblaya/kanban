'use client'

import Board from '@/components/Board'
import { useBoard } from '@/hooks/useBoard'

export default function Home() {
  const board = useBoard()
  return <Board {...board} />
}
