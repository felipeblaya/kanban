'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Card } from '@/lib/types'

interface CardModalProps {
  card: Card
  onClose: () => void
  onDelete: () => void
  onEdit: (updates: Partial<Pick<Card, 'title' | 'details'>>) => void
}

export default function CardModal({ card, onClose, onDelete, onEdit }: CardModalProps) {
  const [title, setTitle] = useState(card.title)
  const [details, setDetails] = useState(card.details)
  const [mounted, setMounted] = useState(false)

  const titleRef = useRef(title)
  const detailsRef = useRef(details)
  titleRef.current = title
  detailsRef.current = details

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    setTitle(card.title)
    setDetails(card.details)
  }, [card.id])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') saveAndClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  function saveAndClose() {
    const t = titleRef.current.trim()
    if (t) onEdit({ title: t, details: detailsRef.current })
    onClose()
  }

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) saveAndClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Edit card"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-navy">Edit Card</h2>
          <button
            onClick={saveAndClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-gray-100 hover:text-navy transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              Title
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              Details
            </label>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={saveAndClose}
            className="flex-1 rounded-xl bg-secondary py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Save & Close
          </button>
          <button
            onClick={onDelete}
            className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
